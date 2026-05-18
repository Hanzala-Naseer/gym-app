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

if (process.env.NODE_ENV !== "production") {
  transporter.verify((err) => {
    if (err) console.error("SMTP Error:", err);
    else console.log("SMTP Connected");
  });
}

///////////////////////////////////////////////////////////////
// LIST GYMS
///////////////////////////////////////////////////////////////

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

    res.json({ success: true, gyms });
  } catch (err) {
    console.error("listGyms error:", err);
    res.status(500).json({ success: false, message: "Error fetching gyms" });
  }
};

///////////////////////////////////////////////////////////////
// GET SINGLE GYM
///////////////////////////////////////////////////////////////

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
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "owner" &&
      gym.status !== "approved"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Gym not approved yet" });
    }

    res.json({ success: true, gym });
  } catch (err) {
    console.error("getGym error:", err);
    res.status(500).json({ success: false, message: "Error fetching gym" });
  }
};

///////////////////////////////////////////////////////////////
// ADD GYM PHOTOS
///////////////////////////////////////////////////////////////

const addGymPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await prisma.gym.findUnique({ where: { id } });

    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    if (req.user.id !== gym.ownerId) {
      return res
        .status(403)
        .json({ success: false, message: "Only the gym owner can add photos" });
    }

    if (!req.files?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const photo = await prisma.gymPhoto.create({
        data: {
          gymId: gym.id,
          url: file.path,
        },
      });
      uploadedPhotos.push(photo);
    }

    res.json({ success: true, photos: uploadedPhotos });
  } catch (err) {
    console.error("addGymPhotos error:", err);
    res.status(500).json({ success: false, message: "Error uploading photos" });
  }
};

///////////////////////////////////////////////////////////////
// REGISTER GYM — OWNER CANNOT SET TIER (ADMIN ASSIGNS LATER)
///////////////////////////////////////////////////////////////

const registerGym = async (req, res) => {
  try {
    // AUTHORIZATION
    if (req.user.role !== "owner") {
      return res
        .status(403)
        .json({ success: false, message: "Only gym owners can register gyms" });
    }

    // FETCH OWNER
    const owner = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!owner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }

    if (owner.isSuspended) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is suspended" });
    }

    // REQUEST DATA — tier removed from destructuring
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
    } = req.body;

    // VALIDATION — tier no longer required
    if (
      !name ||
      !addressLine ||
      !city ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    // COVER IMAGE
    let coverImageUrl = null;
    if (req.files?.coverImage?.[0]) {
      coverImageUrl = req.files.coverImage[0].path;
    }

    // CREATE GYM — tier set to null (admin assigns later)
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
        tier: null, // ⬅️ Admin assigns tier after review
        coverImageUrl,
        ownerId: owner.id,
        status: "pending",
        submittedAt: new Date(),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        photos: true,
      },
    });

    // SAVE GYM PHOTOS
    if (req.files?.photos?.length) {
      const photos = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: file.path,
      }));
      await prisma.gymPhoto.createMany({ data: photos });
    }

    // SAVE VERIFICATION DOCUMENTS
    const verificationDocs = [];

    if (req.files?.ownerCnic?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "owner_cnic",
        fileUrl: req.files.ownerCnic[0].path,
      });
    }

    if (req.files?.businessLicense?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "business_license",
        fileUrl: req.files.businessLicense[0].path,
      });
    }

    if (req.files?.ownershipProof?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "ownership_proof",
        fileUrl: req.files.ownershipProof[0].path,
      });
    }

    if (req.files?.utilityBill?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "utility_bill",
        fileUrl: req.files.utilityBill[0].path,
      });
    }

    if (verificationDocs.length > 0) {
      await prisma.gymVerificationDocument.createMany({
        data: verificationDocs,
      });
    }

    // ADMIN NOTIFICATION
    await prisma.adminNotification.create({
      data: {
        title: "New Gym Registration",
        message: `${gym.name} submitted for approval (Tier pending)`,
        type: "gym",
      },
    });

    // AUDIT LOG
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
          tier: null,
        },
      },
    });

    // EMAIL NOTIFICATION — updated to show tier pending
    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,
      to: owner.email,
      subject: "Gym Registration Submitted - GymKey",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;">
          <h2 style="color:#111827;">Gym Registration Submitted</h2>
          <p>Assalam o Alaikum ${owner.name},</p>
          <p>Your gym <strong>${gym.name}</strong> has been submitted successfully.</p>
          <p>Our admin team will verify your documents, assess your facilities, and assign an appropriate tier.</p>
          <div style="margin-top:20px;padding:15px;background:#f3f4f6;border-radius:8px;">
            <p><strong>Status:</strong> Pending Approval</p>
            <p><strong>City:</strong> ${gym.city}</p>
            <p><strong>Tier:</strong> Pending admin assignment</p>
          </div>
          <p style="margin-top:30px;">— GymKey Team</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message:
        "Gym registered successfully. Tier will be assigned by admin after review.",
      gym,
    });
  } catch (err) {
    console.error("registerGym error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

///////////////////////////////////////////////////////////////
// RESUBMIT GYM — PRESERVES EXISTING TIER, OWNER CANNOT CHANGE
///////////////////////////////////////////////////////////////

const resubmitGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    if (gym.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (gym.status !== "rejected" && gym.status !== "changes_requested") {
      return res
        .status(400)
        .json({ success: false, message: "Gym cannot be resubmitted" });
    }

    // Handle file uploads if present (for full form resubmission)
    let coverImageUrl = gym.coverImageUrl;
    if (req.files?.coverImage?.[0]) {
      coverImageUrl = req.files.coverImage[0].path;
    }

    const updatedGym = await prisma.gym.update({
      where: { id },
      data: {
        name: req.body.name || gym.name,
        description: req.body.description || gym.description,
        addressLine: req.body.addressLine || gym.addressLine,
        city: req.body.city || gym.city,
        province: req.body.province || gym.province,
        postalCode: req.body.postalCode || gym.postalCode,
        latitude:
          req.body.latitude !== undefined
            ? parseFloat(req.body.latitude)
            : gym.latitude,
        longitude:
          req.body.longitude !== undefined
            ? parseFloat(req.body.longitude)
            : gym.longitude,
        phoneNumber: req.body.phoneNumber || gym.phoneNumber,
        whatsappNumber: req.body.whatsappNumber || gym.whatsappNumber,
        instagramHandle:
          req.body.instagramHandle !== undefined
            ? req.body.instagramHandle
            : gym.instagramHandle,
        websiteUrl:
          req.body.websiteUrl !== undefined
            ? req.body.websiteUrl
            : gym.websiteUrl,
        googleMapsLink:
          req.body.googleMapsLink !== undefined
            ? req.body.googleMapsLink
            : gym.googleMapsLink,
        cnicNumber:
          req.body.cnicNumber !== undefined
            ? req.body.cnicNumber
            : gym.cnicNumber,
        businessName:
          req.body.businessName !== undefined
            ? req.body.businessName
            : gym.businessName,
        openingTime: req.body.openingTime || gym.openingTime,
        closingTime: req.body.closingTime || gym.closingTime,
        is24Hours:
          req.body.is24Hours !== undefined
            ? req.body.is24Hours === "true"
            : gym.is24Hours,
        // ⬇️ TIER PRESERVED — owner cannot change
        coverImageUrl,
        status: "pending",
        rejectionReason: null,
        approvalNotes: null,
        reviewedAt: null,
        reviewedByAdminId: null,
        submittedAt: new Date(),
        resubmissionCount: { increment: 1 },
      },
    });

    // Handle new photos if uploaded
    if (req.files?.photos?.length) {
      const photos = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: file.path,
      }));
      await prisma.gymPhoto.createMany({ data: photos });
    }

    // Handle new verification docs if uploaded
    const verificationDocs = [];
    if (req.files?.ownerCnic?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "owner_cnic",
        fileUrl: req.files.ownerCnic[0].path,
      });
    }
    if (req.files?.businessLicense?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "business_license",
        fileUrl: req.files.businessLicense[0].path,
      });
    }
    if (req.files?.ownershipProof?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "ownership_proof",
        fileUrl: req.files.ownershipProof[0].path,
      });
    }
    if (req.files?.utilityBill?.[0]) {
      verificationDocs.push({
        gymId: gym.id,
        type: "utility_bill",
        fileUrl: req.files.utilityBill[0].path,
      });
    }
    if (verificationDocs.length > 0) {
      await prisma.gymVerificationDocument.createMany({
        data: verificationDocs,
      });
    }

    await prisma.adminNotification.create({
      data: {
        title: "Gym Resubmitted",
        message: `${gym.name} resubmitted for approval`,
        type: "gym",
      },
    });

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

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,
      to: gym.owner.email,
      subject: "Gym Resubmitted - GymKey",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Gym Resubmitted Successfully</h2>
          <p>Hello ${gym.owner.name},</p>
          <p>Your gym <strong>${gym.name}</strong> has been resubmitted successfully.</p>
          <p>Our admin team will review the updates shortly.</p>
          <p>— GymKey Team</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Gym resubmitted successfully",
      gym: updatedGym,
    });
  } catch (err) {
    console.error("resubmitGym error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

///////////////////////////////////////////////////////////////
// UPDATE GYM — OWNER CANNOT CHANGE TIER
///////////////////////////////////////////////////////////////

const updateGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: { owner: true, photos: true },
    });

    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    if (gym.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    // ⬇️ TIER REMOVED from destructuring — owner cannot update it
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
    } = req.body;

    // COVER IMAGE
    let coverImageUrl = gym.coverImageUrl;
    if (req.files?.coverImage?.[0]) {
      coverImageUrl = req.files.coverImage[0].path;
    }

    const updatedGym = await prisma.gym.update({
      where: { id },
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
        // ⬇️ TIER NOT INCLUDED — preserved as-is
        coverImageUrl,
      },
    });

    // SAVE NEW PHOTOS
    if (req.files?.photos?.length) {
      const photos = req.files.photos.map((file) => ({
        gymId: gym.id,
        url: file.path,
      }));
      await prisma.gymPhoto.createMany({ data: photos });
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "UPDATED_GYM",
        entityType: "GYM",
        entityId: gym.id,
        metadata: { gymName: gym.name },
      },
    });

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,
      to: gym.owner.email,
      subject: "Gym Updated Successfully - GymKey",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Gym Updated Successfully</h2>
          <p>Hello ${gym.owner.name},</p>
          <p>Your gym <strong>${gym.name}</strong> has been updated successfully.</p>
          <p>All latest changes are now saved.</p>
          <p>— GymKey Team</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Gym updated successfully",
      gym: updatedGym,
    });
  } catch (err) {
    console.error("updateGym error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN REVIEW GYM — Approve/Reject with optional tier assignment
///////////////////////////////////////////////////////////////

const reviewGym = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can review gyms",
      });
    }

    const { id } = req.params;
    const { status, rejectionReason, approvalNotes, tier } = req.body;

    if (
      !status ||
      !["approved", "rejected", "changes_requested"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid status required: approved, rejected, or changes_requested",
      });
    }

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    // Build update data
    const updateData = {
      status,
      reviewedAt: new Date(),
      reviewedByAdminId: req.user.id,
    };

    if (status === "approved") {
      updateData.approvalNotes = approvalNotes || null;
      updateData.rejectionReason = null;
      // Assign tier if provided, otherwise keep existing
      if (tier !== undefined) {
        updateData.tier = parseInt(tier);
      }
    } else if (status === "rejected" || status === "changes_requested") {
      updateData.rejectionReason = rejectionReason || null;
      updateData.approvalNotes = null;
    }

    const updatedGym = await prisma.gym.update({
      where: { id },
      data: updateData,
    });

    // Email to owner
    const emailSubject =
      status === "approved"
        ? "Gym Approved - GymKey"
        : status === "rejected"
          ? "Gym Application Rejected - GymKey"
          : "Changes Requested - GymKey";

    const emailHtml =
      status === "approved"
        ? `
        <div style="font-family:Arial;padding:20px;">
          <h2 style="color:#1A7A45;">Gym Approved!</h2>
          <p>Hello ${gym.owner.name},</p>
          <p>Congratulations! Your gym <strong>${gym.name}</strong> has been approved.</p>
          ${updateData.tier ? `<p><strong>Assigned Tier:</strong> ${updateData.tier}</p>` : ""}
          ${approvalNotes ? `<p><strong>Admin Notes:</strong> ${approvalNotes}</p>` : ""}
          <p>Your gym is now live and visible to members.</p>
          <p>— GymKey Team</p>
        </div>
      `
        : status === "rejected"
          ? `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#7A0000;">Application Rejected</h2>
            <p>Hello ${gym.owner.name},</p>
            <p>Your gym <strong>${gym.name}</strong> application has been rejected.</p>
            ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
            <p>You can update and resubmit your application.</p>
            <p>— GymKey Team</p>
          </div>
        `
          : `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#7A3500;">Changes Requested</h2>
            <p>Hello ${gym.owner.name},</p>
            <p>Admin has requested changes for your gym <strong>${gym.name}</strong>.</p>
            ${rejectionReason ? `<p><strong>Feedback:</strong> ${rejectionReason}</p>` : ""}
            <p>Please update and resubmit.</p>
            <p>— GymKey Team</p>
          </div>
        `;

    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,
      to: gym.owner.email,
      subject: emailSubject,
      html: emailHtml,
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: `REVIEWED_GYM_${status.toUpperCase()}`,
        entityType: "GYM",
        entityId: gym.id,
        metadata: {
          gymName: gym.name,
          tier: updateData.tier || gym.tier,
          rejectionReason: rejectionReason || null,
        },
      },
    });

    return res.json({
      success: true,
      message: `Gym ${status} successfully`,
      gym: updatedGym,
    });
  } catch (err) {
    console.error("reviewGym error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN ASSIGN/UPDATE TIER — Standalone endpoint
///////////////////////////////////////////////////////////////

const assignTier = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign tiers",
      });
    }

    const { id } = req.params;
    const { tier, approvalNotes } = req.body;

    if (!tier || ![1, 2, 3].includes(parseInt(tier))) {
      return res.status(400).json({
        success: false,
        message: "Valid tier required (1, 2, or 3)",
      });
    }

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    const updatedGym = await prisma.gym.update({
      where: { id },
      data: {
        tier: parseInt(tier),
        approvalNotes: approvalNotes || gym.approvalNotes,
      },
    });

    // Notify owner
    await transporter.sendMail({
      from: `"GymKey" <${process.env.SMTP_FROM}>`,
      to: gym.owner.email,
      subject: "Gym Tier Updated - GymKey",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Tier ${tier} Assigned</h2>
          <p>Hello ${gym.owner.name},</p>
          <p>Your gym <strong>${gym.name}</strong> has been assigned <strong>Tier ${tier}</strong>.</p>
          ${approvalNotes ? `<p><strong>Admin Notes:</strong> ${approvalNotes}</p>` : ""}
          <p>— GymKey Team</p>
        </div>
      `,
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "ASSIGNED_TIER",
        entityType: "GYM",
        entityId: gym.id,
        metadata: { tier: parseInt(tier), gymName: gym.name },
      },
    });

    return res.json({
      success: true,
      message: `Tier ${tier} assigned successfully`,
      gym: updatedGym,
    });
  } catch (err) {
    console.error("assignTier error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

///////////////////////////////////////////////////////////////
// GET OWNER GYM MEMBERS
///////////////////////////////////////////////////////////////

const getGymMembers = async (req, res) => {
  try {
    // Find owner's gym
    const gym = await prisma.gym.findFirst({
      where: {
        ownerId: req.user.id,
      },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    // Get all checkins with users
    const checkins = await prisma.checkIn.findMany({
      where: {
        gymId: gym.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkedInAt: "desc",
      },
    });

    // Group unique members
    const memberMap = {};

    for (const checkin of checkins) {
      const userId = checkin.user.id;

      if (!memberMap[userId]) {
        memberMap[userId] = {
          id: userId,
          user: checkin.user,
          joinedAt: checkin.checkedInAt,
          totalCheckins: 0,
          lastCheckIn: checkin.checkedInAt,
        };
      }

      memberMap[userId].totalCheckins += 1;

      // earliest checkin becomes joined date
      if (
        new Date(checkin.checkedInAt) < new Date(memberMap[userId].joinedAt)
      ) {
        memberMap[userId].joinedAt = checkin.checkedInAt;
      }
    }

    const members = Object.values(memberMap);

    return res.json({
      success: true,
      members,
    });
  } catch (err) {
    console.error("getGymMembers error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gym members",
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
  reviewGym, // ⬅️ NEW
  assignTier, // ⬅️ NEW
  getGymMembers, // ⬅️ NEW
};
