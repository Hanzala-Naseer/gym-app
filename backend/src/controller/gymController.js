// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();
// /**
//  * Helper: build full URL dynamically
//  */
// const getBaseUrl = (req) => {
//   return `${req.protocol}://${req.get("host")}`;
// };

// //
// // ─────────────────────────────────────────────
// // REGISTER GYM
// // ─────────────────────────────────────────────
// //
// const registerGym = async (req, res) => {
//   try {
//     if (req.user.role !== "owner") {
//       return res.status(403).json({
//         success: false,
//         message: "Only gym owners can register gyms",
//       });
//     }

//     const {
//       name,
//       addressLine,
//       city,
//       latitude,
//       longitude,
//       tier,
//       openingTime,
//       closingTime,
//       is24Hours,
//     } = req.body;

//     if (
//       !name ||
//       !addressLine ||
//       !city ||
//       latitude === undefined ||
//       longitude === undefined ||
//       !tier
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     let coverImageUrl = null;
//     if (req.files?.coverImage?.[0]) {
//       coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
//     }

//     const gym = await prisma.gym.create({
//       data: {
//         name,
//         addressLine,
//         city,
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         tier: parseInt(tier),
//         openingTime: openingTime || null,
//         closingTime: closingTime || null,
//         is24Hours: is24Hours === "true",
//         coverImageUrl,
//         ownerId: req.user.id,
//         status: "pending",
//       },
//     });

//     if (req.files?.photos?.length) {
//       const photosData = req.files.photos.map((file) => ({
//         gymId: gym.id,
//         url: `/uploads/${file.filename}`,
//       }));

//       await prisma.gymPhoto.createMany({ data: photosData });
//     }

//     res.json({
//       success: true,
//       message: "Gym registered successfully. Pending admin approval.",
//       gym,
//     });
//   } catch (err) {
//     console.error("registerGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error registering gym",
//     });
//   }
// };

// //
// // ─────────────────────────────────────────────
// // LIST GYMS (FIXED – NO BASE_URL)
// // ─────────────────────────────────────────────
// //
// const listGyms = async (req, res) => {
//   try {
//     const baseUrl = getBaseUrl(req);

//     const filter = {};
//     if (req.user.role !== "admin") {
//       filter.status = "approved";
//     }

//     const gyms = await prisma.gym.findMany({
//       where: filter,
//       include: {
//         photos: true,
//         owner: { select: { id: true, name: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const normalizedGyms = gyms.map((gym) => ({
//       ...gym,
//       coverImageUrl: gym.coverImageUrl
//         ? `${baseUrl}${gym.coverImageUrl}`
//         : null,
//       photos: gym.photos.map((p) => ({
//         ...p,
//         url: `${baseUrl}${p.url}`,
//       })),
//     }));

//     res.json({ success: true, gyms: normalizedGyms });
//   } catch (err) {
//     console.error("listGyms error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching gyms",
//     });
//   }
// };

// //
// // ─────────────────────────────────────────────
// // GET SINGLE GYM (FIXED – NO BASE_URL)
// // ─────────────────────────────────────────────
// //
// const getGym = async (req, res) => {
//   try {
//     const baseUrl = getBaseUrl(req);
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({
//       where: { id },
//       include: {
//         photos: true,
//         owner: { select: { id: true, name: true } },
//       },
//     });

//     if (!gym) {
//       return res.status(404).json({
//         success: false,
//         message: "Gym not found",
//       });
//     }

//     if (
//       req.user.role !== "admin" &&
//       req.user.role !== "owner" &&
//       gym.status !== "approved"
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Gym not approved yet",
//       });
//     }

//     const normalizedGym = {
//       ...gym,
//       coverImageUrl: gym.coverImageUrl
//         ? `${baseUrl}${gym.coverImageUrl}`
//         : null,
//       photos: gym.photos.map((p) => ({
//         ...p,
//         url: `${baseUrl}${p.url}`,
//       })),
//     };

//     res.json({ success: true, gym: normalizedGym });
//   } catch (err) {
//     console.error("getGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching gym",
//     });
//   }
// };

// //
// // ─────────────────────────────────────────────
// // ADD GYM PHOTOS (FIXED – NO BASE_URL)
// // ─────────────────────────────────────────────
// //
// const addGymPhotos = async (req, res) => {
//   try {
//     const baseUrl = getBaseUrl(req);
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({ where: { id } });
//     if (!gym) {
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     }

//     if (req.user.id !== gym.ownerId) {
//       return res.status(403).json({
//         success: false,
//         message: "Only the gym owner can add photos",
//       });
//     }

//     if (!req.files?.length) {
//       return res.status(400).json({
//         success: false,
//         message: "No files uploaded",
//       });
//     }

//     const uploadedPhotos = [];

//     for (const file of req.files) {
//       const photo = await prisma.gymPhoto.create({
//         data: {
//           gymId: gym.id,
//           url: `/uploads/${file.filename}`,
//         },
//       });

//       uploadedPhotos.push({
//         ...photo,
//         url: `${baseUrl}${photo.url}`,
//       });
//     }

//     res.json({
//       success: true,
//       photos: uploadedPhotos,
//     });
//   } catch (err) {
//     console.error("addGymPhotos error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error uploading photos",
//     });
//   }
// };

// const resubmitGym = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({
//       where: { id },
//     });

//     if (!gym) {
//       return res.status(404).json({
//         success: false,
//         message: "Gym not found",
//       });
//     }

//     // Only owner can resubmit
//     if (gym.ownerId !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Allow only rejected/changes_requested gyms
//     if (gym.status !== "rejected" && gym.status !== "changes_requested") {
//       return res.status(400).json({
//         success: false,
//         message: "Gym cannot be resubmitted",
//       });
//     }

//     const updatedGym = await prisma.gym.update({
//       where: { id },

//       data: {
//         name: req.body.name || gym.name,
//         addressLine: req.body.addressLine || gym.addressLine,
//         city: req.body.city || gym.city,
//         province: req.body.province || gym.province,

//         openingTime: req.body.openingTime || gym.openingTime,
//         closingTime: req.body.closingTime || gym.closingTime,

//         status: "pending",

//         rejectionReason: null,
//         reviewedAt: null,

//         resubmissionCount: {
//           increment: 1,
//         },
//       },
//     });

//     // review history
//     await prisma.gymReviewHistory.create({
//       data: {
//         gymId: gym.id,
//         adminId: req.user.id,
//         action: "RESUBMITTED",
//         notes: "Owner resubmitted gym application",
//       },
//     });

//     res.json({
//       success: true,
//       message: "Gym resubmitted successfully",
//       gym: updatedGym,
//     });
//   } catch (err) {
//     console.error("resubmitGym error:", err);

//     res.status(500).json({
//       success: false,
//       message: "Error resubmitting gym",
//     });
//   }
// };

// module.exports = {
//   registerGym,
//   listGyms,
//   getGym,
//   addGymPhotos,
//   resubmitGym,
// };

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify connection in development
if (process.env.NODE_ENV !== "production") {
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP Error:", err);
    } else {
      console.log("SMTP Connected");
    }
  });
}
/**
 * Helper: build full URL dynamically
 */
const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

//
// ─────────────────────────────────────────────
// REGISTER GYM
// ─────────────────────────────────────────────
//
// const registerGym = async (req, res) => {
//   try {
//     if (req.user.role !== "owner") {
//       return res.status(403).json({
//         success: false,
//         message: "Only gym owners can register gyms",
//       });
//     }

//     const {
//       name,
//       addressLine,
//       city,
//       latitude,
//       longitude,
//       tier,
//       openingTime,
//       closingTime,
//       is24Hours,
//     } = req.body;

//     if (
//       !name ||
//       !addressLine ||
//       !city ||
//       latitude === undefined ||
//       longitude === undefined ||
//       !tier
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     let coverImageUrl = null;
//     if (req.files?.coverImage?.[0]) {
//       coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
//     }

//     const gym = await prisma.gym.create({
//       data: {
//         name,
//         addressLine,
//         city,
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         tier: parseInt(tier),
//         openingTime: openingTime || null,
//         closingTime: closingTime || null,
//         is24Hours: is24Hours === "true",
//         coverImageUrl,
//         ownerId: req.user.id,
//         status: "pending",
//       },
//     });

//     if (req.files?.photos?.length) {
//       const photosData = req.files.photos.map((file) => ({
//         gymId: gym.id,
//         url: `/uploads/${file.filename}`,
//       }));

//       await prisma.gymPhoto.createMany({ data: photosData });
//     }

//     res.json({
//       success: true,
//       message: "Gym registered successfully. Pending admin approval.",
//       gym,
//     });
//   } catch (err) {
//     console.error("registerGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error registering gym",
//     });
//   }
// };

//
// ─────────────────────────────────────────────
// LIST GYMS (FIXED – NO BASE_URL)
// ─────────────────────────────────────────────
//
const listGyms = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);

    const filter = {};
    if (req.user.role !== "admin") {
      filter.status = "approved";
    }

    const gyms = await prisma.gym.findMany({
      where: filter,
      include: {
        photos: true,
        owner: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const normalizedGyms = gyms.map((gym) => ({
      ...gym,
      coverImageUrl: gym.coverImageUrl
        ? `${baseUrl}${gym.coverImageUrl}`
        : null,
      photos: gym.photos.map((p) => ({
        ...p,
        url: `${baseUrl}${p.url}`,
      })),
    }));

    res.json({ success: true, gyms: normalizedGyms });
  } catch (err) {
    console.error("listGyms error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching gyms",
    });
  }
};

//
// ─────────────────────────────────────────────
// GET SINGLE GYM (FIXED – NO BASE_URL)
// ─────────────────────────────────────────────
//
const getGym = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const { id } = req.params;

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: {
        photos: true,
        owner: { select: { id: true, name: true } },
      },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "owner" &&
      gym.status !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Gym not approved yet",
      });
    }

    const normalizedGym = {
      ...gym,
      coverImageUrl: gym.coverImageUrl
        ? `${baseUrl}${gym.coverImageUrl}`
        : null,
      photos: gym.photos.map((p) => ({
        ...p,
        url: `${baseUrl}${p.url}`,
      })),
    };

    res.json({ success: true, gym: normalizedGym });
  } catch (err) {
    console.error("getGym error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching gym",
    });
  }
};

//
// ─────────────────────────────────────────────
// ADD GYM PHOTOS (FIXED – NO BASE_URL)
// ─────────────────────────────────────────────
//
const addGymPhotos = async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const { id } = req.params;

    const gym = await prisma.gym.findUnique({ where: { id } });
    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    if (req.user.id !== gym.ownerId) {
      return res.status(403).json({
        success: false,
        message: "Only the gym owner can add photos",
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const photo = await prisma.gymPhoto.create({
        data: {
          gymId: gym.id,
          url: `/uploads/${file.filename}`,
        },
      });

      uploadedPhotos.push({
        ...photo,
        url: `${baseUrl}${photo.url}`,
      });
    }

    res.json({
      success: true,
      photos: uploadedPhotos,
    });
  } catch (err) {
    console.error("addGymPhotos error:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading photos",
    });
  }
};

// const resubmitGym = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({
//       where: { id },
//     });

//     if (!gym) {
//       return res.status(404).json({
//         success: false,
//         message: "Gym not found",
//       });
//     }

//     // Only owner can resubmit
//     if (gym.ownerId !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Allow only rejected/changes_requested gyms
//     if (gym.status !== "rejected" && gym.status !== "changes_requested") {
//       return res.status(400).json({
//         success: false,
//         message: "Gym cannot be resubmitted",
//       });
//     }

//     const updatedGym = await prisma.gym.update({
//       where: { id },

//       data: {
//         name: req.body.name || gym.name,
//         addressLine: req.body.addressLine || gym.addressLine,
//         city: req.body.city || gym.city,
//         province: req.body.province || gym.province,

//         openingTime: req.body.openingTime || gym.openingTime,
//         closingTime: req.body.closingTime || gym.closingTime,

//         status: "pending",

//         rejectionReason: null,
//         reviewedAt: null,

//         resubmissionCount: {
//           increment: 1,
//         },
//       },
//     });

//     // review history
//     await prisma.gymReviewHistory.create({
//       data: {
//         gymId: gym.id,
//         adminId: req.user.id,
//         action: "RESUBMITTED",
//         notes: "Owner resubmitted gym application",
//       },
//     });

//     res.json({
//       success: true,
//       message: "Gym resubmitted successfully",
//       gym: updatedGym,
//     });
//   } catch (err) {
//     console.error("resubmitGym error:", err);

//     res.status(500).json({
//       success: false,
//       message: "Error resubmitting gym",
//     });
//   }
// };

// const updateGym = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({
//       where: { id },
//       include: {
//         photos: true,
//       },
//     });

//     if (!gym) {
//       return res.status(404).json({
//         success: false,
//         message: "Gym not found",
//       });
//     }

//     if (gym.ownerId !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const {
//       name,
//       addressLine,
//       city,
//       province,
//       postalCode,
//       latitude,
//       longitude,
//       openingTime,
//       closingTime,
//       is24Hours,
//       description,
//       tier,
//     } = req.body;

//     let coverImageUrl = gym.coverImageUrl;

//     if (req.files?.coverImage?.[0]) {
//       coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
//     }

//     const updatedGym = await prisma.gym.update({
//       where: { id },

//       data: {
//         name: name || gym.name,
//         addressLine: addressLine || gym.addressLine,
//         city: city || gym.city,
//         province: province || gym.province,
//         postalCode: postalCode || gym.postalCode,

//         latitude: latitude ? parseFloat(latitude) : gym.latitude,

//         longitude: longitude ? parseFloat(longitude) : gym.longitude,

//         openingTime: openingTime !== undefined ? openingTime : gym.openingTime,

//         closingTime: closingTime !== undefined ? closingTime : gym.closingTime,

//         is24Hours:
//           is24Hours !== undefined ? is24Hours === "true" : gym.is24Hours,

//         description: description !== undefined ? description : gym.description,

//         tier: tier ? parseInt(tier) : gym.tier,

//         coverImageUrl,
//       },
//     });

//     // add new photos
//     if (req.files?.photos?.length) {
//       const photosData = req.files.photos.map((file) => ({
//         gymId: gym.id,
//         url: `/uploads/${file.filename}`,
//       }));

//       await prisma.gymPhoto.createMany({
//         data: photosData,
//       });
//     }

//     res.json({
//       success: true,
//       message: "Gym updated successfully",
//       gym: updatedGym,
//     });
//   } catch (err) {
//     console.error("updateGym error:", err);

//     res.status(500).json({
//       success: false,
//       message: "Error updating gym",
//     });
//   }
// };

///////////////////////////////////////////////////////////////
// REGISTER GYM
///////////////////////////////////////////////////////////////

const registerGym = async (req, res) => {
  try {
    ///////////////////////////////////////////////////////////
    // AUTHORIZATION
    ///////////////////////////////////////////////////////////

    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only gym owners can register gyms",
      });
    }

    ///////////////////////////////////////////////////////////
    // FETCH OWNER
    ///////////////////////////////////////////////////////////

    const owner = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    if (owner.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    ///////////////////////////////////////////////////////////
    // REQUEST DATA
    ///////////////////////////////////////////////////////////

    const {
      name,
      description,

      addressLine,
      city,
      province,
      postalCode,

      latitude,
      longitude,

      phoneNumber,
      whatsappNumber,

      instagramHandle,
      websiteUrl,
      googleMapsLink,

      cnicNumber,
      businessName,

      openingTime,
      closingTime,

      is24Hours,

      tier,
    } = req.body;

    ///////////////////////////////////////////////////////////
    // VALIDATION
    ///////////////////////////////////////////////////////////

    if (
      !name ||
      !addressLine ||
      !city ||
      latitude === undefined ||
      longitude === undefined ||
      !tier
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    ///////////////////////////////////////////////////////////
    // COVER IMAGE
    ///////////////////////////////////////////////////////////

    let coverImageUrl = null;

    if (req.files?.coverImage?.[0]) {
      coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
    }

    ///////////////////////////////////////////////////////////
    // CREATE GYM
    ///////////////////////////////////////////////////////////

    const gym = await prisma.gym.create({
      data: {
        name,
        description: description || null,

        addressLine,
        city,
        province: province || null,
        postalCode: postalCode || null,

        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),

        phoneNumber: phoneNumber || null,
        whatsappNumber: whatsappNumber || null,

        instagramHandle: instagramHandle || null,
        websiteUrl: websiteUrl || null,
        googleMapsLink: googleMapsLink || null,

        cnicNumber: cnicNumber || null,
        businessName: businessName || null,

        openingTime: openingTime || null,
        closingTime: closingTime || null,

        is24Hours: is24Hours === "true",

        tier: parseInt(tier),

        coverImageUrl,

        ownerId: owner.id,

        status: "pending",

        submittedAt: new Date(),
      },

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        photos: true,
      },
    });

    ///////////////////////////////////////////////////////////
    // SAVE GYM PHOTOS
    ///////////////////////////////////////////////////////////

    if (req.files?.photos?.length) {
      const photos = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: `/uploads/${file.filename}`,
      }));

      await prisma.gymPhoto.createMany({
        data: photos,
      });
    }

    ///////////////////////////////////////////////////////////
    // SAVE VERIFICATION DOCUMENTS
    ///////////////////////////////////////////////////////////

    const verificationDocs = [];

    if (req.files?.ownerCnic?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "owner_cnic",
        fileUrl: `/uploads/${req.files.ownerCnic[0].filename}`,
      });
    }

    if (req.files?.businessLicense?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "business_license",
        fileUrl: `/uploads/${req.files.businessLicense[0].filename}`,
      });
    }

    if (req.files?.ownershipProof?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "ownership_proof",
        fileUrl: `/uploads/${req.files.ownershipProof[0].filename}`,
      });
    }

    if (req.files?.utilityBill?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "utility_bill",
        fileUrl: `/uploads/${req.files.utilityBill[0].filename}`,
      });
    }

    if (verificationDocs.length > 0) {
      await prisma.gymVerificationDocument.createMany({
        data: verificationDocs,
      });
    }

    ///////////////////////////////////////////////////////////
    // ADMIN NOTIFICATION
    ///////////////////////////////////////////////////////////

    await prisma.adminNotification.create({
      data: {
        title: "New Gym Registration",
        message: `${gym.name} submitted for approval`,
        type: "gym",
      },
    });

    ///////////////////////////////////////////////////////////
    // ADMIN AUDIT LOG
    ///////////////////////////////////////////////////////////

    await prisma.adminAuditLog.create({
      data: {
        adminId: owner.id,

        action: "REGISTERED_GYM",

        entityType: "GYM",

        entityId: gym.id,

        metadata: {
          gymName: gym.name,
          ownerEmail: owner.email,
          city: gym.city,
          tier: gym.tier,
        },
      },
    });

    ///////////////////////////////////////////////////////////
    // EMAIL NOTIFICATION
    ///////////////////////////////////////////////////////////

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,

      to: owner.email,

      subject: "Gym Registration Submitted - GymKey",

      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;">

          <h2 style="color:#111827;">
            Gym Registration Submitted
          </h2>

          <p>Assalam o Alaikum ${owner.name},</p>

          <p>
            Your gym <strong>${gym.name}</strong>
            has been submitted successfully.
          </p>

          <p>
            Our admin team will verify your documents
            and review your gym shortly.
          </p>

          <div style="margin-top:20px;padding:15px;background:#f3f4f6;border-radius:8px;">

            <p>
              <strong>Status:</strong> Pending Approval
            </p>

            <p>
              <strong>City:</strong> ${gym.city}
            </p>

            <p>
              <strong>Tier:</strong> ${gym.tier}
            </p>

          </div>

          <p style="margin-top:30px;">
            — GymKey Team
          </p>

        </div>
      `,
    });

    ///////////////////////////////////////////////////////////
    // RESPONSE
    ///////////////////////////////////////////////////////////

    return res.status(201).json({
      success: true,
      message: "Gym registered successfully",

      gym,
    });
  } catch (err) {
    console.error("registerGym error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

///////////////////////////////////////////////////////////////
// RESUBMIT GYM
///////////////////////////////////////////////////////////////

const resubmitGym = async (req, res) => {
  try {
    const { id } = req.params;

    ///////////////////////////////////////////////////////////
    // FETCH GYM
    ///////////////////////////////////////////////////////////

    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },

      include: {
        owner: true,
      },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    ///////////////////////////////////////////////////////////
    // AUTHORIZATION
    ///////////////////////////////////////////////////////////

    if (gym.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    ///////////////////////////////////////////////////////////
    // STATUS CHECK
    ///////////////////////////////////////////////////////////

    if (gym.status !== "rejected" && gym.status !== "changes_requested") {
      return res.status(400).json({
        success: false,
        message: "Gym cannot be resubmitted",
      });
    }

    ///////////////////////////////////////////////////////////
    // UPDATE GYM
    ///////////////////////////////////////////////////////////

    const updatedGym = await prisma.gym.update({
      where: {
        id,
      },

      data: {
        name: req.body.name || gym.name,

        description: req.body.description || gym.description,

        addressLine: req.body.addressLine || gym.addressLine,

        city: req.body.city || gym.city,

        province: req.body.province || gym.province,

        postalCode: req.body.postalCode || gym.postalCode,

        phoneNumber: req.body.phoneNumber || gym.phoneNumber,

        whatsappNumber: req.body.whatsappNumber || gym.whatsappNumber,

        openingTime: req.body.openingTime || gym.openingTime,

        closingTime: req.body.closingTime || gym.closingTime,

        status: "pending",

        rejectionReason: null,
        approvalNotes: null,

        reviewedAt: null,
        reviewedByAdminId: null,

        submittedAt: new Date(),

        resubmissionCount: {
          increment: 1,
        },
      },
    });

    ///////////////////////////////////////////////////////////
    // ADMIN NOTIFICATION
    ///////////////////////////////////////////////////////////

    await prisma.adminNotification.create({
      data: {
        title: "Gym Resubmitted",
        message: `${gym.name} resubmitted for approval`,
        type: "gym",
      },
    });

    ///////////////////////////////////////////////////////////
    // AUDIT LOG
    ///////////////////////////////////////////////////////////

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,

        action: "RESUBMITTED_GYM",

        entityType: "GYM",

        entityId: gym.id,

        metadata: {
          gymName: gym.name,
          resubmissionCount: gym.resubmissionCount + 1,
        },
      },
    });

    ///////////////////////////////////////////////////////////
    // EMAIL
    ///////////////////////////////////////////////////////////

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,

      to: gym.owner.email,

      subject: "Gym Resubmitted - GymKey",

      html: `
        <div style="font-family:Arial;padding:20px;">

          <h2>
            Gym Resubmitted Successfully
          </h2>

          <p>
            Hello ${gym.owner.name},
          </p>

          <p>
            Your gym <strong>${gym.name}</strong>
            has been resubmitted successfully.
          </p>

          <p>
            Our admin team will review the updates shortly.
          </p>

          <p>
            — GymKey Team
          </p>

        </div>
      `,
    });

    ///////////////////////////////////////////////////////////
    // RESPONSE
    ///////////////////////////////////////////////////////////

    return res.json({
      success: true,
      message: "Gym resubmitted successfully",

      gym: updatedGym,
    });
  } catch (err) {
    console.error("resubmitGym error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

///////////////////////////////////////////////////////////////
// UPDATE GYM
///////////////////////////////////////////////////////////////

const updateGym = async (req, res) => {
  try {
    const { id } = req.params;

    ///////////////////////////////////////////////////////////
    // FETCH GYM
    ///////////////////////////////////////////////////////////

    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },

      include: {
        owner: true,
        photos: true,
      },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    ///////////////////////////////////////////////////////////
    // AUTHORIZATION
    ///////////////////////////////////////////////////////////

    if (gym.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    ///////////////////////////////////////////////////////////
    // REQUEST DATA
    ///////////////////////////////////////////////////////////

    const {
      name,
      description,

      addressLine,
      city,
      province,
      postalCode,

      latitude,
      longitude,

      phoneNumber,
      whatsappNumber,

      instagramHandle,
      websiteUrl,
      googleMapsLink,

      openingTime,
      closingTime,

      is24Hours,

      tier,
    } = req.body;

    ///////////////////////////////////////////////////////////
    // COVER IMAGE
    ///////////////////////////////////////////////////////////

    let coverImageUrl = gym.coverImageUrl;

    if (req.files?.coverImage?.[0]) {
      coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
    }

    ///////////////////////////////////////////////////////////
    // UPDATE GYM
    ///////////////////////////////////////////////////////////

    const updatedGym = await prisma.gym.update({
      where: {
        id,
      },

      data: {
        name: name || gym.name,

        description: description !== undefined ? description : gym.description,

        addressLine: addressLine || gym.addressLine,

        city: city || gym.city,

        province: province !== undefined ? province : gym.province,

        postalCode: postalCode !== undefined ? postalCode : gym.postalCode,

        latitude: latitude !== undefined ? parseFloat(latitude) : gym.latitude,

        longitude:
          longitude !== undefined ? parseFloat(longitude) : gym.longitude,

        phoneNumber: phoneNumber !== undefined ? phoneNumber : gym.phoneNumber,

        whatsappNumber:
          whatsappNumber !== undefined ? whatsappNumber : gym.whatsappNumber,

        instagramHandle:
          instagramHandle !== undefined ? instagramHandle : gym.instagramHandle,

        websiteUrl: websiteUrl !== undefined ? websiteUrl : gym.websiteUrl,

        googleMapsLink:
          googleMapsLink !== undefined ? googleMapsLink : gym.googleMapsLink,

        openingTime: openingTime !== undefined ? openingTime : gym.openingTime,

        closingTime: closingTime !== undefined ? closingTime : gym.closingTime,

        is24Hours:
          is24Hours !== undefined ? is24Hours === "true" : gym.is24Hours,

        tier: tier !== undefined ? parseInt(tier) : gym.tier,

        coverImageUrl,
      },
    });

    ///////////////////////////////////////////////////////////
    // SAVE NEW PHOTOS
    ///////////////////////////////////////////////////////////

    if (req.files?.photos?.length) {
      const photos = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: `/uploads/${file.filename}`,
      }));

      await prisma.gymPhoto.createMany({
        data: photos,
      });
    }

    ///////////////////////////////////////////////////////////
    // AUDIT LOG
    ///////////////////////////////////////////////////////////

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,

        action: "UPDATED_GYM",

        entityType: "GYM",

        entityId: gym.id,

        metadata: {
          gymName: gym.name,
        },
      },
    });

    ///////////////////////////////////////////////////////////
    // EMAIL
    ///////////////////////////////////////////////////////////

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,

      to: gym.owner.email,

      subject: "Gym Updated Successfully - GymKey",

      html: `
        <div style="font-family:Arial;padding:20px;">

          <h2>
            Gym Updated Successfully
          </h2>

          <p>
            Hello ${gym.owner.name},
          </p>

          <p>
            Your gym <strong>${gym.name}</strong>
            has been updated successfully.
          </p>

          <p>
            All latest changes are now saved.
          </p>

          <p>
            — GymKey Team
          </p>

        </div>
      `,
    });

    ///////////////////////////////////////////////////////////
    // RESPONSE
    ///////////////////////////////////////////////////////////

    return res.json({
      success: true,
      message: "Gym updated successfully",

      gym: updatedGym,
    });
  } catch (err) {
    console.error("updateGym error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerGym,
  listGyms,
  getGym,
  addGymPhotos,
  resubmitGym,
  updateGym,
};
