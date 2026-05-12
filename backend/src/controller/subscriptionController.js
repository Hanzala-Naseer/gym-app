const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------- Create Stripe Checkout Session ----------------
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
    const { priceId } = req.body; // Stripe price ID for the plan
    const userId = req.user.id;

    if (!priceId)
      return res.status(400).json({ message: "Price ID is required" });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:4000";
    console.log("Using client URL:", clientUrl);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: req.user.email,

      // ✅ THIS IS THE MISSING PART
      metadata: {
        userId: userId,
      },

      success_url: `${clientUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/subscription/cancel`,
    });

    console.log("Stripe session created:", session.id);

    res.json({ url: session.url });
  } catch (err) {
    console.error("createSubscriptionSession error:", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}

async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  // 🔑 ADD THIS LOG: Confirm the function started
  console.log("--- WEBHOOK FUNCTION STARTED ---");
  // You should see this immediately after the Stripe event fires.

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(
      `WEBHOOK SUCCESS: Signature Verified. Event Type: ${event.type}`
    );
  } catch (err) {
    // 🔑 AGGRESSIVE LOGGING: If verification fails, it will hit here.
    console.error(
      "WEBHOOK FATAL ERROR: Signature verification failed:",
      err.message
    );
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      // The handleSubscription function from the last step already has internal logging
      await handleSubscription(session);
      break;
    // ... other cases
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSubscription(session) {
  console.log("--- DEBUG: Starting handleSubscription ---");

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("❌ Missing userId in metadata");
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscriptions: true },
  });
  if (!user) {
    console.error("❌ User not found");
    return;
  }

  // Check if the user already has an active subscription
  const hasActive = user.subscriptions.some((sub) => sub.status === "active");
  if (hasActive) {
    console.log(`❌ User ${user.email} already has an active subscription`);
    return; // ❌ Stop creating another subscription
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  const priceId = stripeSubscription.items.data[0].price.id;

  const price = await prisma.subscriptionPrice.findUnique({
    where: { stripePriceId: priceId },
    include: { tier: true },
  });

  if (!price) {
    console.error("❌ No SubscriptionPrice found for:", priceId);
    return;
  }

  const startAt = stripeSubscription.current_period_start
    ? new Date(stripeSubscription.current_period_start * 1000)
    : new Date();

  const endAt = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // fallback 30 days

  await prisma.subscription.create({
    data: {
      userId: user.id,
      tierId: price.tier.id,
      stripePriceId: price.stripePriceId,
      stripeSubscriptionId: stripeSubscription.id,
      startAt,
      endAt,
      status: "active",
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
    `Subscription ${subscription.id} updated to ${subscription.status}`
  );
}

async function getAllPlans(req, res) {
  try {
    const plans = await prisma.subscriptionPrice.findMany({
      include: { tier: true },
      orderBy: [{ tier: { accessTier: "asc" } }, { priceCents: "asc" }],
    });

    const formattedPlans = await Promise.all(
      plans.map(async (p) => {
        // Fetch price from Stripe and expand the product
        const stripePrice = await stripe.prices.retrieve(p.stripePriceId, {
          expand: ["product"],
        });
        const product = stripePrice.product;

        // Parse features from comma-separated string
        let features = [];
        if (product.metadata && product.metadata.features) {
          features = product.metadata.features.split(",").map((f) => f.trim());
        }

        return {
          id: p.stripePriceId,
          name: p.tier.name,
          description:
            product.metadata && product.metadata.description
              ? product.metadata.description
              : "",
          features: features,
          price: p.priceCents,
          interval: p.interval === "month" ? "month" : "year",
          accessTier: p.tier.accessTier,
        };
      })
    );

    res.json({ plans: formattedPlans });
  } catch (err) {
    console.error("getAllPlans error:", err);
    res.status(500).json({ message: "Failed to load plans" });
  }
}

module.exports = {
  createSubscriptionSession,
  stripeWebhook,
  getAllPlans,
  updateSubscriptionStatus,
};
