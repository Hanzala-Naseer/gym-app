-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "blockedReason" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "cnicNumber" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "googleMapsLink" TEXT,
ADD COLUMN     "instagramHandle" TEXT,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "resubmissionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "whatsappNumber" TEXT,
ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "GymVerificationDocument" ADD COLUMN     "rejectedReason" TEXT;
