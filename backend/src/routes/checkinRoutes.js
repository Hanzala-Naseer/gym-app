// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const validateQrToken = require("../middleware/validateQrToken");
// const loadGym = require("../middleware/loadGym");
// const subscriptionCheck = require("../middleware/subscriptionCheck");
// const tierCheck = require("../middleware/tierCheck");
// const checkin = require("../controller/checkinController");

// router.post(
//   "/",
//   auth,
//   validateQrToken,
//   loadGym,
//   subscriptionCheck,
//   tierCheck,
//   checkin
// );

// module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validateQrToken = require("../middleware/validateQrToken");
const loadGym = require("../middleware/loadGym");
const subscriptionCheck = require("../middleware/subscriptionCheck");
const tierCheck = require("../middleware/tierCheck");

const { checkIn } = require("../controller/checkinController"); // ✅ destructure

console.log({
  auth: typeof auth,
  validateQrToken: typeof validateQrToken,
  loadGym: typeof loadGym,
  subscriptionCheck: typeof subscriptionCheck,
  tierCheck: typeof tierCheck,
  checkIn: typeof checkIn,
});

router.post(
  "/",
  auth,
  validateQrToken,
  loadGym,
  // subscriptionCheck,
  // tierCheck,
  checkIn // ✅ function
);

module.exports = router;
