// // controllers/payoutController.js
// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();

// const transporter = require("../config/mailer"); // or "../utils/email" or "../config/nodemailer"

// ///////////////////////////////////////////////////////////////
// // HELPERS
// ///////////////////////////////////////////////////////////////

// /**
//  * Fetch the active payout rate for a (memberTierSlug × gymTier) pair from DB.
//  * Throws if no rate is configured so the bug is obvious immediately.
//  */
// const fetchPayoutRate = async (memberTierSlug, gymTier) => {
//   const rate = await prisma.payoutRate.findFirst({
//     where: {
//       memberTierSlug: memberTierSlug.toLowerCase(),
//       gymTier,
//       isActive: true,
//     },
//   });

//   if (!rate) {
//     throw new Error(
//       `No active payout rate for member tier "${memberTierSlug}" × gym tier "${gymTier}". ` +
//         `Run seed-payout-rates.js to populate the PayoutRate table.`,
//     );
//   }

//   return rate;
// };

// /**
//  * Resolve a user's current active subscription tier slug.
//  * Returns e.g. "basic" | "ultimate" | "elite" or null.
//  */
// const resolveUserTierSlug = async (userId) => {
//   const subscription = await prisma.subscription.findFirst({
//     where: { userId, status: "active" },
//     include: { tier: { select: { slug: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//   return subscription?.tier?.slug ?? null;
// };

// /**
//  * Sum gymPayoutAmount across check-in records.
//  * Amounts are locked at check-in time so history is always accurate.
//  */
// const sumGymPayouts = (checkIns) =>
//   checkIns.reduce((sum, ci) => sum + (ci.gymPayoutAmount ?? 0), 0);

// ///////////////////////////////////////////////////////////////
// // GET PAYOUT SUMMARY FOR A GYM  (Owner / Admin)
// ///////////////////////////////////////////////////////////////

// const getGymPayoutSummary = async (req, res) => {
//   try {
//     const { gymId } = req.params;
//     const { id: userId, role: userRole } = req.user;

//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//       include: { owner: true },
//     });

//     if (!gym)
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     if (userRole !== "admin" && gym.ownerId !== userId)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     // Fetch active payout rates for this gym tier
//     const payoutRates = await prisma.payoutRate.findMany({
//       where: {
//         gymTier: gym.gymTier,
//         isActive: true,
//       },
//     });

//     // Get default/base rate (average or first available)
//     const baseRate =
//       payoutRates.length > 0
//         ? Math.round(
//             payoutRates.reduce((sum, r) => sum + r.gymGets, 0) /
//               payoutRates.length,
//           )
//         : 0;

//     const [unpaidCheckIns, paidCheckIns] = await Promise.all([
//       prisma.checkIn.findMany({
//         where: { gymId, isPaidToGym: false },
//         select: { id: true, gymPayoutAmount: true },
//       }),
//       prisma.checkIn.findMany({
//         where: { gymId, isPaidToGym: true },
//         select: { id: true, gymPayoutAmount: true },
//       }),
//     ]);

//     return res.json({
//       success: true,
//       summary: {
//         gymId,
//         gymName: gym.name,
//         gymTier: gym.gymTier,
//         payoutRate: baseRate, // ← ADD THIS
//         unpaid: {
//           visits: unpaidCheckIns.length,
//           amountPKR: sumGymPayouts(unpaidCheckIns),
//         },
//         paid: {
//           visits: paidCheckIns.length,
//           amountPKR: sumGymPayouts(paidCheckIns),
//         },
//         totalVisits: unpaidCheckIns.length + paidCheckIns.length,
//       },
//     });
//   } catch (err) {
//     console.error("getGymPayoutSummary error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
// ///////////////////////////////////////////////////////////////
// // LIST UNPAID CHECK-INS FOR A GYM
// ///////////////////////////////////////////////////////////////

// const getUnpaidCheckIns = async (req, res) => {
//   try {
//     const { gymId } = req.params;
//     const { id: userId, role: userRole } = req.user;

//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//       select: { id: true, name: true, ownerId: true, gymTier: true },
//     });

//     if (!gym)
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     if (userRole !== "admin" && gym.ownerId !== userId)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     const checkIns = await prisma.checkIn.findMany({
//       where: { gymId, isPaidToGym: false },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             subscriptions: {
//               where: { status: "active" },
//               take: 1,
//               orderBy: { createdAt: "desc" },
//               include: { tier: { select: { slug: true, name: true } } },
//             },
//           },
//         },
//       },
//       orderBy: { checkedInAt: "asc" },
//     });

//     const enriched = checkIns.map((ci) => ({
//       id: ci.id,
//       checkedInAt: ci.checkedInAt,
//       gymPayoutAmount: ci.gymPayoutAmount,
//       platformAmount: ci.platformAmount,
//       memberTierSlug:
//         ci.memberTierSlug ?? ci.user.subscriptions[0]?.tier?.slug ?? "unknown",
//       memberTierName: ci.user.subscriptions[0]?.tier?.name ?? "Unknown",
//       user: {
//         id: ci.user.id,
//         name: ci.user.name,
//         email: ci.user.email,
//       },
//     }));

//     return res.json({
//       success: true,
//       gymName: gym.name,
//       gymTier: gym.gymTier,
//       count: enriched.length,
//       totalUnpaidPKR: sumGymPayouts(
//         checkIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
//       ),
//       checkIns: enriched,
//     });
//   } catch (err) {
//     console.error("getUnpaidCheckIns error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // PROCESS PAYOUT  (Admin only — marks check-ins as paid)
// ///////////////////////////////////////////////////////////////

// const processPayout = async (req, res) => {
//   try {
//     // ─── AUTHORIZATION ─────────────────────────────────────────────────────
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin only",
//       });
//     }

//     const { gymId } = req.params;
//     const { checkInIds, payoutMethod, notes, transactionRef } = req.body;

//     // ─── HANDLE SCREENSHOT ─────────────────────────────────────────────────
//     let screenshotUrl = null;
//     let screenshotPublicId = null;

//     if (req.screenshotUrl) {
//       screenshotUrl = req.screenshotUrl;
//       screenshotPublicId = req.screenshotPublicId || null;
//     } else if (req.file?.path) {
//       const fs = require("fs");
//       if (fs.existsSync(req.file.path)) {
//         screenshotUrl = req.file.path;
//       }
//     } else if (req.body.screenshotUrl?.startsWith("http")) {
//       screenshotUrl = req.body.screenshotUrl;
//     }

//     // ─── FETCH GYM ─────────────────────────────────────────────────────────
//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//       include: {
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

//     // ─── FETCH UNPAID CHECK-INS ────────────────────────────────────────────
//     const whereClause = {
//       gymId,
//       isPaidToGym: false,
//       ...(checkInIds?.length ? { id: { in: checkInIds } } : {}),
//     };

//     const unpaidCheckIns = await prisma.checkIn.findMany({
//       where: whereClause,
//       select: {
//         id: true,
//         gymPayoutAmount: true,
//         platformAmount: true,
//         memberTierSlug: true,
//         userId: true,
//         checkedInAt: true,
//       },
//     });

//     if (unpaidCheckIns.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message:
//           "No unpaid check-ins found — already processed or none pending",
//         payout: null,
//       });
//     }

//     // ─── CALCULATE TOTALS ──────────────────────────────────────────────────
//     const totalGymPKR = sumGymPayouts(unpaidCheckIns);
//     const totalPlatformPKR = unpaidCheckIns.reduce(
//       (sum, ci) => sum + (ci.platformAmount ?? 0),
//       0,
//     );

//     // ─── MARK AS PAID (TRANSACTION) ────────────────────────────────────────
//     await prisma.$transaction(
//       unpaidCheckIns.map((ci) =>
//         prisma.checkIn.update({
//           where: { id: ci.id },
//           data: { isPaidToGym: true },
//         }),
//       ),
//     );

//     // ─── SEND EMAIL TO GYM OWNER ───────────────────────────────────────────
//     if (gym.owner?.email) {
//       const emailAttachments = [];
//       const fs = require("fs");
//       const path = require("path");

//       if (screenshotUrl) {
//         if (fs.existsSync(screenshotUrl)) {
//           emailAttachments.push({
//             filename: path.basename(screenshotUrl),
//             path: screenshotUrl,
//             contentType: "image/png",
//           });
//         } else if (screenshotUrl.startsWith("http")) {
//           emailAttachments.push({
//             filename: "transaction-screenshot.png",
//             path: screenshotUrl,
//           });
//         }
//       }

//       const checkInDetails = unpaidCheckIns
//         .map(
//           (ci, idx) => `
//             <tr>
//               <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
//               <td style="padding:8px;border:1px solid #ddd;">${new Date(
//                 ci.checkedInAt,
//               ).toLocaleDateString("en-PK")}</td>
//               <td style="padding:8px;border:1px solid #ddd;">PKR ${
//                 ci.gymPayoutAmount
//               }</td>
//               <td style="padding:8px;border:1px solid #ddd;">${
//                 ci.memberTierSlug
//               }</td>
//             </tr>
//           `,
//         )
//         .join("");

//       const screenshotHtml = screenshotUrl
//         ? `
//             <div style="margin:20px 0;">
//               <p style="color:#1B5E20;font-weight:bold;font-size:13px;margin-bottom:10px;">📎 Transaction Screenshot:</p>
//               <img src="${screenshotUrl}" style="max-width:100%;border-radius:8px;border:1px solid #ddd;" alt="Payment Proof" />
//               <p style="color:#388E3C;font-size:11px;margin-top:5px;">Proof of payment uploaded by admin</p>
//             </div>
//             <div style="background:#E8F5E9;border-left:4px solid #4CAF50;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;">
//               <p style="color:#1B5E20;margin:0;font-weight:bold;font-size:13px;">📎 Transaction Screenshot Attached</p>
//               <p style="color:#388E3C;margin:8px 0 0 0;font-size:12px;">Proof of payment is attached to this email.</p>
//             </div>
//           `
//         : `
//             <div style="background:#FFF3E0;border-left:4px solid #FF9800;padding:12px;margin:15px 0;border-radius:0 8px 8px 0;">
//               <p style="color:#E65100;margin:0;font-size:12px;">⚠️ No transaction screenshot attached. Contact admin if needed.</p>
//             </div>
//           `;

//       await transporter.sendMail({
//         from: `"GymKey Payouts" <${process.env.SMTP_FROM}>`,
//         to: gym.owner.email,
//         cc: process.env.ADMIN_EMAIL || "admin@gymkey.pk",
//         subject: `💰 Payout Processed — ${gym.name} — PKR ${totalGymPKR.toLocaleString()}`,
//         html: `
//           <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
//             <div style="background:linear-gradient(135deg,#5B3A29,#8B5E46);padding:30px;text-align:center;border-radius:12px 12px 0 0;">
//               <h1 style="color:white;margin:0;font-size:24px;">💰 Payout Processed</h1>
//               <p style="color:#F5D0A9;margin:8px 0 0 0;font-size:14px;">${gym.name}</p>
//             </div>

//             <div style="background:#FAF7F4;padding:30px;border:1px solid #E7DDD3;border-top:none;">
//               <p style="color:#2B160B;font-size:16px;">Hello <strong>${gym.owner.name}</strong>,</p>

//               <p style="color:#5B4A40;line-height:1.6;">
//                 Your gym payout has been processed by the GymKey admin team.
//               </p>

//               <div style="background:white;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #E7DDD3;">
//                 <h3 style="color:#2B160B;margin:0 0 15px 0;font-size:18px;">📊 Payout Summary</h3>

//                 <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8E1;">
//                   <span style="color:#7A6A5D;">Check-ins Paid</span>
//                   <span style="color:#2B160B;font-weight:bold;">${unpaidCheckIns.length}</span>
//                 </div>

//                 <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8E1;">
//                   <span style="color:#7A6A5D;">Total Amount</span>
//                   <span style="color:#1B5E4A;font-weight:bold;font-size:18px;">PKR ${totalGymPKR.toLocaleString()}</span>
//                 </div>

//                 <div style="display:flex;justify-content:space-between;padding:10px 0;">
//                   <span style="color:#7A6A5D;">Payout Method</span>
//                   <span style="color:#2B160B;font-weight:bold;text-transform:uppercase;">${
//                     payoutMethod || "Manual Transfer"
//                   }</span>
//                 </div>

//                 ${
//                   transactionRef
//                     ? `
//                 <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #F0E8E1;">
//                   <span style="color:#7A6A5D;">Transaction Ref</span>
//                   <span style="color:#2B160B;font-family:monospace;">${transactionRef}</span>
//                 </div>
//                 `
//                     : ""
//                 }
//               </div>

//               <h4 style="color:#2B160B;margin:25px 0 10px 0;">📋 Check-in Details</h4>
//               <table style="width:100%;border-collapse:collapse;font-size:13px;">
//                 <thead>
//                   <tr style="background:#F5EFE8;">
//                     <th style="padding:10px;border:1px solid #ddd;text-align:left;">#</th>
//                     <th style="padding:10px;border:1px solid #ddd;text-align:left;">Date</th>
//                     <th style="padding:10px;border:1px solid #ddd;text-align:left;">Amount</th>
//                     <th style="padding:10px;border:1px solid #ddd;text-align:left;">Member Tier</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${checkInDetails}
//                 </tbody>
//               </table>

//               ${screenshotHtml}

//               ${
//                 notes
//                   ? `
//               <div style="background:#FFF8E7;border-left:4px solid #D1A77C;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;">
//                 <p style="color:#7A3D16;margin:0;font-weight:bold;font-size:13px;">📝 Admin Notes:</p>
//                 <p style="color:#5B4A40;margin:8px 0 0 0;font-style:italic;">${notes}</p>
//               </div>
//               `
//                   : ""
//               }

//               <div style="margin-top:30px;padding-top:20px;border-top:1px solid #E7DDD3;text-align:center;">
//                 <p style="color:#8D7E73;font-size:12px;">
//                   Processed on ${new Date().toLocaleDateString("en-PK", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                   <br>by GymKey Admin Team
//                 </p>
//                 <p style="color:#5B3A29;font-size:11px;margin-top:15px;">
//                   Questions? Reply to this email or contact support@gymkey.pk
//                 </p>
//               </div>
//             </div>
//           </div>
//         `,
//         attachments: emailAttachments,
//       });

//       console.log(`📧 Payout email sent to ${gym.owner.email}`);
//     }

//     // ─── AUDIT LOG ─────────────────────────────────────────────────────────
//     try {
//       const adminId = req.user.id || req.user.userId || req.user._id;

//       if (adminId) {
//         await prisma.adminAuditLog.create({
//           data: {
//             adminId: adminId,
//             action: "PROCESSED_PAYOUT",
//             entityType: "Gym",
//             entityId: gymId,
//             metadata: {
//               checkInsPaid: unpaidCheckIns.length,
//               totalGymPKR,
//               totalPlatformPKR,
//               payoutMethod: payoutMethod || "manual",
//               notes: notes || null,
//               transactionRef: transactionRef || null,
//               screenshotUrl: screenshotUrl || null,
//               screenshotPublicId: screenshotPublicId || null,
//               gymName: gym.name,
//               ownerId: gym.ownerId,
//               ownerEmail: gym.owner?.email || null,
//               emailSent: !!gym.owner?.email,
//             },
//           },
//         });
//         console.log("✅ Audit log created");
//       } else {
//         console.log("⚠️ Skipping audit log: no admin ID found in req.user");
//       }
//     } catch (auditErr) {
//       console.error("⚠️ Audit log failed (non-critical):", auditErr.message);
//     }

//     // ─── SUCCESS RESPONSE ──────────────────────────────────────────────────
//     return res.json({
//       success: true,
//       message: `Payout processed for ${unpaidCheckIns.length} check-ins`,
//       payout: {
//         gymId,
//         gymName: gym.name,
//         checkInsPaid: unpaidCheckIns.length,
//         totalGymPKR,
//         totalPlatformPKR,
//         payoutMethod: payoutMethod || "manual",
//         processedAt: new Date().toISOString(),
//         notes: notes || null,
//         transactionRef: transactionRef || null,
//         screenshotUrl: screenshotUrl || null,
//         screenshotPublicId: screenshotPublicId || null,
//         emailSent: !!gym.owner?.email,
//       },
//     });
//   } catch (err) {
//     console.error("processPayout error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// ///////////////////////////////////////////////////////////////
// // GET PAYOUT HISTORY FOR A GYM
// ///////////////////////////////////////////////////////////////

// const getPayoutHistory = async (req, res) => {
//   try {
//     const { gymId } = req.params;
//     const { id: userId, role: userRole } = req.user;

//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//       select: { id: true, name: true, ownerId: true, gymTier: true },
//     });

//     if (!gym)
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     if (userRole !== "admin" && gym.ownerId !== userId)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     const paidCheckIns = await prisma.checkIn.findMany({
//       where: { gymId, isPaidToGym: true },
//       include: { user: { select: { id: true, name: true, email: true } } },
//       orderBy: { checkedInAt: "desc" },
//     });

//     // Group by YYYY-MM
//     const monthlySummary = {};
//     paidCheckIns.forEach((ci) => {
//       const month = ci.checkedInAt.toISOString().slice(0, 7);
//       if (!monthlySummary[month])
//         monthlySummary[month] = {
//           visits: 0,
//           gymAmountPKR: 0,
//           platformAmountPKR: 0,
//         };

//       monthlySummary[month].visits += 1;
//       monthlySummary[month].gymAmountPKR += ci.gymPayoutAmount ?? 0;
//       monthlySummary[month].platformAmountPKR += ci.platformAmount ?? 0;
//     });

//     return res.json({
//       success: true,
//       gymId,
//       gymName: gym.name,
//       gymTier: gym.gymTier,
//       totalPaidCheckIns: paidCheckIns.length,
//       totalPaidAmountPKR: sumGymPayouts(
//         paidCheckIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
//       ),
//       monthlyBreakdown: monthlySummary,
//       checkIns: paidCheckIns.map((ci) => ({
//         id: ci.id,
//         user: ci.user,
//         checkedInAt: ci.checkedInAt,
//         memberTierSlug: ci.memberTierSlug,
//         gymPayoutAmount: ci.gymPayoutAmount,
//         platformAmount: ci.platformAmount,
//       })),
//     });
//   } catch (err) {
//     console.error("getPayoutHistory error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // ADMIN: ALL GYMS PAYOUT OVERVIEW
// ///////////////////////////////////////////////////////////////

// const getAllGymsPayoutOverview = async (req, res) => {
//   try {
//     if (req.user.role !== "admin")
//       return res.status(403).json({ success: false, message: "Admin only" });

//     const gyms = await prisma.gym.findMany({
//       where: { isArchived: false },
//       include: { owner: { select: { id: true, name: true, email: true } } },
//       orderBy: { createdAt: "desc" },
//     });

//     const overview = await Promise.all(
//       gyms.map(async (gym) => {
//         const [unpaid, paid] = await Promise.all([
//           prisma.checkIn.aggregate({
//             where: { gymId: gym.id, isPaidToGym: false },
//             _count: { id: true },
//             _sum: { gymPayoutAmount: true, platformAmount: true },
//           }),
//           prisma.checkIn.aggregate({
//             where: { gymId: gym.id, isPaidToGym: true },
//             _count: { id: true },
//             _sum: { gymPayoutAmount: true, platformAmount: true },
//           }),
//         ]);

//         return {
//           gymId: gym.id,
//           gymName: gym.name,
//           gymTier: gym.gymTier,
//           owner: gym.owner,
//           status: gym.status,
//           isBlocked: gym.isBlocked,
//           unpaidVisits: unpaid._count.id,
//           unpaidAmountPKR: unpaid._sum.gymPayoutAmount ?? 0,
//           unpaidPlatformAmountPKR: unpaid._sum.platformAmount ?? 0,
//           paidVisits: paid._count.id,
//           paidAmountPKR: paid._sum.gymPayoutAmount ?? 0,
//           paidPlatformAmountPKR: paid._sum.platformAmount ?? 0,
//           totalVisits: unpaid._count.id + paid._count.id,
//           totalGymPayoutPKR:
//             (unpaid._sum.gymPayoutAmount ?? 0) +
//             (paid._sum.gymPayoutAmount ?? 0),
//           totalPlatformEarningsPKR:
//             (unpaid._sum.platformAmount ?? 0) + (paid._sum.platformAmount ?? 0),
//         };
//       }),
//     );

//     const totalUnpaidPKR = overview.reduce(
//       (sum, g) => sum + g.unpaidAmountPKR,
//       0,
//     );
//     const totalPaidPKR = overview.reduce((sum, g) => sum + g.paidAmountPKR, 0);
//     const totalUnpaidPlatformPKR = overview.reduce(
//       (sum, g) => sum + g.unpaidPlatformAmountPKR,
//       0,
//     );
//     const totalPaidPlatformPKR = overview.reduce(
//       (sum, g) => sum + g.paidPlatformAmountPKR,
//       0,
//     );
//     const totalPlatformEarningsPKR =
//       totalUnpaidPlatformPKR + totalPaidPlatformPKR;

//     return res.json({
//       success: true,
//       summary: {
//         totalGyms: overview.length,
//         totalUnpaidPKR,
//         totalPaidPKR,
//         totalUnpaidPlatformPKR,
//         totalPaidPlatformPKR,
//         totalPlatformEarningsPKR,
//         netPayablePKR: totalUnpaidPKR,
//       },
//       gyms: overview,
//     });
//   } catch (err) {
//     console.error("getAllGymsPayoutOverview error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
// ///////////////////////////////////////////////////////////////
// // ADMIN: LIST ALL PAYOUT RATES FROM DB
// ///////////////////////////////////////////////////////////////

// const getPayoutRates = async (req, res) => {
//   try {
//     if (req.user.role !== "admin")
//       return res.status(403).json({ success: false, message: "Admin only" });

//     const rates = await prisma.payoutRate.findMany({
//       orderBy: [{ memberTierSlug: "asc" }, { gymTier: "asc" }],
//     });

//     return res.json({ success: true, count: rates.length, rates });
//   } catch (err) {
//     console.error("getPayoutRates error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // ADMIN: UPDATE A PAYOUT RATE ROW
// ///////////////////////////////////////////////////////////////

// const updatePayoutRate = async (req, res) => {
//   try {
//     if (req.user.role !== "admin")
//       return res.status(403).json({ success: false, message: "Admin only" });

//     const { memberTierSlug, gymTier, gymGets, platformKeeps, multiplier } =
//       req.body;

//     if (!memberTierSlug || !gymTier || gymGets == null || platformKeeps == null)
//       return res.status(400).json({
//         success: false,
//         message:
//           "memberTierSlug, gymTier, gymGets, and platformKeeps are required",
//       });

//     const rate = await prisma.payoutRate.upsert({
//       where: {
//         memberTierSlug_gymTier: { memberTierSlug, gymTier },
//       },
//       update: {
//         gymGets: parseInt(gymGets),
//         platformKeeps: parseInt(platformKeeps),
//         ...(multiplier != null ? { multiplier: parseFloat(multiplier) } : {}),
//       },
//       create: {
//         memberTierSlug,
//         gymTier,
//         gymGets: parseInt(gymGets),
//         platformKeeps: parseInt(platformKeeps),
//         multiplier: multiplier ? parseFloat(multiplier) : 1.0,
//       },
//     });

//     await prisma.adminAuditLog.create({
//       data: {
//         adminId: req.user.id,
//         action: "UPDATED_PAYOUT_RATE",
//         entityType: "PayoutRate",
//         entityId: rate.id,
//         metadata: {
//           memberTierSlug,
//           gymTier,
//           gymGets: rate.gymGets,
//           platformKeeps: rate.platformKeeps,
//           multiplier: rate.multiplier,
//         },
//       },
//     });

//     return res.json({ success: true, message: "Payout rate updated", rate });
//   } catch (err) {
//     console.error("updatePayoutRate error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // ADMIN: GET PAYOUT AUDIT LOGS
// ///////////////////////////////////////////////////////////////

// const getPayoutAuditLogs = async (req, res) => {
//   try {
//     if (req.user.role !== "admin")
//       return res.status(403).json({ success: false, message: "Admin only" });

//     const { gymId } = req.query;
//     const where = { action: "PROCESSED_PAYOUT" };
//     if (gymId) where.entityId = gymId;

//     const logs = await prisma.adminAuditLog.findMany({
//       where,
//       include: { admin: { select: { id: true, name: true, email: true } } },
//       orderBy: { createdAt: "desc" },
//       take: 100,
//     });

//     return res.json({
//       success: true,
//       count: logs.length,
//       logs: logs.map((log) => ({
//         id: log.id,
//         admin: log.admin,
//         action: log.action,
//         gymId: log.entityId,
//         metadata: log.metadata,
//         createdAt: log.createdAt,
//       })),
//     });
//   } catch (err) {
//     console.error("getPayoutAuditLogs error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // OWNER: GET/UPDATE PAYOUT ACCOUNT
// ///////////////////////////////////////////////////////////////

// const getPayoutAccount = async (req, res) => {
//   try {
//     const { gymId } = req.params;
//     const { id: userId, role: userRole } = req.user;

//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//       include: { payoutAccount: true },
//     });

//     if (!gym)
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     if (userRole !== "admin" && gym.ownerId !== userId)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     return res.json({
//       success: true,
//       account: gym.payoutAccount || null,
//     });
//   } catch (err) {
//     console.error("getPayoutAccount error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// const updatePayoutAccount = async (req, res) => {
//   try {
//     const { gymId } = req.params;
//     const { id: userId, role: userRole } = req.user;
//     const {
//       accountType,
//       bankName,
//       accountTitle,
//       accountNumber,
//       iban,
//       walletProvider,
//       mobileNumber,
//     } = req.body;

//     const gym = await prisma.gym.findUnique({
//       where: { id: gymId },
//     });

//     if (!gym)
//       return res.status(404).json({ success: false, message: "Gym not found" });
//     if (userRole !== "admin" && gym.ownerId !== userId)
//       return res.status(403).json({ success: false, message: "Unauthorized" });

//     // Validate based on account type
//     if (accountType === "bank") {
//       if (!bankName || !accountTitle || !accountNumber) {
//         return res.status(400).json({
//           success: false,
//           message: "Bank name, account title, and account number are required",
//         });
//       }
//     } else if (
//       ["easypaisa", "jazzcash", "sadapay", "nayapay"].includes(accountType)
//     ) {
//       if (!mobileNumber || !/^03\d{9}$/.test(mobileNumber)) {
//         return res.status(400).json({
//           success: false,
//           message: "Valid Pakistani mobile number required (03XXXXXXXXX)",
//         });
//       }
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid account type" });
//     }

//     // Upsert payout account
//     const account = await prisma.gymPayoutAccount.upsert({
//       where: { gymId },
//       update: {
//         accountType,
//         bankName: accountType === "bank" ? bankName : null,
//         accountTitle: accountType === "bank" ? accountTitle : null,
//         accountNumber: accountType === "bank" ? accountNumber : null,
//         iban: accountType === "bank" ? iban : null,
//         walletProvider: accountType !== "bank" ? accountType : null,
//         mobileNumber: accountType !== "bank" ? mobileNumber : null,
//         isVerified: false, // Reset verification on change
//         verifiedAt: null,
//       },
//       create: {
//         gymId,
//         accountType,
//         bankName: accountType === "bank" ? bankName : null,
//         accountTitle: accountType === "bank" ? accountTitle : null,
//         accountNumber: accountType === "bank" ? accountNumber : null,
//         iban: accountType === "bank" ? iban : null,
//         walletProvider: accountType !== "bank" ? accountType : null,
//         mobileNumber: accountType !== "bank" ? mobileNumber : null,
//       },
//     });

//     return res.json({
//       success: true,
//       message: "Payout account updated successfully",
//       account,
//     });
//   } catch (err) {
//     console.error("updatePayoutAccount error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // ADMIN: VERIFY PAYOUT ACCOUNT
// ///////////////////////////////////////////////////////////////

// const verifyPayoutAccount = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Admin only" });
//     }

//     const { gymId } = req.params;

//     const account = await prisma.gymPayoutAccount.update({
//       where: { gymId },
//       data: {
//         isVerified: true,
//         verifiedAt: new Date(),
//       },
//     });

//     await prisma.adminAuditLog.create({
//       data: {
//         adminId: req.user.id,
//         action: "VERIFIED_PAYOUT_ACCOUNT",
//         entityType: "GymPayoutAccount",
//         entityId: account.id,
//         metadata: { gymId, accountType: account.accountType },
//       },
//     });

//     return res.json({
//       success: true,
//       message: "Payout account verified",
//       account,
//     });
//   } catch (err) {
//     console.error("verifyPayoutAccount error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// ///////////////////////////////////////////////////////////////
// // EXPORTS
// // fetchPayoutRate + resolveUserTierSlug used by checkInController
// ///////////////////////////////////////////////////////////////

// module.exports = {
//   fetchPayoutRate,
//   resolveUserTierSlug,

//   getGymPayoutSummary,
//   getUnpaidCheckIns,
//   processPayout,
//   getPayoutHistory,
//   getAllGymsPayoutOverview,
//   getPayoutRates,
//   updatePayoutRate,
//   getPayoutAuditLogs,
//   getPayoutAccount,
//   updatePayoutAccount,
//   verifyPayoutAccount,
// };
// controllers/payoutController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const transporter = require("../config/mailer");

///////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////

const fetchPayoutRate = async (memberTierSlug, gymTier) => {
  const rate = await prisma.payoutRate.findFirst({
    where: {
      memberTierSlug: memberTierSlug.toLowerCase(),
      gymTier,
      isActive: true,
    },
  });

  if (!rate) {
    throw new Error(
      `No active payout rate for member tier "${memberTierSlug}" × gym tier "${gymTier}". ` +
        `Run seed-payout-rates.js to populate the PayoutRate table.`,
    );
  }

  return rate;
};

const resolveUserTierSlug = async (userId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "active" },
    include: { tier: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return subscription?.tier?.slug ?? null;
};

const sumGymPayouts = (checkIns) =>
  checkIns.reduce((sum, ci) => sum + (ci.gymPayoutAmount ?? 0), 0);

///////////////////////////////////////////////////////////////
// VALIDATION HELPERS
///////////////////////////////////////////////////////////////

/**
 * Validate Pakistani IBAN format: PK + 2 check digits + 24 chars (total 26)
 */
const validateIBAN = (iban) => {
  if (!iban) return { valid: true }; // IBAN is optional
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  const ibanRegex = /^PK\d{2}[A-Z0-9]{4}\d{16}$/;
  if (!ibanRegex.test(cleaned)) {
    return {
      valid: false,
      message:
        "Invalid IBAN format. Must be PK followed by 24 characters (e.g., PK00ABCD1234567890123456)",
    };
  }
  return { valid: true, cleaned };
};

/**
 * Validate Pakistani mobile number: 03XXXXXXXXX (11 digits total)
 */
const validateMobileNumber = (number) => {
  const cleaned = number.replace(/\s/g, "").replace(/-/g, "");
  const mobileRegex = /^03\d{9}$/;
  if (!mobileRegex.test(cleaned)) {
    return {
      valid: false,
      message:
        "Invalid mobile number. Must be 11 digits starting with 03 (e.g., 03001234567)",
    };
  }
  return { valid: true, cleaned };
};

/**
 * Validate bank account number (minimum 8 digits)
 */
const validateAccountNumber = (number) => {
  const cleaned = number.replace(/\s/g, "").replace(/-/g, "");
  if (!/^\d{8,20}$/.test(cleaned)) {
    return {
      valid: false,
      message: "Invalid account number. Must be 8-20 digits",
    };
  }
  return { valid: true, cleaned };
};

/**
 * Validate account title (name on account)
 */
const validateAccountTitle = (title) => {
  if (!title || title.trim().length < 2) {
    return {
      valid: false,
      message: "Account title must be at least 2 characters",
    };
  }
  if (title.trim().length > 100) {
    return {
      valid: false,
      message: "Account title must not exceed 100 characters",
    };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(title.trim())) {
    return {
      valid: false,
      message:
        "Account title can only contain letters, spaces, periods, apostrophes, and hyphens",
    };
  }
  return { valid: true, cleaned: title.trim() };
};

///////////////////////////////////////////////////////////////
// GET PAYOUT SUMMARY FOR A GYM
///////////////////////////////////////////////////////////////

const getGymPayoutSummary = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: { owner: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const payoutRates = await prisma.payoutRate.findMany({
      where: {
        gymTier: gym.gymTier,
        isActive: true,
      },
    });

    const baseRate =
      payoutRates.length > 0
        ? Math.round(
            payoutRates.reduce((sum, r) => sum + r.gymGets, 0) /
              payoutRates.length,
          )
        : 0;

    const [unpaidCheckIns, paidCheckIns] = await Promise.all([
      prisma.checkIn.findMany({
        where: { gymId, isPaidToGym: false },
        select: { id: true, gymPayoutAmount: true },
      }),
      prisma.checkIn.findMany({
        where: { gymId, isPaidToGym: true },
        select: { id: true, gymPayoutAmount: true },
      }),
    ]);

    return res.json({
      success: true,
      summary: {
        gymId,
        gymName: gym.name,
        gymTier: gym.gymTier,
        payoutRate: baseRate,
        unpaid: {
          visits: unpaidCheckIns.length,
          amountPKR: sumGymPayouts(unpaidCheckIns),
        },
        paid: {
          visits: paidCheckIns.length,
          amountPKR: sumGymPayouts(paidCheckIns),
        },
        totalVisits: unpaidCheckIns.length + paidCheckIns.length,
      },
    });
  } catch (err) {
    console.error("getGymPayoutSummary error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// LIST UNPAID CHECK-INS FOR A GYM
///////////////////////////////////////////////////////////////

const getUnpaidCheckIns = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true, name: true, ownerId: true, gymTier: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const checkIns = await prisma.checkIn.findMany({
      where: { gymId, isPaidToGym: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            subscriptions: {
              where: { status: "active" },
              take: 1,
              orderBy: { createdAt: "desc" },
              include: { tier: { select: { slug: true, name: true } } },
            },
          },
        },
      },
      orderBy: { checkedInAt: "asc" },
    });

    const enriched = checkIns.map((ci) => ({
      id: ci.id,
      checkedInAt: ci.checkedInAt,
      gymPayoutAmount: ci.gymPayoutAmount,
      platformAmount: ci.platformAmount,
      memberTierSlug:
        ci.memberTierSlug ?? ci.user.subscriptions[0]?.tier?.slug ?? "unknown",
      memberTierName: ci.user.subscriptions[0]?.tier?.name ?? "Unknown",
      user: {
        id: ci.user.id,
        name: ci.user.name,
        email: ci.user.email,
      },
    }));

    return res.json({
      success: true,
      gymName: gym.name,
      gymTier: gym.gymTier,
      count: enriched.length,
      totalUnpaidPKR: sumGymPayouts(
        checkIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
      ),
      checkIns: enriched,
    });
  } catch (err) {
    console.error("getUnpaidCheckIns error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// PROCESS PAYOUT
///////////////////////////////////////////////////////////////

const processPayout = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin only",
      });
    }

    const { gymId } = req.params;
    const { checkInIds, payoutMethod, notes, transactionRef } = req.body;

    let screenshotUrl = null;
    let screenshotPublicId = null;

    if (req.screenshotUrl) {
      screenshotUrl = req.screenshotUrl;
      screenshotPublicId = req.screenshotPublicId || null;
    } else if (req.file?.path) {
      const fs = require("fs");
      if (fs.existsSync(req.file.path)) {
        screenshotUrl = req.file.path;
      }
    } else if (req.body.screenshotUrl?.startsWith("http")) {
      screenshotUrl = req.body.screenshotUrl;
    }

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const whereClause = {
      gymId,
      isPaidToGym: false,
      ...(checkInIds?.length ? { id: { in: checkInIds } } : {}),
    };

    const unpaidCheckIns = await prisma.checkIn.findMany({
      where: whereClause,
      select: {
        id: true,
        gymPayoutAmount: true,
        platformAmount: true,
        memberTierSlug: true,
        userId: true,
        checkedInAt: true,
      },
    });

    if (unpaidCheckIns.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No unpaid check-ins found — already processed or none pending",
        payout: null,
      });
    }

    const totalGymPKR = sumGymPayouts(unpaidCheckIns);
    const totalPlatformPKR = unpaidCheckIns.reduce(
      (sum, ci) => sum + (ci.platformAmount ?? 0),
      0,
    );

    await prisma.$transaction(
      unpaidCheckIns.map((ci) =>
        prisma.checkIn.update({
          where: { id: ci.id },
          data: { isPaidToGym: true },
        }),
      ),
    );

    if (gym.owner?.email) {
      const emailAttachments = [];
      const fs = require("fs");
      const path = require("path");

      if (screenshotUrl) {
        if (fs.existsSync(screenshotUrl)) {
          emailAttachments.push({
            filename: path.basename(screenshotUrl),
            path: screenshotUrl,
            contentType: "image/png",
          });
        } else if (screenshotUrl.startsWith("http")) {
          emailAttachments.push({
            filename: "transaction-screenshot.png",
            path: screenshotUrl,
          });
        }
      }

      const checkInDetails = unpaidCheckIns
        .map(
          (ci, idx) => `
            <tr>
              <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
              <td style="padding:8px;border:1px solid #ddd;">${new Date(
                ci.checkedInAt,
              ).toLocaleDateString("en-PK")}</td>
              <td style="padding:8px;border:1px solid #ddd;">PKR ${
                ci.gymPayoutAmount
              }</td>
              <td style="padding:8px;border:1px solid #ddd;">${
                ci.memberTierSlug
              }</td>
            </tr>
          `,
        )
        .join("");

      const screenshotHtml = screenshotUrl
        ? `
            <div style="margin:20px 0;">
              <p style="color:#1B5E20;font-weight:bold;font-size:13px;margin-bottom:10px;">📎 Transaction Screenshot:</p>
              <img src="${screenshotUrl}" style="max-width:100%;border-radius:8px;border:1px solid #ddd;" alt="Payment Proof" />
              <p style="color:#388E3C;font-size:11px;margin-top:5px;">Proof of payment uploaded by admin</p>
            </div>
          `
        : `
            <div style="background:#FFF3E0;border-left:4px solid #FF9800;padding:12px;margin:15px 0;border-radius:0 8px 8px 0;">
              <p style="color:#E65100;margin:0;font-size:12px;">⚠️ No transaction screenshot attached. Contact admin if needed.</p>
            </div>
          `;

      await transporter.sendMail({
        from: `"GymKey Payouts" <${process.env.SMTP_FROM}>`,
        to: gym.owner.email,
        cc: process.env.ADMIN_EMAIL || "admin@gymkey.pk",
        subject: `💰 Payout Processed — ${gym.name} — PKR ${totalGymPKR.toLocaleString()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#5B3A29,#8B5E46);padding:30px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:24px;">💰 Payout Processed</h1>
              <p style="color:#F5D0A9;margin:8px 0 0 0;font-size:14px;">${gym.name}</p>
            </div>
            <div style="background:#FAF7F4;padding:30px;border:1px solid #E7DDD3;border-top:none;">
              <p style="color:#2B160B;font-size:16px;">Hello <strong>${gym.owner.name}</strong>,</p>
              <p style="color:#5B4A40;line-height:1.6;">Your gym payout has been processed by the GymKey admin team.</p>
              <div style="background:white;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #E7DDD3;">
                <h3 style="color:#2B160B;margin:0 0 15px 0;font-size:18px;">📊 Payout Summary</h3>
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8E1;">
                  <span style="color:#7A6A5D;">Check-ins Paid</span>
                  <span style="color:#2B160B;font-weight:bold;">${unpaidCheckIns.length}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8E1;">
                  <span style="color:#7A6A5D;">Total Amount</span>
                  <span style="color:#1B5E4A;font-weight:bold;font-size:18px;">PKR ${totalGymPKR.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:10px 0;">
                  <span style="color:#7A6A5D;">Payout Method</span>
                  <span style="color:#2B160B;font-weight:bold;text-transform:uppercase;">${payoutMethod || "Manual Transfer"}</span>
                </div>
                ${
                  transactionRef
                    ? `
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #F0E8E1;">
                  <span style="color:#7A6A5D;">Transaction Ref</span>
                  <span style="color:#2B160B;font-family:monospace;">${transactionRef}</span>
                </div>`
                    : ""
                }
              </div>
              <h4 style="color:#2B160B;margin:25px 0 10px 0;">📋 Check-in Details</h4>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                  <tr style="background:#F5EFE8;">
                    <th style="padding:10px;border:1px solid #ddd;text-align:left;">#</th>
                    <th style="padding:10px;border:1px solid #ddd;text-align:left;">Date</th>
                    <th style="padding:10px;border:1px solid #ddd;text-align:left;">Amount</th>
                    <th style="padding:10px;border:1px solid #ddd;text-align:left;">Member Tier</th>
                  </tr>
                </thead>
                <tbody>${checkInDetails}</tbody>
              </table>
              ${screenshotHtml}
              ${
                notes
                  ? `
              <div style="background:#FFF8E7;border-left:4px solid #D1A77C;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;">
                <p style="color:#7A3D16;margin:0;font-weight:bold;font-size:13px;">📝 Admin Notes:</p>
                <p style="color:#5B4A40;margin:8px 0 0 0;font-style:italic;">${notes}</p>
              </div>`
                  : ""
              }
              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #E7DDD3;text-align:center;">
                <p style="color:#8D7E73;font-size:12px;">
                  Processed on ${new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                  <br>by GymKey Admin Team
                </p>
                <p style="color:#5B3A29;font-size:11px;margin-top:15px;">Questions? Reply to this email or contact support@gymkey.pk</p>
              </div>
            </div>
          </div>
        `,
        attachments: emailAttachments,
      });

      console.log(`📧 Payout email sent to ${gym.owner.email}`);
    }

    try {
      const adminId = req.user.id || req.user.userId || req.user._id;
      if (adminId) {
        await prisma.adminAuditLog.create({
          data: {
            adminId: adminId,
            action: "PROCESSED_PAYOUT",
            entityType: "Gym",
            entityId: gymId,
            metadata: {
              checkInsPaid: unpaidCheckIns.length,
              totalGymPKR,
              totalPlatformPKR,
              payoutMethod: payoutMethod || "manual",
              notes: notes || null,
              transactionRef: transactionRef || null,
              screenshotUrl: screenshotUrl || null,
              screenshotPublicId: screenshotPublicId || null,
              gymName: gym.name,
              ownerId: gym.ownerId,
              ownerEmail: gym.owner?.email || null,
              emailSent: !!gym.owner?.email,
            },
          },
        });
        console.log("✅ Audit log created");
      }
    } catch (auditErr) {
      console.error("⚠️ Audit log failed (non-critical):", auditErr.message);
    }

    return res.json({
      success: true,
      message: `Payout processed for ${unpaidCheckIns.length} check-ins`,
      payout: {
        gymId,
        gymName: gym.name,
        checkInsPaid: unpaidCheckIns.length,
        totalGymPKR,
        totalPlatformPKR,
        payoutMethod: payoutMethod || "manual",
        processedAt: new Date().toISOString(),
        notes: notes || null,
        transactionRef: transactionRef || null,
        screenshotUrl: screenshotUrl || null,
        screenshotPublicId: screenshotPublicId || null,
        emailSent: !!gym.owner?.email,
      },
    });
  } catch (err) {
    console.error("processPayout error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

///////////////////////////////////////////////////////////////
// GET PAYOUT HISTORY FOR A GYM
///////////////////////////////////////////////////////////////

const getPayoutHistory = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true, name: true, ownerId: true, gymTier: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const paidCheckIns = await prisma.checkIn.findMany({
      where: { gymId, isPaidToGym: true },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { checkedInAt: "desc" },
    });

    const monthlySummary = {};
    paidCheckIns.forEach((ci) => {
      const month = ci.checkedInAt.toISOString().slice(0, 7);
      if (!monthlySummary[month])
        monthlySummary[month] = {
          visits: 0,
          gymAmountPKR: 0,
          platformAmountPKR: 0,
        };

      monthlySummary[month].visits += 1;
      monthlySummary[month].gymAmountPKR += ci.gymPayoutAmount ?? 0;
      monthlySummary[month].platformAmountPKR += ci.platformAmount ?? 0;
    });

    return res.json({
      success: true,
      gymId,
      gymName: gym.name,
      gymTier: gym.gymTier,
      totalPaidCheckIns: paidCheckIns.length,
      totalPaidAmountPKR: sumGymPayouts(
        paidCheckIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
      ),
      monthlyBreakdown: monthlySummary,
      checkIns: paidCheckIns.map((ci) => ({
        id: ci.id,
        user: ci.user,
        checkedInAt: ci.checkedInAt,
        memberTierSlug: ci.memberTierSlug,
        gymPayoutAmount: ci.gymPayoutAmount,
        platformAmount: ci.platformAmount,
      })),
    });
  } catch (err) {
    console.error("getPayoutHistory error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: ALL GYMS PAYOUT OVERVIEW
///////////////////////////////////////////////////////////////

const getAllGymsPayoutOverview = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const gyms = await prisma.gym.findMany({
      where: { isArchived: false },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        payoutAccount: true, // Include payout account in overview
      },
      orderBy: { createdAt: "desc" },
    });

    const overview = await Promise.all(
      gyms.map(async (gym) => {
        const [unpaid, paid] = await Promise.all([
          prisma.checkIn.aggregate({
            where: { gymId: gym.id, isPaidToGym: false },
            _count: { id: true },
            _sum: { gymPayoutAmount: true, platformAmount: true },
          }),
          prisma.checkIn.aggregate({
            where: { gymId: gym.id, isPaidToGym: true },
            _count: { id: true },
            _sum: { gymPayoutAmount: true, platformAmount: true },
          }),
        ]);

        return {
          gymId: gym.id,
          gymName: gym.name,
          gymTier: gym.gymTier,
          owner: gym.owner,
          status: gym.status,
          isBlocked: gym.isBlocked,
          hasPayoutAccount: !!gym.payoutAccount,
          payoutAccountType: gym.payoutAccount?.accountType || null,
          payoutAccountVerified: gym.payoutAccount?.isVerified || false,
          unpaidVisits: unpaid._count.id,
          unpaidAmountPKR: unpaid._sum.gymPayoutAmount ?? 0,
          unpaidPlatformAmountPKR: unpaid._sum.platformAmount ?? 0,
          paidVisits: paid._count.id,
          paidAmountPKR: paid._sum.gymPayoutAmount ?? 0,
          paidPlatformAmountPKR: paid._sum.platformAmount ?? 0,
          totalVisits: unpaid._count.id + paid._count.id,
          totalGymPayoutPKR:
            (unpaid._sum.gymPayoutAmount ?? 0) +
            (paid._sum.gymPayoutAmount ?? 0),
          totalPlatformEarningsPKR:
            (unpaid._sum.platformAmount ?? 0) + (paid._sum.platformAmount ?? 0),
        };
      }),
    );

    const totalUnpaidPKR = overview.reduce(
      (sum, g) => sum + g.unpaidAmountPKR,
      0,
    );
    const totalPaidPKR = overview.reduce((sum, g) => sum + g.paidAmountPKR, 0);
    const totalUnpaidPlatformPKR = overview.reduce(
      (sum, g) => sum + g.unpaidPlatformAmountPKR,
      0,
    );
    const totalPaidPlatformPKR = overview.reduce(
      (sum, g) => sum + g.paidPlatformAmountPKR,
      0,
    );
    const totalPlatformEarningsPKR =
      totalUnpaidPlatformPKR + totalPaidPlatformPKR;

    return res.json({
      success: true,
      summary: {
        totalGyms: overview.length,
        totalUnpaidPKR,
        totalPaidPKR,
        totalUnpaidPlatformPKR,
        totalPaidPlatformPKR,
        totalPlatformEarningsPKR,
        netPayablePKR: totalUnpaidPKR,
      },
      gyms: overview,
    });
  } catch (err) {
    console.error("getAllGymsPayoutOverview error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: LIST ALL PAYOUT RATES FROM DB
///////////////////////////////////////////////////////////////

const getPayoutRates = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const rates = await prisma.payoutRate.findMany({
      orderBy: [{ memberTierSlug: "asc" }, { gymTier: "asc" }],
    });

    return res.json({ success: true, count: rates.length, rates });
  } catch (err) {
    console.error("getPayoutRates error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: UPDATE A PAYOUT RATE ROW
///////////////////////////////////////////////////////////////

const updatePayoutRate = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const { memberTierSlug, gymTier, gymGets, platformKeeps, multiplier } =
      req.body;

    if (!memberTierSlug || !gymTier || gymGets == null || platformKeeps == null)
      return res.status(400).json({
        success: false,
        message:
          "memberTierSlug, gymTier, gymGets, and platformKeeps are required",
      });

    const rate = await prisma.payoutRate.upsert({
      where: {
        memberTierSlug_gymTier: { memberTierSlug, gymTier },
      },
      update: {
        gymGets: parseInt(gymGets),
        platformKeeps: parseInt(platformKeeps),
        ...(multiplier != null ? { multiplier: parseFloat(multiplier) } : {}),
      },
      create: {
        memberTierSlug,
        gymTier,
        gymGets: parseInt(gymGets),
        platformKeeps: parseInt(platformKeeps),
        multiplier: multiplier ? parseFloat(multiplier) : 1.0,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "UPDATED_PAYOUT_RATE",
        entityType: "PayoutRate",
        entityId: rate.id,
        metadata: {
          memberTierSlug,
          gymTier,
          gymGets: rate.gymGets,
          platformKeeps: rate.platformKeeps,
          multiplier: rate.multiplier,
        },
      },
    });

    return res.json({ success: true, message: "Payout rate updated", rate });
  } catch (err) {
    console.error("updatePayoutRate error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: GET PAYOUT AUDIT LOGS
///////////////////////////////////////////////////////////////

const getPayoutAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const { gymId } = req.query;
    const where = { action: "PROCESSED_PAYOUT" };
    if (gymId) where.entityId = gymId;

    const logs = await prisma.adminAuditLog.findMany({
      where,
      include: { admin: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.json({
      success: true,
      count: logs.length,
      logs: logs.map((log) => ({
        id: log.id,
        admin: log.admin,
        action: log.action,
        gymId: log.entityId,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    });
  } catch (err) {
    console.error("getPayoutAuditLogs error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// OWNER: GET/UPDATE PAYOUT ACCOUNT — WITH VALIDATION
///////////////////////////////////////////////////////////////

const getPayoutAccount = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: { payoutAccount: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    return res.json({
      success: true,
      account: gym.payoutAccount || null,
    });
  } catch (err) {
    console.error("getPayoutAccount error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updatePayoutAccount = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;
    const {
      accountType,
      bankName,
      accountTitle,
      accountNumber,
      iban,
      walletProvider,
      mobileNumber,
      accountHolderName, // NEW: For wallet accounts
    } = req.body;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    // ─── VALIDATION ──────────────────────────────────────────────────────
    const errors = [];

    // Validate account type
    const validTypes = ["bank", "easypaisa", "jazzcash", "sadapay", "nayapay"];
    if (!validTypes.includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid account type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Validate account holder name (required for ALL account types)
    const titleValidation = validateAccountTitle(
      accountType === "bank" ? accountTitle : accountHolderName,
    );
    if (!titleValidation.valid) {
      errors.push(titleValidation.message);
    }

    if (accountType === "bank") {
      // Bank validations
      if (!bankName || bankName.trim().length < 2) {
        errors.push("Bank name is required and must be at least 2 characters");
      }
      if (!accountNumber) {
        errors.push("Account number is required");
      } else {
        const accValidation = validateAccountNumber(accountNumber);
        if (!accValidation.valid) {
          errors.push(accValidation.message);
        }
      }
      if (iban) {
        const ibanValidation = validateIBAN(iban);
        if (!ibanValidation.valid) {
          errors.push(ibanValidation.message);
        }
      }
    } else {
      // Wallet validations
      if (!mobileNumber) {
        errors.push("Mobile number is required for wallet accounts");
      } else {
        const mobileValidation = validateMobileNumber(mobileNumber);
        if (!mobileValidation.valid) {
          errors.push(mobileValidation.message);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Clean values
    const cleanedMobile = mobileNumber
      ? mobileNumber.replace(/\s/g, "").replace(/-/g, "")
      : null;
    const cleanedIBAN = iban ? iban.replace(/\s/g, "").toUpperCase() : null;
    const cleanedAccountNumber = accountNumber
      ? accountNumber.replace(/\s/g, "").replace(/-/g, "")
      : null;
    const cleanedTitle =
      accountType === "bank" ? accountTitle.trim() : accountHolderName.trim();

    // Upsert payout account
    const account = await prisma.gymPayoutAccount.upsert({
      where: { gymId },
      update: {
        accountType,
        bankName: accountType === "bank" ? bankName.trim() : null,
        accountTitle: cleanedTitle,
        accountNumber: accountType === "bank" ? cleanedAccountNumber : null,
        iban: accountType === "bank" ? cleanedIBAN : null,
        walletProvider: accountType !== "bank" ? accountType : null,
        mobileNumber: accountType !== "bank" ? cleanedMobile : null,
        isVerified: false, // Reset verification on change
        verifiedAt: null,
      },
      create: {
        gymId,
        accountType,
        bankName: accountType === "bank" ? bankName.trim() : null,
        accountTitle: cleanedTitle,
        accountNumber: accountType === "bank" ? cleanedAccountNumber : null,
        iban: accountType === "bank" ? cleanedIBAN : null,
        walletProvider: accountType !== "bank" ? accountType : null,
        mobileNumber: accountType !== "bank" ? cleanedMobile : null,
      },
    });

    return res.json({
      success: true,
      message: "Payout account updated successfully",
      account,
    });
  } catch (err) {
    console.error("updatePayoutAccount error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: VERIFY PAYOUT ACCOUNT
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
// ADMIN: VERIFY PAYOUT ACCOUNT
///////////////////////////////////////////////////////////////

const verifyPayoutAccount = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    const { gymId } = req.params;
    const adminId = req.user.id || req.user.userId || req.user._id;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID not found in token",
      });
    }

    // Verify the account
    const account = await prisma.gymPayoutAccount.update({
      where: { gymId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    // Try to create audit log, but don't fail if it can't
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: adminId,
          action: "VERIFIED_PAYOUT_ACCOUNT",
          entityType: "GymPayoutAccount",
          entityId: account.id,
          metadata: { gymId, accountType: account.accountType },
        },
      });
      console.log("✅ Audit log created for verification");
    } catch (auditErr) {
      console.error("⚠️ Audit log failed (non-critical):", auditErr.message);
      // Don't return error — verification still succeeded
    }

    return res.json({
      success: true,
      message: "Payout account verified",
      account,
    });
  } catch (err) {
    console.error("verifyPayoutAccount error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
///////////////////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////////////////

module.exports = {
  fetchPayoutRate,
  resolveUserTierSlug,

  getGymPayoutSummary,
  getUnpaidCheckIns,
  processPayout,
  getPayoutHistory,
  getAllGymsPayoutOverview,
  getPayoutRates,
  updatePayoutRate,
  getPayoutAuditLogs,
  getPayoutAccount,
  updatePayoutAccount,
  verifyPayoutAccount,
};
