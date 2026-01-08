// const prisma = require("../prismaClient");
// const { uploadImage } = require("../utils/uploadUtils");

// //
// // ─────────────────────────────────────────────
// // REGISTER GYM (OWNER ONLY)
// // ─────────────────────────────────────────────
// //
// const registerGym = async (req, res) => {
//   try {
//     // Role check
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

//     // Required fields validation
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

//     // Upload cover image (optional)
//     let coverImageUrl = null;
//     if (req.files?.coverImage?.[0]) {
//       coverImageUrl = await uploadImage(req.files.coverImage[0]);
//     }

//     // Create gym
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

//     // Upload additional photos (optional)
//     if (req.files?.photos?.length) {
//       const photosData = await Promise.all(
//         req.files.photos.map(async (file) => ({
//           gymId: gym.id,
//           url: await uploadImage(file),
//         }))
//       );

//       await prisma.gymPhoto.createMany({
//         data: photosData,
//       });
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
// // LIST ALL GYMS
// // ─────────────────────────────────────────────
// //
// const listGyms = async (req, res) => {
//   try {
//     const filter = {};

//     // Non-admins only see approved gyms
//     if (req.user.role !== "admin") {
//       filter.status = "approved";
//     }

//     const gyms = await prisma.gym.findMany({
//       where: filter,
//       include: {
//         photos: true,
//         owner: {
//           select: { id: true, name: true, email: true },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json({ success: true, gyms });
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
// // GET SINGLE GYM
// // ─────────────────────────────────────────────
// //
// // GET SINGLE GYM
// const getGym = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gym = await prisma.gym.findUnique({
//       where: { id },
//       include: {
//         photos: true,
//         owner: {
//           select: { id: true, name: true, email: true },
//         },
//       },
//     });

//     if (!gym) {
//       return res.status(404).json({
//         success: false,
//         message: "Gym not found",
//       });
//     }

//     // Normalize status to lowercase
//     const status = gym.status?.toLowerCase();

//     // Allow owners to fetch their gym even if pending, but warn in frontend
//     if (
//       req.user.role !== "admin" &&
//       req.user.role !== "owner" &&
//       status !== "approved"
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Gym not approved yet",
//       });
//     }

//     res.json({ success: true, gym });
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
// // ADD GYM PHOTOS (OWNER ONLY)
// // ─────────────────────────────────────────────
// //
// const addGymPhotos = async (req, res) => {
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

//     // Ownership check
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
//       const url = await uploadImage(file);
//       const photo = await prisma.gymPhoto.create({
//         data: {
//           gymId: gym.id,
//           url,
//         },
//       });
//       uploadedPhotos.push(photo);
//     }

//     res.json({
//       success: true,
//       message: "Photos uploaded successfully",
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

// //
// // ─────────────────────────────────────────────
// // EXPORTS
// // ─────────────────────────────────────────────
// //
// module.exports = {
//   registerGym,
//   listGyms,
//   getGym,
//   addGymPhotos,
// };
const prisma = require("../prismaClient");

const BASE_URL = process.env.BASE_URL || "http://192.168.100.102:5001";

//
// ─────────────────────────────────────────────
// REGISTER GYM
// ─────────────────────────────────────────────
//
const registerGym = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only gym owners can register gyms",
      });
    }

    const {
      name,
      addressLine,
      city,
      latitude,
      longitude,
      tier,
      openingTime,
      closingTime,
      is24Hours,
    } = req.body;

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
        message: "All required fields must be provided",
      });
    }

    let coverImageUrl = null;
    if (req.files?.coverImage?.[0]) {
      coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const gym = await prisma.gym.create({
      data: {
        name,
        addressLine,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        tier: parseInt(tier),
        openingTime: openingTime || null,
        closingTime: closingTime || null,
        is24Hours: is24Hours === "true",
        coverImageUrl,
        ownerId: req.user.id,
        status: "pending",
      },
    });

    if (req.files?.photos?.length) {
      const photosData = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: `/uploads/${file.filename}`,
      }));

      await prisma.gymPhoto.createMany({ data: photosData });
    }

    res.json({
      success: true,
      message: "Gym registered successfully. Pending admin approval.",
      gym,
    });
  } catch (err) {
    console.error("registerGym error:", err);
    res.status(500).json({
      success: false,
      message: "Error registering gym",
    });
  }
};

//
// ─────────────────────────────────────────────
// LIST GYMS (FIXED IMAGES)
// ─────────────────────────────────────────────
//
const listGyms = async (req, res) => {
  try {
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
        ? `${BASE_URL}${gym.coverImageUrl}`
        : null,
      photos: gym.photos.map((p) => ({
        ...p,
        url: `${BASE_URL}${p.url}`,
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
// GET SINGLE GYM (FIXED IMAGES)
// ─────────────────────────────────────────────
//
const getGym = async (req, res) => {
  try {
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
        ? `${BASE_URL}${gym.coverImageUrl}`
        : null,
      photos: gym.photos.map((p) => ({
        ...p,
        url: `${BASE_URL}${p.url}`,
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
// ADD GYM PHOTOS
// ─────────────────────────────────────────────
//
const addGymPhotos = async (req, res) => {
  try {
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
        url: `${BASE_URL}${photo.url}`,
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

module.exports = {
  registerGym,
  listGyms,
  getGym,
  addGymPhotos,
};
