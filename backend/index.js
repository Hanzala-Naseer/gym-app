require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// -------------------- STRIPE WEBHOOK (MUST BE FIRST) --------------------
app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  require("./src/controller/subscriptionController").stripeWebhook
);

// -------------------- MIDDLEWARES --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(
  cors({
    origin: "*", // OK for testing
  })
);

// -------------------- ROUTES --------------------
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/gyms", require("./src/routes/gymRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/owners", require("./src/routes/ownerRoutes"));
app.use("/api/members", require("./src/routes/memberRoutes"));
app.use("/api/subscription", require("./src/routes/subscriptionRoutes"));
app.use("/api/qr", require("./src/routes/qrRoutes"));
app.use("/api/checkin", require("./src/routes/checkinRoutes"));

// -------------------- DEFAULT --------------------
app.get("/", (req, res) => res.send("Gym + Auth + Admin API running"));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
