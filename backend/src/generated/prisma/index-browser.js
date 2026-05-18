
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  isSuspended: 'isSuspended',
  suspendedAt: 'suspendedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  otpHash: 'otpHash',
  otpExpiresAt: 'otpExpiresAt',
  otpAttempts: 'otpAttempts'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  email: 'email',
  tokenHash: 'tokenHash',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.SubscriptionTierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  accessTier: 'accessTier',
  gymTierAccess: 'gymTierAccess',
  monthlyVisitLimit: 'monthlyVisitLimit',
  isUnlimited: 'isUnlimited',
  perks: 'perks',
  isActive: 'isActive',
  isFeatured: 'isFeatured',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionPriceScalarFieldEnum = {
  id: 'id',
  tierId: 'tierId',
  stripeProductId: 'stripeProductId',
  stripePriceId: 'stripePriceId',
  interval: 'interval',
  priceCents: 'priceCents',
  currency: 'currency',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tierId: 'tierId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  stripePriceId: 'stripePriceId',
  status: 'status',
  remainingVisits: 'remainingVisits',
  startAt: 'startAt',
  endAt: 'endAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subscriptionId: 'subscriptionId',
  amountCents: 'amountCents',
  currency: 'currency',
  paymentProvider: 'paymentProvider',
  stripePaymentIntent: 'stripePaymentIntent',
  status: 'status',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.GymScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  addressLine: 'addressLine',
  city: 'city',
  province: 'province',
  postalCode: 'postalCode',
  latitude: 'latitude',
  longitude: 'longitude',
  phoneNumber: 'phoneNumber',
  whatsappNumber: 'whatsappNumber',
  instagramHandle: 'instagramHandle',
  websiteUrl: 'websiteUrl',
  googleMapsLink: 'googleMapsLink',
  cnicNumber: 'cnicNumber',
  businessName: 'businessName',
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  is24Hours: 'is24Hours',
  tier: 'tier',
  gymTier: 'gymTier',
  payoutPerVisit: 'payoutPerVisit',
  coverImageUrl: 'coverImageUrl',
  status: 'status',
  submittedAt: 'submittedAt',
  reviewedAt: 'reviewedAt',
  reviewedByAdminId: 'reviewedByAdminId',
  rejectionReason: 'rejectionReason',
  approvalNotes: 'approvalNotes',
  resubmissionCount: 'resubmissionCount',
  isFeatured: 'isFeatured',
  isArchived: 'isArchived',
  isBlocked: 'isBlocked',
  blockedReason: 'blockedReason',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GymVerificationDocumentScalarFieldEnum = {
  id: 'id',
  gymId: 'gymId',
  type: 'type',
  fileUrl: 'fileUrl',
  status: 'status',
  rejectedReason: 'rejectedReason',
  reviewedAt: 'reviewedAt',
  reviewNotes: 'reviewNotes',
  createdAt: 'createdAt'
};

exports.Prisma.GymPhotoScalarFieldEnum = {
  id: 'id',
  gymId: 'gymId',
  url: 'url',
  createdAt: 'createdAt'
};

exports.Prisma.CheckInScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  gymId: 'gymId',
  checkedInAt: 'checkedInAt',
  payoutAmount: 'payoutAmount',
  isPaidToGym: 'isPaidToGym',
  qrJti: 'qrJti',
  gymPayoutAmount: 'gymPayoutAmount',
  platformAmount: 'platformAmount',
  memberTierSlug: 'memberTierSlug',
  createdAt: 'createdAt'
};

exports.Prisma.QrJtiUsageScalarFieldEnum = {
  id: 'id',
  jti: 'jti',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.AdminAuditLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AdminNotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  type: 'type',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.PayoutRateScalarFieldEnum = {
  id: 'id',
  memberTierSlug: 'memberTierSlug',
  gymTier: 'gymTier',
  gymGets: 'gymGets',
  platformKeeps: 'platformKeeps',
  multiplier: 'multiplier',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.GymTier = {
  BASIC: 'BASIC',
  ULTIMATE: 'ULTIMATE',
  ELITE: 'ELITE'
};

exports.Prisma.ModelName = {
  User: 'User',
  PasswordResetToken: 'PasswordResetToken',
  SubscriptionTier: 'SubscriptionTier',
  SubscriptionPrice: 'SubscriptionPrice',
  Subscription: 'Subscription',
  Payment: 'Payment',
  Gym: 'Gym',
  GymVerificationDocument: 'GymVerificationDocument',
  GymPhoto: 'GymPhoto',
  CheckIn: 'CheckIn',
  QrJtiUsage: 'QrJtiUsage',
  AdminAuditLog: 'AdminAuditLog',
  AdminNotification: 'AdminNotification',
  PayoutRate: 'PayoutRate'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
