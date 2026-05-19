// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");
// const auth = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const payoutCtrl = require("../controller/payoutController");

// ///////////////////////////////////////////////////////////////
// // MULTER CONFIG — Memory Storage (for Cloudinary upload)
// ///////////////////////////////////////////////////////////////

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
//     if (allowed.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files (PNG, JPG, WEBP) are allowed"), false);
//     }
//   },
// });

// ///////////////////////////////////////////////////////////////
// // CLOUDINARY UPLOAD MIDDLEWARE
// ///////////////////////////////////////////////////////////////

// const uploadToCloudinary = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       req.screenshotUrl = null;
//       req.screenshotPublicId = null;
//       return next();
//     }

//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "gymkey/payouts",
//           resource_type: "image",
//           transformation: [
//             { width: 1200, crop: "limit" },
//             { quality: "auto:good" },
//           ],
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         },
//       );
//       stream.end(req.file.buffer);
//     });

//     req.screenshotUrl = result.secure_url;
//     req.screenshotPublicId = result.public_id;

//     console.log("☁️ Cloudinary upload:", result.secure_url);
//     next();
//   } catch (err) {
//     console.error("Cloudinary upload error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to upload screenshot",
//       detail: err.message,
//     });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // OWNER + ADMIN — Read Only
// ///////////////////////////////////////////////////////////////

// router.get(
//   "/gym/:gymId/summary",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getGymPayoutSummary,
// );

// router.get(
//   "/gym/:gymId/unpaid",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getUnpaidCheckIns,
// );

// router.get(
//   "/gym/:gymId/history",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getPayoutHistory,
// );

// ///////////////////////////////////////////////////////////////
// // ADMIN ONLY — Write / Manage
// ///////////////////////////////////////////////////////////////

// // Process payout with screenshot upload
// router.post(
//   "/gym/:gymId/process",
//   auth,
//   authorizeRoles(["admin"]),
//   upload.single("screenshot"),
//   uploadToCloudinary,
//   payoutCtrl.processPayout,
// );

// // List all payout rates
// router.get(
//   "/admin/rates",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getPayoutRates,
// );

// // Update payout rate
// router.put(
//   "/admin/rates",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.updatePayoutRate,
// );

// // Admin overview of all gyms
// router.get(
//   "/admin/overview",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getAllGymsPayoutOverview,
// );

// // Payout audit logs
// router.get(
//   "/admin/audit-logs",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getPayoutAuditLogs,
// );

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const payoutCtrl = require("../controller/payoutController");

///////////////////////////////////////////////////////////////
// MULTER CONFIG
///////////////////////////////////////////////////////////////

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (PNG, JPG, WEBP) are allowed"), false);
    }
  },
});

///////////////////////////////////////////////////////////////
// CLOUDINARY UPLOAD MIDDLEWARE
///////////////////////////////////////////////////////////////

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      req.screenshotUrl = null;
      req.screenshotPublicId = null;
      return next();
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gymkey/payouts",
          resource_type: "image",
          transformation: [
            { width: 1200, crop: "limit" },
            { quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });

    req.screenshotUrl = result.secure_url;
    req.screenshotPublicId = result.public_id;

    console.log("☁️ Cloudinary upload:", result.secure_url);
    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to upload screenshot",
      detail: err.message,
    });
  }
};

///////////////////////////////////////////////////////////////
// OWNER + ADMIN — Read Only
///////////////////////////////////////////////////////////////

router.get(
  "/gym/:gymId/summary",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getGymPayoutSummary,
);

router.get(
  "/gym/:gymId/unpaid",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getUnpaidCheckIns,
);

router.get(
  "/gym/:gymId/history",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getPayoutHistory,
);

///////////////////////////////////////////////////////////////
// OWNER — Payout Account Management (NEW)
///////////////////////////////////////////////////////////////

router.get(
  "/gym/:gymId/account",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getPayoutAccount,
);

router.put(
  "/gym/:gymId/account",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.updatePayoutAccount,
);

router.patch(
  "/gym/:gymId/account/verify",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.verifyPayoutAccount,
);

///////////////////////////////////////////////////////////////
// ADMIN ONLY — Write / Manage
///////////////////////////////////////////////////////////////

router.post(
  "/gym/:gymId/process",
  auth,
  authorizeRoles(["admin"]),
  upload.single("screenshot"),
  uploadToCloudinary,
  payoutCtrl.processPayout,
);

router.get(
  "/admin/rates",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getPayoutRates,
);

router.put(
  "/admin/rates",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.updatePayoutRate,
);

router.get(
  "/admin/overview",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getAllGymsPayoutOverview,
);

router.get(
  "/admin/audit-logs",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getPayoutAuditLogs,
);

module.exports = router;
