const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ---------------- Create Stripe Checkout Session ----------------
// async function createSubscriptionSession(req, res) {
//   const existingActive = await prisma.subscription.findFirst({
//     where: { userId: req.user.id, status: "active" },
//   });

//   if (existingActive) {
//     return res
//       .status(400)
//       .json({ message: "You already have an active subscription." });
//   }

//   try {
//     const { priceId } = req.body; // Stripe price ID for the plan
//     const userId = req.user.id;

//     if (!priceId)
//       return res.status(400).json({ message: "Price ID is required" });

//     // FIXED: Use CLIENT_URL instead of hardcoded fallback
//     const clientUrl = process.env.CLIENT_URL;
//     if (!clientUrl) {
//       console.error("CLIENT_URL is not defined in environment variables");
//       return res
//         .status(500)
//         .json({ message: "Server configuration error: CLIENT_URL missing" });
//     }

//     console.log("Using client URL:", clientUrl);

//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [{ price: priceId, quantity: 1 }],
//       customer_email: req.user.email,

//       // FIXED: Metadata for webhook to identify user
//       metadata: {
//         userId: userId,
//       },

//       success_url:
//         "https://example.com/payment-success?session_id={CHECKOUT_SESSION_ID}",

//       cancel_url: "https://example.com/payment-cancel",
//     });

//     console.log("Stripe session created:", session.id);

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("createSubscriptionSession error:", err);
//     res.status(500).json({ message: "Server error", detail: err.message });
//   }
// }

// async function stripeWebhook(req, res) {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   console.log("--- WEBHOOK FUNCTION STARTED ---");

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//     console.log(
//       `WEBHOOK SUCCESS: Signature Verified. Event Type: ${event.type}`,
//     );
//   } catch (err) {
//     console.error(
//       "WEBHOOK FATAL ERROR: Signature verification failed:",
//       err.message,
//     );
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       await handleSubscription(session);
//       break;
//     case "invoice.payment_succeeded":
//       // Handle recurring payments
//       const invoice = event.data.object;
//       console.log("Invoice payment succeeded:", invoice.id);
//       break;
//     case "customer.subscription.updated":
//       const subscription = event.data.object;
//       await updateSubscriptionStatus(subscription);
//       break;
//     case "customer.subscription.deleted":
//       const deletedSub = event.data.object;
//       await updateSubscriptionStatus(deletedSub);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// }

// async function handleSubscription(session) {
//   console.log("--- DEBUG: Starting handleSubscription ---");

//   const userId = session.metadata?.userId;
//   if (!userId) {
//     console.error("❌ Missing userId in metadata");
//     return;
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: { subscriptions: true },
//   });
//   if (!user) {
//     console.error("❌ User not found");
//     return;
//   }

//   // Check if the user already has an active subscription
//   const hasActive = user.subscriptions.some((sub) => sub.status === "active");
//   if (hasActive) {
//     console.log(`❌ User ${user.email} already has an active subscription`);
//     return; // Stop creating another subscription
//   }

//   const stripeSubscription = await stripe.subscriptions.retrieve(
//     session.subscription,
//   );

//   const priceId = stripeSubscription.items.data[0].price.id;

//   const price = await prisma.subscriptionPrice.findUnique({
//     where: { stripePriceId: priceId },
//     include: { tier: true },
//   });

//   if (!price) {
//     console.error("❌ No SubscriptionPrice found for:", priceId);
//     return;
//   }

//   const startAt = stripeSubscription.current_period_start
//     ? new Date(stripeSubscription.current_period_start * 1000)
//     : new Date();

//   const endAt = stripeSubscription.current_period_end
//     ? new Date(stripeSubscription.current_period_end * 1000)
//     : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // fallback 30 days

//   await prisma.subscription.create({
//     data: {
//       userId: user.id,
//       tierId: price.tier.id,
//       stripePriceId: price.stripePriceId,
//       stripeSubscriptionId: stripeSubscription.id,
//       startAt,
//       endAt,
//       status: "active",
//     },
//   });

//   console.log(`✅ Subscription saved: ${price.tier.name} (${price.interval})`);
// }

// async function updateSubscriptionStatus(subscription) {
//   await prisma.subscription.updateMany({
//     where: { stripeSubscriptionId: subscription.id },
//     data: { status: subscription.status },
//   });

//   console.log(
//     `Subscription ${subscription.id} updated to ${subscription.status}`,
//   );
// }

// async function getAllPlans(req, res) {
//   try {
//     const plans = await prisma.subscriptionPrice.findMany({
//       include: { tier: true },
//       orderBy: [{ tier: { accessTier: "asc" } }, { priceCents: "asc" }],
//     });

//     const formattedPlans = await Promise.all(
//       plans.map(async (p) => {
//         // Fetch price from Stripe and expand the product
//         const stripePrice = await stripe.prices.retrieve(p.stripePriceId, {
//           expand: ["product"],
//         });
//         const product = stripePrice.product;

//         // Parse features from comma-separated string
//         let features = [];
//         if (product.metadata && product.metadata.features) {
//           features = product.metadata.features.split(",").map((f) => f.trim());
//         }

//         return {
//           id: p.stripePriceId,
//           name: p.tier.name,
//           description:
//             product.metadata && product.metadata.description
//               ? product.metadata.description
//               : "",
//           features: features,
//           price: p.priceCents,
//           interval: p.interval === "month" ? "month" : "year",
//           accessTier: p.tier.accessTier,
//         };
//       }),
//     );

//     res.json({ plans: formattedPlans });
//   } catch (err) {
//     console.error("getAllPlans error:", err);
//     res.status(500).json({ message: "Failed to load plans" });
//   }
// }

async function createSubscriptionSession(req, res) {
  const existingActive = await prisma.subscription.findFirst({
    where: { userId: req.user.id, status: "active" },
  });

  if (existingActive) {
    return res
      .status(400)
      .json({ message: "You already have an active subscription." });
  }

  try {
    const { priceId } = req.body;
    const userId = req.user.id;

    if (!priceId)
      return res.status(400).json({ message: "Price ID is required" });

    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl) {
      console.error("CLIENT_URL is not defined");
      return res
        .status(500)
        .json({ message: "Server configuration error: CLIENT_URL missing" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: req.user.email,
      metadata: { userId: userId },
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("createSubscriptionSession error:", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}

async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleSubscription(event.data.object);
      break;
    case "invoice.payment_succeeded":
      console.log("Invoice payment succeeded:", event.data.object.id);
      break;
    case "customer.subscription.updated":
      await updateSubscriptionStatus(event.data.object);
      break;
    case "customer.subscription.deleted":
      await updateSubscriptionStatus(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSubscription(session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("Missing userId in metadata");
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscriptions: true },
  });
  if (!user) {
    console.error("User not found");
    return;
  }

  const hasActive = user.subscriptions.some((sub) => sub.status === "active");
  if (hasActive) {
    console.log(`User ${user.email} already has an active subscription`);
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription,
  );
  const priceId = stripeSubscription.items.data[0].price.id;

  const price = await prisma.subscriptionPrice.findUnique({
    where: { stripePriceId: priceId },
    include: { tier: true },
  });

  if (!price) {
    console.error("No SubscriptionPrice found for:", priceId);
    return;
  }

  const startAt = stripeSubscription.current_period_start
    ? new Date(stripeSubscription.current_period_start * 1000)
    : new Date();

  const endAt = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Calculate remaining visits based on tier
  const remainingVisits = price.tier.isUnlimited
    ? null
    : price.tier.monthlyVisitLimit || 0;

  await prisma.subscription.create({
    data: {
      userId: user.id,
      tierId: price.tier.id,
      stripePriceId: price.stripePriceId,
      stripeSubscriptionId: stripeSubscription.id,
      startAt,
      endAt,
      status: "active",
      remainingVisits,
    },
  });

  console.log(`✅ Subscription saved: ${price.tier.name} (${price.interval})`);
}

async function updateSubscriptionStatus(subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: subscription.status },
  });
  console.log(
    `Subscription ${subscription.id} updated to ${subscription.status}`,
  );
}

async function getAllPlans(req, res) {
  try {
    const plans = await prisma.subscriptionPrice.findMany({
      where: { isActive: true },
      include: {
        tier: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            accessTier: true,
            gymTierAccess: true,
            monthlyVisitLimit: true,
            isUnlimited: true,
            perks: true,
            isFeatured: true,
          },
        },
      },
      orderBy: [{ tier: { accessTier: "asc" } }, { priceCents: "asc" }],
    });

    const formattedPlans = await Promise.all(
      plans.map(async (p) => {
        const stripePrice = await stripe.prices.retrieve(p.stripePriceId, {
          expand: ["product"],
        });
        const product = stripePrice.product;

        let features = [];
        if (product.metadata && product.metadata.features) {
          features = product.metadata.features.split(",").map((f) => f.trim());
        }

        return {
          id: p.stripePriceId,
          name: p.tier.name,
          slug: p.tier.slug,
          description:
            product.metadata?.description || p.tier.description || "",
          features: features,
          perks: p.tier.perks,
          price: p.priceCents,
          pricePKR: p.priceCents / 100,
          interval: p.interval,
          accessTier: p.tier.accessTier,
          gymTierAccess: p.tier.gymTierAccess,
          monthlyVisitLimit: p.tier.monthlyVisitLimit,
          isUnlimited: p.tier.isUnlimited,
          isFeatured: p.tier.isFeatured,
          currency: p.currency,
        };
      }),
    );

    res.json({ success: true, plans: formattedPlans });
  } catch (err) {
    console.error("getAllPlans error:", err);
    res.status(500).json({ message: "Failed to load plans" });
  }
}

// ============================================================
// NEW: ADMIN TIER CRUD (From adminSubscriptionController)
// ============================================================

async function listTiers(req, res) {
  try {
    const tiers = await prisma.subscriptionTier.findMany({
      include: {
        prices: {
          where: { isActive: true },
          orderBy: { priceCents: "asc" },
        },
      },
      orderBy: { accessTier: "asc" },
    });

    res.json({ success: true, tiers });
  } catch (err) {
    console.error("listTiers error:", err);
    res.status(500).json({ success: false, message: "Error fetching tiers" });
  }
}

async function getTierById(req, res) {
  try {
    const { id } = req.params;

    const tier = await prisma.subscriptionTier.findUnique({
      where: { id },
      include: {
        prices: {
          where: { isActive: true },
          orderBy: { priceCents: "asc" },
        },
        subscriptions: {
          where: { status: { in: ["active", "past_due"] } },
          select: {
            id: true,
            status: true,
            userId: true,
            startAt: true,
            endAt: true,
            remainingVisits: true,
          },
        },
      },
    });

    if (!tier) {
      return res
        .status(404)
        .json({ success: false, message: "Tier not found" });
    }

    const activeSubscribers = tier.subscriptions.filter(
      (s) => s.status === "active",
    ).length;

    res.json({
      success: true,
      tier: {
        ...tier,
        activeSubscribers,
        subscriptionCount: tier.subscriptions.length,
      },
    });
  } catch (err) {
    console.error("getTierById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createTier(req, res) {
  try {
    const {
      name,
      slug,
      description,
      accessTier,
      gymTierAccess,
      monthlyVisitLimit,
      isUnlimited,
      perks,
      isActive,
      isFeatured,
    } = req.body;

    if (!name || !slug || accessTier === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          message: "name, slug, and accessTier are required",
        });
    }

    const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
    if (gymTierAccess && !validGymTiers.includes(gymTierAccess)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `gymTierAccess must be one of: ${validGymTiers.join(", ")}`,
        });
    }

    if (monthlyVisitLimit !== undefined && monthlyVisitLimit !== null) {
      const validLimits = [16, 30];
      if (!validLimits.includes(parseInt(monthlyVisitLimit))) {
        return res
          .status(400)
          .json({
            success: false,
            message: "monthlyVisitLimit must be 16, 30, or null",
          });
      }
    }

    const data = {
      name,
      slug,
      description: description || null,
      accessTier: parseInt(accessTier),
      gymTierAccess: gymTierAccess || "BASIC",
      monthlyVisitLimit:
        monthlyVisitLimit !== undefined
          ? monthlyVisitLimit === null
            ? null
            : parseInt(monthlyVisitLimit)
          : null,
      isUnlimited: isUnlimited !== undefined ? isUnlimited : false,
      perks: perks || null,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
    };

    const tier = await prisma.subscriptionTier.create({ data });
    res.status(201).json({ success: true, tier });
  } catch (err) {
    console.error("createTier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateTier(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      accessTier,
      gymTierAccess,
      monthlyVisitLimit,
      isUnlimited,
      perks,
      isActive,
      isFeatured,
    } = req.body;

    const existing = await prisma.subscriptionTier.findUnique({
      where: { id },
      include: { prices: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Tier not found" });
    }

    const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
    if (gymTierAccess && !validGymTiers.includes(gymTierAccess)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `gymTierAccess must be one of: ${validGymTiers.join(", ")}`,
        });
    }

    if (monthlyVisitLimit !== undefined && monthlyVisitLimit !== null) {
      const validLimits = [16, 30];
      if (!validLimits.includes(parseInt(monthlyVisitLimit))) {
        return res
          .status(400)
          .json({
            success: false,
            message: "monthlyVisitLimit must be 16, 30, or null",
          });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (accessTier !== undefined) updateData.accessTier = parseInt(accessTier);
    if (gymTierAccess !== undefined) updateData.gymTierAccess = gymTierAccess;
    if (monthlyVisitLimit !== undefined) {
      updateData.monthlyVisitLimit =
        monthlyVisitLimit === null ? null : parseInt(monthlyVisitLimit);
    }
    if (isUnlimited !== undefined) updateData.isUnlimited = isUnlimited;
    if (perks !== undefined) updateData.perks = perks;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const tier = await prisma.subscriptionTier.update({
      where: { id },
      data: updateData,
      include: { prices: { where: { isActive: true } } },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "UPDATED_PLAN",
        entityType: "SubscriptionTier",
        entityId: id,
        metadata: {
          tierName: tier.name,
          updatedFields: Object.keys(updateData),
        },
      },
    });

    res.json({ success: true, tier });
  } catch (err) {
    console.error("updateTier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deactivateTier(req, res) {
  try {
    const { id } = req.params;
    const tier = await prisma.subscriptionTier.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ success: true, message: "Tier deactivated", tier });
  } catch (err) {
    console.error("deactivateTier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// NEW: ADMIN PRICE CRUD
// ============================================================

async function createPrice(req, res) {
  try {
    const { tierId, interval, priceCents, currency } = req.body;

    if (!tierId || !interval || !priceCents) {
      return res
        .status(400)
        .json({
          success: false,
          message: "tierId, interval, and priceCents required",
        });
    }

    if (!["monthly", "yearly"].includes(interval)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "interval must be 'monthly' or 'yearly'",
        });
    }

    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
    });
    if (!tier) {
      return res
        .status(404)
        .json({ success: false, message: "Tier not found" });
    }

    const product = await stripe.products.create({
      name: `${tier.name} — ${interval}`,
      description: tier.description || "",
      metadata: {
        tierId,
        accessTier: String(tier.accessTier),
        gymTierAccess: tier.gymTierAccess,
        monthlyVisitLimit: String(tier.monthlyVisitLimit || "unlimited"),
        isUnlimited: String(tier.isUnlimited),
      },
    });

    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: parseInt(priceCents),
      currency: (currency || "pkr").toLowerCase(),
      recurring: { interval: interval === "monthly" ? "month" : "year" },
    });

    const price = await prisma.subscriptionPrice.create({
      data: {
        tierId,
        stripeProductId: product.id,
        stripePriceId: stripePrice.id,
        interval,
        priceCents: parseInt(priceCents),
        currency: currency || "pkr",
        isActive: true,
      },
      include: {
        tier: {
          select: {
            name: true,
            slug: true,
            gymTierAccess: true,
            monthlyVisitLimit: true,
            isUnlimited: true,
          },
        },
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Price created successfully", price });
  } catch (err) {
    console.error("createPrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updatePrice(req, res) {
  try {
    const { id } = req.params;
    const { priceCents, isActive, currency } = req.body;

    const existing = await prisma.subscriptionPrice.findUnique({
      where: { id },
      include: { tier: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Price not found" });
    }

    let newStripePriceId = existing.stripePriceId;

    if (priceCents && parseInt(priceCents) !== existing.priceCents) {
      const newStripePrice = await stripe.prices.create({
        product: existing.stripeProductId,
        unit_amount: parseInt(priceCents),
        currency: (currency || existing.currency).toLowerCase(),
        recurring: {
          interval: existing.interval === "monthly" ? "month" : "year",
        },
      });
      newStripePriceId = newStripePrice.id;
    }

    const updated = await prisma.subscriptionPrice.update({
      where: { id },
      data: {
        priceCents: priceCents ? parseInt(priceCents) : existing.priceCents,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        stripePriceId: newStripePriceId,
        currency: currency || existing.currency,
      },
      include: {
        tier: { select: { name: true, slug: true, gymTierAccess: true } },
      },
    });

    res.json({ success: true, price: updated });
  } catch (err) {
    console.error("updatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deactivatePrice(req, res) {
  try {
    const { id } = req.params;
    const price = await prisma.subscriptionPrice.update({
      where: { id },
      data: { isActive: false },
      include: { tier: { select: { name: true, slug: true } } },
    });
    res.json({ success: true, message: "Price deactivated", price });
  } catch (err) {
    console.error("deactivatePrice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function syncStripePrices(req, res) {
  try {
    const prices = await stripe.prices.list({
      limit: 100,
      expand: ["data.product"],
    });

    const synced = [];
    const skipped = [];

    for (const sp of prices.data) {
      if (!sp.product || sp.type !== "recurring") continue;

      const existing = await prisma.subscriptionPrice.findUnique({
        where: { stripePriceId: sp.id },
      });

      if (!existing) {
        skipped.push({ stripePriceId: sp.id, reason: "Not found in database" });
      } else {
        synced.push({
          id: existing.id,
          stripePriceId: sp.id,
          tierId: existing.tierId,
          isActive: existing.isActive,
        });
      }
    }

    res.json({
      success: true,
      syncedCount: synced.length,
      skippedCount: skipped.length,
      synced,
      skipped,
    });
  } catch (err) {
    console.error("syncStripePrices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// NEW: PUBLIC TIER DISPLAY
// ============================================================

async function getPublicTiers(req, res) {
  try {
    const tiers = await prisma.subscriptionTier.findMany({
      where: { isActive: true },
      include: {
        prices: {
          where: { isActive: true },
          orderBy: { priceCents: "asc" },
        },
      },
      orderBy: { accessTier: "asc" },
    });

    const formatted = tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      description: tier.description,
      gymTierAccess: tier.gymTierAccess,
      monthlyVisitLimit: tier.monthlyVisitLimit,
      isUnlimited: tier.isUnlimited,
      perks: tier.perks,
      isFeatured: tier.isFeatured,
      prices: tier.prices.map((p) => ({
        interval: p.interval,
        priceCents: p.priceCents,
        pricePKR: p.priceCents / 100,
        currency: p.currency,
      })),
    }));

    res.json({ success: true, tiers: formatted });
  } catch (err) {
    console.error("getPublicTiers error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getTiersByGymAccess(req, res) {
  try {
    const { gymTier } = req.params;

    const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
    if (!validGymTiers.includes(gymTier)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `gymTier must be one of: ${validGymTiers.join(", ")}`,
        });
    }

    const tiers = await prisma.subscriptionTier.findMany({
      where: { isActive: true, gymTierAccess: gymTier },
      include: {
        prices: {
          where: { isActive: true },
          orderBy: { priceCents: "asc" },
        },
      },
      orderBy: { accessTier: "asc" },
    });

    res.json({ success: true, gymTier, count: tiers.length, tiers });
  } catch (err) {
    console.error("getTiersByGymAccess error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ============================================================
// EXPORTS — ALL FUNCTIONS
// ============================================================

module.exports = {
  // Existing
  createSubscriptionSession,
  stripeWebhook,
  getAllPlans,
  updateSubscriptionStatus,
  // Admin Tier CRUD
  listTiers,
  getTierById,
  createTier,
  updateTier,
  deactivateTier,
  // Admin Price CRUD
  createPrice,
  updatePrice,
  deactivatePrice,
  syncStripePrices,
  // Public
  getPublicTiers,
  getTiersByGymAccess,
};
