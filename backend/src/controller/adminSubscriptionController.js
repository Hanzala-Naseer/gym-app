const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

///////////////////////////////////////////////////////////////
// LIST ALL TIERS (Admin + Public)
///////////////////////////////////////////////////////////////

const listTiers = async (req, res) => {
  try {
    const tiers = await prisma.subscriptionTier.findMany({
      include: { prices: { where: { isActive: true } } },
      orderBy: { accessTier: "asc" },
    });

    res.json({ success: true, tiers });
  } catch (err) {
    console.error("listTiers error:", err);
    res.status(500).json({ success: false, message: "Error fetching tiers" });
  }
};

///////////////////////////////////////////////////////////////
// CREATE TIER (Admin only)
///////////////////////////////////////////////////////////////

const createTier = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { name, slug, description, accessTier } = req.body;

    if (!name || !slug || !accessTier) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, slug, and accessTier required",
        });
    }

    const tier = await prisma.subscriptionTier.create({
      data: { name, slug, description, accessTier: parseInt(accessTier) },
    });

    res.status(201).json({ success: true, tier });
  } catch (err) {
    console.error("createTier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// UPDATE TIER (Admin only)
///////////////////////////////////////////////////////////////

const updateTier = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { id } = req.params;
    const { name, description, accessTier, isActive, isFeatured } = req.body;

    const tier = await prisma.subscriptionTier.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        accessTier: accessTier ? parseInt(accessTier) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      },
    });

    res.json({ success: true, tier });
  } catch (err) {
    console.error("updateTier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// CREATE PRICE (Admin only — creates in Stripe + DB)
///////////////////////////////////////////////////////////////

const createPrice = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { tierId, interval, priceCents, currency } = req.body;

    if (!tierId || !interval || !priceCents) {
      return res
        .status(400)
        .json({
          success: false,
          message: "tierId, interval, and priceCents required",
        });
    }

    // Get tier for name
    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
    });
    if (!tier)
      return res
        .status(404)
        .json({ success: false, message: "Tier not found" });

    // 1. Create Stripe Product (if not exists) or use existing
    const product = await stripe.products.create({
      name: `${tier.name} — ${interval}`,
      description: tier.description || "",
      metadata: { tierId, accessTier: String(tier.accessTier) },
    });

    // 2. Create Stripe Price
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: parseInt(priceCents),
      currency: currency || "pkr",
      recurring: { interval },
    });

    // 3. Save to DB
    const price = await prisma.subscriptionPrice.create({
      data: {
        tierId,
        stripeProductId: product.id,
        stripePriceId: stripePrice.id,
        interval,
        priceCents: parseInt(priceCents),
        currency: currency || "pkr",
      },
    });

    res.status(201).json({
      success: true,
      message: "Price created successfully",
      price,
    });
  } catch (err) {
    console.error("createPrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// UPDATE PRICE (Admin only — deactivates old, creates new in Stripe)
///////////////////////////////////////////////////////////////

const updatePrice = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { id } = req.params;
    const { priceCents, isActive } = req.body;

    const existing = await prisma.subscriptionPrice.findUnique({
      where: { id },
      include: { tier: true },
    });

    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Price not found" });

    // If price changed, create NEW Stripe price (Stripe prices are immutable)
    let newStripePriceId = existing.stripePriceId;
    let newStripeProductId = existing.stripeProductId;

    if (priceCents && parseInt(priceCents) !== existing.priceCents) {
      const newStripePrice = await stripe.prices.create({
        product: existing.stripeProductId,
        unit_amount: parseInt(priceCents),
        currency: existing.currency,
        recurring: { interval: existing.interval },
      });
      newStripePriceId = newStripePrice.id;
    }

    // Update DB
    const updated = await prisma.subscriptionPrice.update({
      where: { id },
      data: {
        priceCents: priceCents ? parseInt(priceCents) : existing.priceCents,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        stripePriceId: newStripePriceId,
      },
    });

    res.json({ success: true, price: updated });
  } catch (err) {
    console.error("updatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// DEACTIVATE PRICE (Admin only)
///////////////////////////////////////////////////////////////

const deactivatePrice = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { id } = req.params;

    const price = await prisma.subscriptionPrice.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, message: "Price deactivated", price });
  } catch (err) {
    console.error("deactivatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// SYNC STRIPE PRICES (Admin utility)
///////////////////////////////////////////////////////////////

const syncStripePrices = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const prices = await stripe.prices.list({
      limit: 100,
      expand: ["data.product"],
    });

    const synced = [];
    for (const sp of prices.data) {
      if (!sp.product || sp.type !== "recurring") continue;

      // Try to find existing by stripePriceId
      const existing = await prisma.subscriptionPrice.findUnique({
        where: { stripePriceId: sp.id },
      });

      if (!existing) {
        // Need tierId — skip or create placeholder
        console.log(`Skipping unknown Stripe price: ${sp.id}`);
      } else {
        synced.push(existing);
      }
    }

    res.json({ success: true, count: synced.length });
  } catch (err) {
    console.error("syncStripePrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  listTiers,
  createTier,
  updateTier,
  createPrice,
  updatePrice,
  deactivatePrice,
  syncStripePrices,
};
