
// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ///////////////////////////////////////////////////////////////
// // LIST ALL TIERS (Admin + Public) — WITH FULL MVP FIELDS
// ///////////////////////////////////////////////////////////////

// const listTiers = async (req, res) => {
//   try {
//     const tiers = await prisma.subscriptionTier.findMany({
//       include: {
//         prices: {
//           where: { isActive: true },
//           orderBy: { priceCents: "asc" },
//         },
//       },
//       orderBy: { accessTier: "asc" },
//     });

//     res.json({ success: true, tiers });
//   } catch (err) {
//     console.error("listTiers error:", err);
//     res.status(500).json({ success: false, message: "Error fetching tiers" });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // GET SINGLE TIER WITH FULL DETAILS
// ///////////////////////////////////////////////////////////////

// const getTierById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const tier = await prisma.subscriptionTier.findUnique({
//       where: { id },
//       include: {
//         prices: {
//           where: { isActive: true },
//           orderBy: { priceCents: "asc" },
//         },
//         subscriptions: {
//           where: {
//             status: { in: ["active", "past_due"] },
//           },
//           select: {
//             id: true,
//             status: true,
//             userId: true,
//             startAt: true,
//             endAt: true,
//           },
//         },
//       },
//     });

//     if (!tier) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tier not found" });
//     }

//     // Count active subscribers
//     const activeSubscribers = tier.subscriptions.filter(
//       (s) => s.status === "active",
//     ).length;

//     res.json({
//       success: true,
//       tier: {
//         ...tier,
//         activeSubscribers,
//         subscriptionCount: tier.subscriptions.length,
//       },
//     });
//   } catch (err) {
//     console.error("getTierById error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // CREATE TIER (Admin only) — WITH ALL MVP FIELDS
// ///////////////////////////////////////////////////////////////

// const createTier = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const {
//       name,
//       slug,
//       description,
//       accessTier,
//       gymTierAccess, // "BASIC" | "ULTIMATE" | "ELITE"
//       monthlyVisitLimit, // 16 | 30 | null
//       isUnlimited, // boolean
//       perks, // JSON object
//       isActive,
//       isFeatured,
//     } = req.body;

//     // Validation
//     if (!name || !slug || accessTier === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "name, slug, and accessTier are required",
//       });
//     }

//     // Validate gymTierAccess enum
//     const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
//     if (gymTierAccess && !validGymTiers.includes(gymTierAccess)) {
//       return res.status(400).json({
//         success: false,
//         message: `gymTierAccess must be one of: ${validGymTiers.join(", ")}`,
//       });
//     }

//     // Validate monthlyVisitLimit
//     if (monthlyVisitLimit !== undefined && monthlyVisitLimit !== null) {
//       const validLimits = [16, 30];
//       if (!validLimits.includes(parseInt(monthlyVisitLimit))) {
//         return res.status(400).json({
//           success: false,
//           message: "monthlyVisitLimit must be 16, 30, or null (for unlimited)",
//         });
//       }
//     }

//     // Build data object with all fields
//     const data = {
//       name,
//       slug,
//       description: description || null,
//       accessTier: parseInt(accessTier),
//       gymTierAccess: gymTierAccess || "BASIC",
//       monthlyVisitLimit:
//         monthlyVisitLimit !== undefined
//           ? monthlyVisitLimit === null
//             ? null
//             : parseInt(monthlyVisitLimit)
//           : null,
//       isUnlimited: isUnlimited !== undefined ? isUnlimited : false,
//       perks: perks || null,
//       isActive: isActive !== undefined ? isActive : true,
//       isFeatured: isFeatured !== undefined ? isFeatured : false,
//     };

//     const tier = await prisma.subscriptionTier.create({ data });

//     res.status(201).json({ success: true, tier });
//   } catch (err) {
//     console.error("createTier error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // UPDATE TIER (Admin only) — WITH ALL MVP FIELDS
// ///////////////////////////////////////////////////////////////

// const updateTier = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { id } = req.params;
//     const {
//       name,
//       description,
//       accessTier,
//       gymTierAccess,
//       monthlyVisitLimit,
//       isUnlimited,
//       perks,
//       isActive,
//       isFeatured,
//     } = req.body;

//     const existing = await prisma.subscriptionTier.findUnique({
//       where: { id },
//       include: { prices: true },
//     });

//     if (!existing) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tier not found" });
//     }

//     // Validate gymTierAccess if provided
//     const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
//     if (gymTierAccess && !validGymTiers.includes(gymTierAccess)) {
//       return res.status(400).json({
//         success: false,
//         message: `gymTierAccess must be one of: ${validGymTiers.join(", ")}`,
//       });
//     }

//     // Validate monthlyVisitLimit if provided
//     if (monthlyVisitLimit !== undefined && monthlyVisitLimit !== null) {
//       const validLimits = [16, 30];
//       if (!validLimits.includes(parseInt(monthlyVisitLimit))) {
//         return res.status(400).json({
//           success: false,
//           message: "monthlyVisitLimit must be 16, 30, or null",
//         });
//       }
//     }

//     // Build update data — only include fields that are provided
//     const updateData = {};
//     if (name !== undefined) updateData.name = name;
//     if (description !== undefined) updateData.description = description;
//     if (accessTier !== undefined) updateData.accessTier = parseInt(accessTier);
//     if (gymTierAccess !== undefined) updateData.gymTierAccess = gymTierAccess;
//     if (monthlyVisitLimit !== undefined) {
//       updateData.monthlyVisitLimit =
//         monthlyVisitLimit === null ? null : parseInt(monthlyVisitLimit);
//     }
//     if (isUnlimited !== undefined) updateData.isUnlimited = isUnlimited;
//     if (perks !== undefined) updateData.perks = perks;
//     if (isActive !== undefined) updateData.isActive = isActive;
//     if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

//     const tier = await prisma.subscriptionTier.update({
//       where: { id },
//       data: updateData,
//       include: {
//         prices: { where: { isActive: true } },
//       },
//     });

//     // Log the update
//     await prisma.adminAuditLog.create({
//       data: {
//         adminId: req.user.id,
//         action: "UPDATED_PLAN",
//         entityType: "SubscriptionTier",
//         entityId: id,
//         metadata: {
//           tierName: tier.name,
//           updatedFields: Object.keys(updateData),
//           previousAccessTier: existing.accessTier,
//           newAccessTier: tier.accessTier,
//         },
//       },
//     });

//     res.json({ success: true, tier });
//   } catch (err) {
//     console.error("updateTier error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // DELETE/DEACTIVATE TIER (Admin only — soft delete via isActive)
// ///////////////////////////////////////////////////////////////

// const deactivateTier = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { id } = req.params;

//     const tier = await prisma.subscriptionTier.update({
//       where: { id },
//       data: { isActive: false },
//     });

//     res.json({ success: true, message: "Tier deactivated", tier });
//   } catch (err) {
//     console.error("deactivateTier error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // CREATE PRICE (Admin only — creates in Stripe + DB)
// ///////////////////////////////////////////////////////////////

// const createPrice = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { tierId, interval, priceCents, currency } = req.body;

//     if (!tierId || !interval || !priceCents) {
//       return res.status(400).json({
//         success: false,
//         message: "tierId, interval, and priceCents required",
//       });
//     }

//     // Validate interval
//     if (!["monthly", "yearly"].includes(interval)) {
//       return res.status(400).json({
//         success: false,
//         message: "interval must be 'monthly' or 'yearly'",
//       });
//     }

//     // Get tier for name and details
//     const tier = await prisma.subscriptionTier.findUnique({
//       where: { id: tierId },
//     });
//     if (!tier) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tier not found" });
//     }

//     // 1. Create Stripe Product
//     const product = await stripe.products.create({
//       name: `${tier.name} — ${interval}`,
//       description: tier.description || "",
//       metadata: {
//         tierId,
//         accessTier: String(tier.accessTier),
//         gymTierAccess: tier.gymTierAccess,
//         monthlyVisitLimit: String(tier.monthlyVisitLimit || "unlimited"),
//         isUnlimited: String(tier.isUnlimited),
//       },
//     });

//     // 2. Create Stripe Price
//     const stripePrice = await stripe.prices.create({
//       product: product.id,
//       unit_amount: parseInt(priceCents),
//       currency: (currency || "pkr").toLowerCase(),
//       recurring: { interval: interval === "monthly" ? "month" : "year" },
//     });

//     // 3. Save to DB
//     const price = await prisma.subscriptionPrice.create({
//       data: {
//         tierId,
//         stripeProductId: product.id,
//         stripePriceId: stripePrice.id,
//         interval,
//         priceCents: parseInt(priceCents),
//         currency: currency || "pkr",
//         isActive: true,
//       },
//       include: {
//         tier: {
//           select: {
//             name: true,
//             slug: true,
//             gymTierAccess: true,
//             monthlyVisitLimit: true,
//             isUnlimited: true,
//           },
//         },
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Price created successfully",
//       price,
//     });
//   } catch (err) {
//     console.error("createPrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // UPDATE PRICE (Admin only — deactivates old, creates new in Stripe)
// ///////////////////////////////////////////////////////////////

// const updatePrice = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { id } = req.params;
//     const { priceCents, isActive, currency } = req.body;

//     const existing = await prisma.subscriptionPrice.findUnique({
//       where: { id },
//       include: { tier: true },
//     });

//     if (!existing) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Price not found" });
//     }

//     let newStripePriceId = existing.stripePriceId;
//     let newStripeProductId = existing.stripeProductId;

//     // If price changed, create NEW Stripe price (Stripe prices are immutable)
//     if (priceCents && parseInt(priceCents) !== existing.priceCents) {
//       const newStripePrice = await stripe.prices.create({
//         product: existing.stripeProductId,
//         unit_amount: parseInt(priceCents),
//         currency: (currency || existing.currency).toLowerCase(),
//         recurring: {
//           interval: existing.interval === "monthly" ? "month" : "year",
//         },
//       });
//       newStripePriceId = newStripePrice.id;
//     }

//     // Update DB
//     const updated = await prisma.subscriptionPrice.update({
//       where: { id },
//       data: {
//         priceCents: priceCents ? parseInt(priceCents) : existing.priceCents,
//         isActive: isActive !== undefined ? isActive : existing.isActive,
//         stripePriceId: newStripePriceId,
//         currency: currency || existing.currency,
//       },
//       include: {
//         tier: {
//           select: {
//             name: true,
//             slug: true,
//             gymTierAccess: true,
//           },
//         },
//       },
//     });

//     res.json({ success: true, price: updated });
//   } catch (err) {
//     console.error("updatePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // DEACTIVATE PRICE (Admin only)
// ///////////////////////////////////////////////////////////////

// const deactivatePrice = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { id } = req.params;

//     const price = await prisma.subscriptionPrice.update({
//       where: { id },
//       data: { isActive: false },
//       include: {
//         tier: {
//           select: { name: true, slug: true },
//         },
//       },
//     });

//     res.json({ success: true, message: "Price deactivated", price });
//   } catch (err) {
//     console.error("deactivatePrice error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // SYNC STRIPE PRICES (Admin utility)
// ///////////////////////////////////////////////////////////////

// const syncStripePrices = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const prices = await stripe.prices.list({
//       limit: 100,
//       expand: ["data.product"],
//     });

//     const synced = [];
//     const skipped = [];

//     for (const sp of prices.data) {
//       if (!sp.product || sp.type !== "recurring") continue;

//       const existing = await prisma.subscriptionPrice.findUnique({
//         where: { stripePriceId: sp.id },
//       });

//       if (!existing) {
//         skipped.push({
//           stripePriceId: sp.id,
//           reason: "Not found in database",
//         });
//       } else {
//         synced.push({
//           id: existing.id,
//           stripePriceId: sp.id,
//           tierId: existing.tierId,
//           isActive: existing.isActive,
//         });
//       }
//     }

//     res.json({
//       success: true,
//       syncedCount: synced.length,
//       skippedCount: skipped.length,
//       synced,
//       skipped,
//     });
//   } catch (err) {
//     console.error("syncStripePrices error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // GET PUBLIC TIERS (For marketing/landing page — only active & featured)
// ///////////////////////////////////////////////////////////////

// const getPublicTiers = async (req, res) => {
//   try {
//     const tiers = await prisma.subscriptionTier.findMany({
//       where: {
//         isActive: true,
//       },
//       include: {
//         prices: {
//           where: { isActive: true },
//           orderBy: { priceCents: "asc" },
//         },
//       },
//       orderBy: { accessTier: "asc" },
//     });

//     // Format for public display
//     const formatted = tiers.map((tier) => ({
//       id: tier.id,
//       name: tier.name,
//       slug: tier.slug,
//       description: tier.description,
//       gymTierAccess: tier.gymTierAccess,
//       monthlyVisitLimit: tier.monthlyVisitLimit,
//       isUnlimited: tier.isUnlimited,
//       perks: tier.perks,
//       isFeatured: tier.isFeatured,
//       prices: tier.prices.map((p) => ({
//         interval: p.interval,
//         priceCents: p.priceCents,
//         pricePKR: p.priceCents / 100,
//         currency: p.currency,
//       })),
//     }));

//     res.json({ success: true, tiers: formatted });
//   } catch (err) {
//     console.error("getPublicTiers error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // GET TIERS BY GYM TIER ACCESS (For gym filtering)
// ///////////////////////////////////////////////////////////////

// const getTiersByGymAccess = async (req, res) => {
//   try {
//     const { gymTier } = req.params; // BASIC, ULTIMATE, ELITE

//     const validGymTiers = ["BASIC", "ULTIMATE", "ELITE"];
//     if (!validGymTiers.includes(gymTier)) {
//       return res.status(400).json({
//         success: false,
//         message: `gymTier must be one of: ${validGymTiers.join(", ")}`,
//       });
//     }

//     const tiers = await prisma.subscriptionTier.findMany({
//       where: {
//         isActive: true,
//         gymTierAccess: gymTier,
//       },
//       include: {
//         prices: {
//           where: { isActive: true },
//           orderBy: { priceCents: "asc" },
//         },
//       },
//       orderBy: { accessTier: "asc" },
//     });

//     res.json({ success: true, gymTier, count: tiers.length, tiers });
//   } catch (err) {
//     console.error("getTiersByGymAccess error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   listTiers,
//   getTierById,
//   createTier,
//   updateTier,
//   deactivateTier,
//   createPrice,
//   updatePrice,
//   deactivatePrice,
//   syncStripePrices,
//   getPublicTiers,
//   getTiersByGymAccess,
// };
// // 