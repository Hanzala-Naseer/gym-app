
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type UserPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "User"
  objects: {
    subscriptions: SubscriptionPayload<ExtArgs>[]
    payments: PaymentPayload<ExtArgs>[]
    checkIns: CheckInPayload<ExtArgs>[]
    gymsOwned: GymPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    createdAt: Date
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
  }, ExtArgs["result"]["user"]>
  composites: {}
}

/**
 * Model User
 * 
 */
export type User = runtime.Types.DefaultSelection<UserPayload>
export type SubscriptionTierPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "SubscriptionTier"
  objects: {
    prices: SubscriptionPricePayload<ExtArgs>[]
    subscriptions: SubscriptionPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    accessTier: number
    createdAt: Date
  }, ExtArgs["result"]["subscriptionTier"]>
  composites: {}
}

/**
 * Model SubscriptionTier
 * 
 */
export type SubscriptionTier = runtime.Types.DefaultSelection<SubscriptionTierPayload>
export type SubscriptionPricePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "SubscriptionPrice"
  objects: {
    tier: SubscriptionTierPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    tierId: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt: Date
  }, ExtArgs["result"]["subscriptionPrice"]>
  composites: {}
}

/**
 * Model SubscriptionPrice
 * 
 */
export type SubscriptionPrice = runtime.Types.DefaultSelection<SubscriptionPricePayload>
export type SubscriptionPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Subscription"
  objects: {
    user: UserPayload<ExtArgs>
    tier: SubscriptionTierPayload<ExtArgs>
    payments: PaymentPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    userId: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt: Date | null
    endAt: Date | null
    createdAt: Date
  }, ExtArgs["result"]["subscription"]>
  composites: {}
}

/**
 * Model Subscription
 * 
 */
export type Subscription = runtime.Types.DefaultSelection<SubscriptionPayload>
export type PaymentPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Payment"
  objects: {
    user: UserPayload<ExtArgs>
    subscription: SubscriptionPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    userId: string
    subscriptionId: string | null
    amountCents: number
    currency: string
    stripePaymentIntent: string | null
    status: string
    metadata: Prisma.JsonValue | null
    createdAt: Date
  }, ExtArgs["result"]["payment"]>
  composites: {}
}

/**
 * Model Payment
 * 
 */
export type Payment = runtime.Types.DefaultSelection<PaymentPayload>
export type GymPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Gym"
  objects: {
    owner: UserPayload<ExtArgs> | null
    checkIns: CheckInPayload<ExtArgs>[]
    photos: GymPhotoPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime: string | null
    closingTime: string | null
    is24Hours: boolean
    tier: number
    coverImageUrl: string | null
    status: string
    ownerId: string | null
    createdAt: Date
  }, ExtArgs["result"]["gym"]>
  composites: {}
}

/**
 * Model Gym
 * 
 */
export type Gym = runtime.Types.DefaultSelection<GymPayload>
export type GymPhotoPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "GymPhoto"
  objects: {
    gym: GymPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    gymId: string
    url: string
    createdAt: Date
  }, ExtArgs["result"]["gymPhoto"]>
  composites: {}
}

/**
 * Model GymPhoto
 * 
 */
export type GymPhoto = runtime.Types.DefaultSelection<GymPhotoPayload>
export type CheckInPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "CheckIn"
  objects: {
    user: UserPayload<ExtArgs>
    gym: GymPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    userId: string
    gymId: string
    checkedInAt: Date
    qrJti: string | null
    createdAt: Date
  }, ExtArgs["result"]["checkIn"]>
  composites: {}
}

/**
 * Model CheckIn
 * 
 */
export type CheckIn = runtime.Types.DefaultSelection<CheckInPayload>
export type QrJtiUsagePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "QrJtiUsage"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    jti: string
    createdAt: Date
    expiresAt: Date
  }, ExtArgs["result"]["qrJtiUsage"]>
  composites: {}
}

/**
 * Model QrJtiUsage
 * 
 */
export type QrJtiUsage = runtime.Types.DefaultSelection<QrJtiUsagePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.subscriptionTier`: Exposes CRUD operations for the **SubscriptionTier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionTiers
    * const subscriptionTiers = await prisma.subscriptionTier.findMany()
    * ```
    */
  get subscriptionTier(): Prisma.SubscriptionTierDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.subscriptionPrice`: Exposes CRUD operations for the **SubscriptionPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPrices
    * const subscriptionPrices = await prisma.subscriptionPrice.findMany()
    * ```
    */
  get subscriptionPrice(): Prisma.SubscriptionPriceDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.gym`: Exposes CRUD operations for the **Gym** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gyms
    * const gyms = await prisma.gym.findMany()
    * ```
    */
  get gym(): Prisma.GymDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.gymPhoto`: Exposes CRUD operations for the **GymPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GymPhotos
    * const gymPhotos = await prisma.gymPhoto.findMany()
    * ```
    */
  get gymPhoto(): Prisma.GymPhotoDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.checkIn`: Exposes CRUD operations for the **CheckIn** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CheckIns
    * const checkIns = await prisma.checkIn.findMany()
    * ```
    */
  get checkIn(): Prisma.CheckInDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.qrJtiUsage`: Exposes CRUD operations for the **QrJtiUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QrJtiUsages
    * const qrJtiUsages = await prisma.qrJtiUsage.findMany()
    * ```
    */
  get qrJtiUsage(): Prisma.QrJtiUsageDelegate<GlobalReject, ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    SubscriptionTier: 'SubscriptionTier',
    SubscriptionPrice: 'SubscriptionPrice',
    Subscription: 'Subscription',
    Payment: 'Payment',
    Gym: 'Gym',
    GymPhoto: 'GymPhoto',
    CheckIn: 'CheckIn',
    QrJtiUsage: 'QrJtiUsage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'user' | 'subscriptionTier' | 'subscriptionPrice' | 'subscription' | 'payment' | 'gym' | 'gymPhoto' | 'checkIn' | 'qrJtiUsage'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      User: {
        payload: UserPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionTier: {
        payload: SubscriptionTierPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.SubscriptionTierFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionTierFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionTierFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionTierFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          findMany: {
            args: Prisma.SubscriptionTierFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>[]
          }
          create: {
            args: Prisma.SubscriptionTierCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          createMany: {
            args: Prisma.SubscriptionTierCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.SubscriptionTierDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          update: {
            args: Prisma.SubscriptionTierUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionTierDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionTierUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionTierUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionTierPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionTierAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubscriptionTier>
          }
          groupBy: {
            args: Prisma.SubscriptionTierGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionTierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionTierCountArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionTierCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionPrice: {
        payload: SubscriptionPricePayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPriceFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPriceFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPriceFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPriceFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          findMany: {
            args: Prisma.SubscriptionPriceFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>[]
          }
          create: {
            args: Prisma.SubscriptionPriceCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          createMany: {
            args: Prisma.SubscriptionPriceCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.SubscriptionPriceDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          update: {
            args: Prisma.SubscriptionPriceUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPriceDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPriceUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionPriceUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPricePayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPriceAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubscriptionPrice>
          }
          groupBy: {
            args: Prisma.SubscriptionPriceGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPriceCountArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionPriceCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: SubscriptionPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>,
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: PaymentPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>,
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Gym: {
        payload: GymPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.GymFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GymFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          findFirst: {
            args: Prisma.GymFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GymFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          findMany: {
            args: Prisma.GymFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>[]
          }
          create: {
            args: Prisma.GymCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          createMany: {
            args: Prisma.GymCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.GymDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          update: {
            args: Prisma.GymUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          deleteMany: {
            args: Prisma.GymDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.GymUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.GymUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPayload>
          }
          aggregate: {
            args: Prisma.GymAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGym>
          }
          groupBy: {
            args: Prisma.GymGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GymGroupByOutputType>[]
          }
          count: {
            args: Prisma.GymCountArgs<ExtArgs>,
            result: $Utils.Optional<GymCountAggregateOutputType> | number
          }
        }
      }
      GymPhoto: {
        payload: GymPhotoPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.GymPhotoFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GymPhotoFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          findFirst: {
            args: Prisma.GymPhotoFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GymPhotoFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          findMany: {
            args: Prisma.GymPhotoFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>[]
          }
          create: {
            args: Prisma.GymPhotoCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          createMany: {
            args: Prisma.GymPhotoCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.GymPhotoDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          update: {
            args: Prisma.GymPhotoUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          deleteMany: {
            args: Prisma.GymPhotoDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.GymPhotoUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.GymPhotoUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<GymPhotoPayload>
          }
          aggregate: {
            args: Prisma.GymPhotoAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateGymPhoto>
          }
          groupBy: {
            args: Prisma.GymPhotoGroupByArgs<ExtArgs>,
            result: $Utils.Optional<GymPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.GymPhotoCountArgs<ExtArgs>,
            result: $Utils.Optional<GymPhotoCountAggregateOutputType> | number
          }
        }
      }
      CheckIn: {
        payload: CheckInPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.CheckInFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CheckInFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          findFirst: {
            args: Prisma.CheckInFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CheckInFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          findMany: {
            args: Prisma.CheckInFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>[]
          }
          create: {
            args: Prisma.CheckInCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          createMany: {
            args: Prisma.CheckInCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.CheckInDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          update: {
            args: Prisma.CheckInUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          deleteMany: {
            args: Prisma.CheckInDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CheckInUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CheckInUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CheckInPayload>
          }
          aggregate: {
            args: Prisma.CheckInAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCheckIn>
          }
          groupBy: {
            args: Prisma.CheckInGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CheckInGroupByOutputType>[]
          }
          count: {
            args: Prisma.CheckInCountArgs<ExtArgs>,
            result: $Utils.Optional<CheckInCountAggregateOutputType> | number
          }
        }
      }
      QrJtiUsage: {
        payload: QrJtiUsagePayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.QrJtiUsageFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QrJtiUsageFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          findFirst: {
            args: Prisma.QrJtiUsageFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QrJtiUsageFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          findMany: {
            args: Prisma.QrJtiUsageFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>[]
          }
          create: {
            args: Prisma.QrJtiUsageCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          createMany: {
            args: Prisma.QrJtiUsageCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.QrJtiUsageDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          update: {
            args: Prisma.QrJtiUsageUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          deleteMany: {
            args: Prisma.QrJtiUsageDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.QrJtiUsageUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.QrJtiUsageUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<QrJtiUsagePayload>
          }
          aggregate: {
            args: Prisma.QrJtiUsageAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateQrJtiUsage>
          }
          groupBy: {
            args: Prisma.QrJtiUsageGroupByArgs<ExtArgs>,
            result: $Utils.Optional<QrJtiUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.QrJtiUsageCountArgs<ExtArgs>,
            result: $Utils.Optional<QrJtiUsageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */


  export type UserCountOutputType = {
    subscriptions: number
    payments: number
    checkIns: number
    gymsOwned: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | UserCountOutputTypeCountSubscriptionsArgs
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs
    checkIns?: boolean | UserCountOutputTypeCountCheckInsArgs
    gymsOwned?: boolean | UserCountOutputTypeCountGymsOwnedArgs
  }

  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCheckInsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CheckInWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGymsOwnedArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: GymWhereInput
  }



  /**
   * Count Type SubscriptionTierCountOutputType
   */


  export type SubscriptionTierCountOutputType = {
    prices: number
    subscriptions: number
  }

  export type SubscriptionTierCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    prices?: boolean | SubscriptionTierCountOutputTypeCountPricesArgs
    subscriptions?: boolean | SubscriptionTierCountOutputTypeCountSubscriptionsArgs
  }

  // Custom InputTypes

  /**
   * SubscriptionTierCountOutputType without action
   */
  export type SubscriptionTierCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTierCountOutputType
     */
    select?: SubscriptionTierCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SubscriptionTierCountOutputType without action
   */
  export type SubscriptionTierCountOutputTypeCountPricesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionPriceWhereInput
  }


  /**
   * SubscriptionTierCountOutputType without action
   */
  export type SubscriptionTierCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }



  /**
   * Count Type SubscriptionCountOutputType
   */


  export type SubscriptionCountOutputType = {
    payments: number
  }

  export type SubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    payments?: boolean | SubscriptionCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes

  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionCountOutputType
     */
    select?: SubscriptionCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }



  /**
   * Count Type GymCountOutputType
   */


  export type GymCountOutputType = {
    checkIns: number
    photos: number
  }

  export type GymCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    checkIns?: boolean | GymCountOutputTypeCountCheckInsArgs
    photos?: boolean | GymCountOutputTypeCountPhotosArgs
  }

  // Custom InputTypes

  /**
   * GymCountOutputType without action
   */
  export type GymCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymCountOutputType
     */
    select?: GymCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * GymCountOutputType without action
   */
  export type GymCountOutputTypeCountCheckInsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CheckInWhereInput
  }


  /**
   * GymCountOutputType without action
   */
  export type GymCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: GymPhotoWhereInput
  }



  /**
   * Models
   */

  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    otpAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    otpAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    createdAt: Date | null
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    createdAt: Date | null
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    createdAt: number
    otpHash: number
    otpExpiresAt: number
    otpAttempts: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    otpAttempts?: true
  }

  export type UserSumAggregateInputType = {
    otpAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    otpHash?: true
    otpExpiresAt?: true
    otpAttempts?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: UserScalarFieldEnum[]
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    createdAt: Date
    otpHash: string | null
    otpExpiresAt: Date | null
    otpAttempts: number | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    checkIns?: boolean | User$checkInsArgs<ExtArgs>
    gymsOwned?: boolean | User$gymsOwnedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    otpHash?: boolean
    otpExpiresAt?: boolean
    otpAttempts?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    checkIns?: boolean | User$checkInsArgs<ExtArgs>
    gymsOwned?: boolean | User$gymsOwnedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeArgs<ExtArgs>
  }


  type UserGetPayload<S extends boolean | null | undefined | UserArgs> = $Types.GetResult<UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<UserPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    subscriptions<T extends User$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findMany', never>| Null>;

    payments<T extends User$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findMany', never>| Null>;

    checkIns<T extends User$checkInsArgs<ExtArgs> = {}>(args?: Subset<T, User$checkInsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findMany', never>| Null>;

    gymsOwned<T extends User$gymsOwnedArgs<ExtArgs> = {}>(args?: Subset<T, User$gymsOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<GymPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * User base type for findUnique actions
   */
  export type UserFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUnique
   */
  export interface UserFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UserFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User base type for findFirst actions
   */
  export type UserFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: Enumerable<UserScalarFieldEnum>
  }

  /**
   * User findFirst
   */
  export interface UserFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends UserFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Enumerable<UserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }


  /**
   * User.subscriptions
   */
  export type User$subscriptionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<SubscriptionScalarFieldEnum>
  }


  /**
   * User.payments
   */
  export type User$paymentsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<PaymentScalarFieldEnum>
  }


  /**
   * User.checkIns
   */
  export type User$checkInsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    where?: CheckInWhereInput
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    cursor?: CheckInWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<CheckInScalarFieldEnum>
  }


  /**
   * User.gymsOwned
   */
  export type User$gymsOwnedArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    where?: GymWhereInput
    orderBy?: Enumerable<GymOrderByWithRelationInput>
    cursor?: GymWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<GymScalarFieldEnum>
  }


  /**
   * User without action
   */
  export type UserArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
  }



  /**
   * Model SubscriptionTier
   */


  export type AggregateSubscriptionTier = {
    _count: SubscriptionTierCountAggregateOutputType | null
    _avg: SubscriptionTierAvgAggregateOutputType | null
    _sum: SubscriptionTierSumAggregateOutputType | null
    _min: SubscriptionTierMinAggregateOutputType | null
    _max: SubscriptionTierMaxAggregateOutputType | null
  }

  export type SubscriptionTierAvgAggregateOutputType = {
    accessTier: number | null
  }

  export type SubscriptionTierSumAggregateOutputType = {
    accessTier: number | null
  }

  export type SubscriptionTierMinAggregateOutputType = {
    id: string | null
    name: string | null
    accessTier: number | null
    createdAt: Date | null
  }

  export type SubscriptionTierMaxAggregateOutputType = {
    id: string | null
    name: string | null
    accessTier: number | null
    createdAt: Date | null
  }

  export type SubscriptionTierCountAggregateOutputType = {
    id: number
    name: number
    accessTier: number
    createdAt: number
    _all: number
  }


  export type SubscriptionTierAvgAggregateInputType = {
    accessTier?: true
  }

  export type SubscriptionTierSumAggregateInputType = {
    accessTier?: true
  }

  export type SubscriptionTierMinAggregateInputType = {
    id?: true
    name?: true
    accessTier?: true
    createdAt?: true
  }

  export type SubscriptionTierMaxAggregateInputType = {
    id?: true
    name?: true
    accessTier?: true
    createdAt?: true
  }

  export type SubscriptionTierCountAggregateInputType = {
    id?: true
    name?: true
    accessTier?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionTierAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionTier to aggregate.
     */
    where?: SubscriptionTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionTiers to fetch.
     */
    orderBy?: Enumerable<SubscriptionTierOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionTiers
    **/
    _count?: true | SubscriptionTierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionTierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionTierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionTierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionTierMaxAggregateInputType
  }

  export type GetSubscriptionTierAggregateType<T extends SubscriptionTierAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionTier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionTier[P]>
      : GetScalarType<T[P], AggregateSubscriptionTier[P]>
  }




  export type SubscriptionTierGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionTierWhereInput
    orderBy?: Enumerable<SubscriptionTierOrderByWithAggregationInput>
    by: SubscriptionTierScalarFieldEnum[]
    having?: SubscriptionTierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionTierCountAggregateInputType | true
    _avg?: SubscriptionTierAvgAggregateInputType
    _sum?: SubscriptionTierSumAggregateInputType
    _min?: SubscriptionTierMinAggregateInputType
    _max?: SubscriptionTierMaxAggregateInputType
  }


  export type SubscriptionTierGroupByOutputType = {
    id: string
    name: string
    accessTier: number
    createdAt: Date
    _count: SubscriptionTierCountAggregateOutputType | null
    _avg: SubscriptionTierAvgAggregateOutputType | null
    _sum: SubscriptionTierSumAggregateOutputType | null
    _min: SubscriptionTierMinAggregateOutputType | null
    _max: SubscriptionTierMaxAggregateOutputType | null
  }

  type GetSubscriptionTierGroupByPayload<T extends SubscriptionTierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<SubscriptionTierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionTierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionTierGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionTierGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionTierSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accessTier?: boolean
    createdAt?: boolean
    prices?: boolean | SubscriptionTier$pricesArgs<ExtArgs>
    subscriptions?: boolean | SubscriptionTier$subscriptionsArgs<ExtArgs>
    _count?: boolean | SubscriptionTierCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionTier"]>

  export type SubscriptionTierSelectScalar = {
    id?: boolean
    name?: boolean
    accessTier?: boolean
    createdAt?: boolean
  }

  export type SubscriptionTierInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    prices?: boolean | SubscriptionTier$pricesArgs<ExtArgs>
    subscriptions?: boolean | SubscriptionTier$subscriptionsArgs<ExtArgs>
    _count?: boolean | SubscriptionTierCountOutputTypeArgs<ExtArgs>
  }


  type SubscriptionTierGetPayload<S extends boolean | null | undefined | SubscriptionTierArgs> = $Types.GetResult<SubscriptionTierPayload, S>

  type SubscriptionTierCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubscriptionTierFindManyArgs, 'select' | 'include'> & {
      select?: SubscriptionTierCountAggregateInputType | true
    }

  export interface SubscriptionTierDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionTier'], meta: { name: 'SubscriptionTier' } }
    /**
     * Find zero or one SubscriptionTier that matches the filter.
     * @param {SubscriptionTierFindUniqueArgs} args - Arguments to find a SubscriptionTier
     * @example
     * // Get one SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubscriptionTierFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, SubscriptionTierFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'SubscriptionTier'> extends True ? Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one SubscriptionTier that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubscriptionTierFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionTier
     * @example
     * // Get one SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubscriptionTierFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionTierFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first SubscriptionTier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierFindFirstArgs} args - Arguments to find a SubscriptionTier
     * @example
     * // Get one SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubscriptionTierFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, SubscriptionTierFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'SubscriptionTier'> extends True ? Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first SubscriptionTier that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierFindFirstOrThrowArgs} args - Arguments to find a SubscriptionTier
     * @example
     * // Get one SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubscriptionTierFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionTierFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more SubscriptionTiers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionTiers
     * const subscriptionTiers = await prisma.subscriptionTier.findMany()
     * 
     * // Get first 10 SubscriptionTiers
     * const subscriptionTiers = await prisma.subscriptionTier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionTierWithIdOnly = await prisma.subscriptionTier.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubscriptionTierFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionTierFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a SubscriptionTier.
     * @param {SubscriptionTierCreateArgs} args - Arguments to create a SubscriptionTier.
     * @example
     * // Create one SubscriptionTier
     * const SubscriptionTier = await prisma.subscriptionTier.create({
     *   data: {
     *     // ... data to create a SubscriptionTier
     *   }
     * })
     * 
    **/
    create<T extends SubscriptionTierCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionTierCreateArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many SubscriptionTiers.
     *     @param {SubscriptionTierCreateManyArgs} args - Arguments to create many SubscriptionTiers.
     *     @example
     *     // Create many SubscriptionTiers
     *     const subscriptionTier = await prisma.subscriptionTier.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SubscriptionTierCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionTierCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SubscriptionTier.
     * @param {SubscriptionTierDeleteArgs} args - Arguments to delete one SubscriptionTier.
     * @example
     * // Delete one SubscriptionTier
     * const SubscriptionTier = await prisma.subscriptionTier.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionTier
     *   }
     * })
     * 
    **/
    delete<T extends SubscriptionTierDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionTierDeleteArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one SubscriptionTier.
     * @param {SubscriptionTierUpdateArgs} args - Arguments to update one SubscriptionTier.
     * @example
     * // Update one SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubscriptionTierUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionTierUpdateArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more SubscriptionTiers.
     * @param {SubscriptionTierDeleteManyArgs} args - Arguments to filter SubscriptionTiers to delete.
     * @example
     * // Delete a few SubscriptionTiers
     * const { count } = await prisma.subscriptionTier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubscriptionTierDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionTierDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionTiers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionTiers
     * const subscriptionTier = await prisma.subscriptionTier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubscriptionTierUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionTierUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubscriptionTier.
     * @param {SubscriptionTierUpsertArgs} args - Arguments to update or create a SubscriptionTier.
     * @example
     * // Update or create a SubscriptionTier
     * const subscriptionTier = await prisma.subscriptionTier.upsert({
     *   create: {
     *     // ... data to create a SubscriptionTier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionTier we want to update
     *   }
     * })
    **/
    upsert<T extends SubscriptionTierUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionTierUpsertArgs<ExtArgs>>
    ): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of SubscriptionTiers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierCountArgs} args - Arguments to filter SubscriptionTiers to count.
     * @example
     * // Count the number of SubscriptionTiers
     * const count = await prisma.subscriptionTier.count({
     *   where: {
     *     // ... the filter for the SubscriptionTiers we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionTierCountArgs>(
      args?: Subset<T, SubscriptionTierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionTierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionTier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionTierAggregateArgs>(args: Subset<T, SubscriptionTierAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionTierAggregateType<T>>

    /**
     * Group by SubscriptionTier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionTierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionTierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionTierGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionTierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionTierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionTierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionTier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubscriptionTierClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    prices<T extends SubscriptionTier$pricesArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionTier$pricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findMany', never>| Null>;

    subscriptions<T extends SubscriptionTier$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionTier$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * SubscriptionTier base type for findUnique actions
   */
  export type SubscriptionTierFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionTier to fetch.
     */
    where: SubscriptionTierWhereUniqueInput
  }

  /**
   * SubscriptionTier findUnique
   */
  export interface SubscriptionTierFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionTierFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * SubscriptionTier findUniqueOrThrow
   */
  export type SubscriptionTierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionTier to fetch.
     */
    where: SubscriptionTierWhereUniqueInput
  }


  /**
   * SubscriptionTier base type for findFirst actions
   */
  export type SubscriptionTierFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionTier to fetch.
     */
    where?: SubscriptionTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionTiers to fetch.
     */
    orderBy?: Enumerable<SubscriptionTierOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionTiers.
     */
    cursor?: SubscriptionTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionTiers.
     */
    distinct?: Enumerable<SubscriptionTierScalarFieldEnum>
  }

  /**
   * SubscriptionTier findFirst
   */
  export interface SubscriptionTierFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionTierFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * SubscriptionTier findFirstOrThrow
   */
  export type SubscriptionTierFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionTier to fetch.
     */
    where?: SubscriptionTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionTiers to fetch.
     */
    orderBy?: Enumerable<SubscriptionTierOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionTiers.
     */
    cursor?: SubscriptionTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionTiers.
     */
    distinct?: Enumerable<SubscriptionTierScalarFieldEnum>
  }


  /**
   * SubscriptionTier findMany
   */
  export type SubscriptionTierFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionTiers to fetch.
     */
    where?: SubscriptionTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionTiers to fetch.
     */
    orderBy?: Enumerable<SubscriptionTierOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionTiers.
     */
    cursor?: SubscriptionTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionTiers.
     */
    skip?: number
    distinct?: Enumerable<SubscriptionTierScalarFieldEnum>
  }


  /**
   * SubscriptionTier create
   */
  export type SubscriptionTierCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionTier.
     */
    data: XOR<SubscriptionTierCreateInput, SubscriptionTierUncheckedCreateInput>
  }


  /**
   * SubscriptionTier createMany
   */
  export type SubscriptionTierCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionTiers.
     */
    data: Enumerable<SubscriptionTierCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * SubscriptionTier update
   */
  export type SubscriptionTierUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionTier.
     */
    data: XOR<SubscriptionTierUpdateInput, SubscriptionTierUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionTier to update.
     */
    where: SubscriptionTierWhereUniqueInput
  }


  /**
   * SubscriptionTier updateMany
   */
  export type SubscriptionTierUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionTiers.
     */
    data: XOR<SubscriptionTierUpdateManyMutationInput, SubscriptionTierUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionTiers to update
     */
    where?: SubscriptionTierWhereInput
  }


  /**
   * SubscriptionTier upsert
   */
  export type SubscriptionTierUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionTier to update in case it exists.
     */
    where: SubscriptionTierWhereUniqueInput
    /**
     * In case the SubscriptionTier found by the `where` argument doesn't exist, create a new SubscriptionTier with this data.
     */
    create: XOR<SubscriptionTierCreateInput, SubscriptionTierUncheckedCreateInput>
    /**
     * In case the SubscriptionTier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionTierUpdateInput, SubscriptionTierUncheckedUpdateInput>
  }


  /**
   * SubscriptionTier delete
   */
  export type SubscriptionTierDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionTier to delete.
     */
    where: SubscriptionTierWhereUniqueInput
  }


  /**
   * SubscriptionTier deleteMany
   */
  export type SubscriptionTierDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionTiers to delete
     */
    where?: SubscriptionTierWhereInput
  }


  /**
   * SubscriptionTier.prices
   */
  export type SubscriptionTier$pricesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    where?: SubscriptionPriceWhereInput
    orderBy?: Enumerable<SubscriptionPriceOrderByWithRelationInput>
    cursor?: SubscriptionPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<SubscriptionPriceScalarFieldEnum>
  }


  /**
   * SubscriptionTier.subscriptions
   */
  export type SubscriptionTier$subscriptionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<SubscriptionScalarFieldEnum>
  }


  /**
   * SubscriptionTier without action
   */
  export type SubscriptionTierArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionTier
     */
    select?: SubscriptionTierSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionTierInclude<ExtArgs> | null
  }



  /**
   * Model SubscriptionPrice
   */


  export type AggregateSubscriptionPrice = {
    _count: SubscriptionPriceCountAggregateOutputType | null
    _avg: SubscriptionPriceAvgAggregateOutputType | null
    _sum: SubscriptionPriceSumAggregateOutputType | null
    _min: SubscriptionPriceMinAggregateOutputType | null
    _max: SubscriptionPriceMaxAggregateOutputType | null
  }

  export type SubscriptionPriceAvgAggregateOutputType = {
    priceCents: number | null
  }

  export type SubscriptionPriceSumAggregateOutputType = {
    priceCents: number | null
  }

  export type SubscriptionPriceMinAggregateOutputType = {
    id: string | null
    tierId: string | null
    stripePriceId: string | null
    interval: string | null
    priceCents: number | null
    createdAt: Date | null
  }

  export type SubscriptionPriceMaxAggregateOutputType = {
    id: string | null
    tierId: string | null
    stripePriceId: string | null
    interval: string | null
    priceCents: number | null
    createdAt: Date | null
  }

  export type SubscriptionPriceCountAggregateOutputType = {
    id: number
    tierId: number
    stripePriceId: number
    interval: number
    priceCents: number
    createdAt: number
    _all: number
  }


  export type SubscriptionPriceAvgAggregateInputType = {
    priceCents?: true
  }

  export type SubscriptionPriceSumAggregateInputType = {
    priceCents?: true
  }

  export type SubscriptionPriceMinAggregateInputType = {
    id?: true
    tierId?: true
    stripePriceId?: true
    interval?: true
    priceCents?: true
    createdAt?: true
  }

  export type SubscriptionPriceMaxAggregateInputType = {
    id?: true
    tierId?: true
    stripePriceId?: true
    interval?: true
    priceCents?: true
    createdAt?: true
  }

  export type SubscriptionPriceCountAggregateInputType = {
    id?: true
    tierId?: true
    stripePriceId?: true
    interval?: true
    priceCents?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionPriceAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPrice to aggregate.
     */
    where?: SubscriptionPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPrices to fetch.
     */
    orderBy?: Enumerable<SubscriptionPriceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPrices
    **/
    _count?: true | SubscriptionPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPriceMaxAggregateInputType
  }

  export type GetSubscriptionPriceAggregateType<T extends SubscriptionPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPrice[P]>
      : GetScalarType<T[P], AggregateSubscriptionPrice[P]>
  }




  export type SubscriptionPriceGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionPriceWhereInput
    orderBy?: Enumerable<SubscriptionPriceOrderByWithAggregationInput>
    by: SubscriptionPriceScalarFieldEnum[]
    having?: SubscriptionPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPriceCountAggregateInputType | true
    _avg?: SubscriptionPriceAvgAggregateInputType
    _sum?: SubscriptionPriceSumAggregateInputType
    _min?: SubscriptionPriceMinAggregateInputType
    _max?: SubscriptionPriceMaxAggregateInputType
  }


  export type SubscriptionPriceGroupByOutputType = {
    id: string
    tierId: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt: Date
    _count: SubscriptionPriceCountAggregateOutputType | null
    _avg: SubscriptionPriceAvgAggregateOutputType | null
    _sum: SubscriptionPriceSumAggregateOutputType | null
    _min: SubscriptionPriceMinAggregateOutputType | null
    _max: SubscriptionPriceMaxAggregateOutputType | null
  }

  type GetSubscriptionPriceGroupByPayload<T extends SubscriptionPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<SubscriptionPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPriceGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPriceGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPriceSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierId?: boolean
    stripePriceId?: boolean
    interval?: boolean
    priceCents?: boolean
    createdAt?: boolean
    tier?: boolean | SubscriptionTierArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPrice"]>

  export type SubscriptionPriceSelectScalar = {
    id?: boolean
    tierId?: boolean
    stripePriceId?: boolean
    interval?: boolean
    priceCents?: boolean
    createdAt?: boolean
  }

  export type SubscriptionPriceInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tier?: boolean | SubscriptionTierArgs<ExtArgs>
  }


  type SubscriptionPriceGetPayload<S extends boolean | null | undefined | SubscriptionPriceArgs> = $Types.GetResult<SubscriptionPricePayload, S>

  type SubscriptionPriceCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubscriptionPriceFindManyArgs, 'select' | 'include'> & {
      select?: SubscriptionPriceCountAggregateInputType | true
    }

  export interface SubscriptionPriceDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPrice'], meta: { name: 'SubscriptionPrice' } }
    /**
     * Find zero or one SubscriptionPrice that matches the filter.
     * @param {SubscriptionPriceFindUniqueArgs} args - Arguments to find a SubscriptionPrice
     * @example
     * // Get one SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubscriptionPriceFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, SubscriptionPriceFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'SubscriptionPrice'> extends True ? Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one SubscriptionPrice that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubscriptionPriceFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPrice
     * @example
     * // Get one SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubscriptionPriceFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPriceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first SubscriptionPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceFindFirstArgs} args - Arguments to find a SubscriptionPrice
     * @example
     * // Get one SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubscriptionPriceFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, SubscriptionPriceFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'SubscriptionPrice'> extends True ? Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first SubscriptionPrice that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPrice
     * @example
     * // Get one SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubscriptionPriceFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPriceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more SubscriptionPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPrices
     * const subscriptionPrices = await prisma.subscriptionPrice.findMany()
     * 
     * // Get first 10 SubscriptionPrices
     * const subscriptionPrices = await prisma.subscriptionPrice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPriceWithIdOnly = await prisma.subscriptionPrice.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubscriptionPriceFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPriceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a SubscriptionPrice.
     * @param {SubscriptionPriceCreateArgs} args - Arguments to create a SubscriptionPrice.
     * @example
     * // Create one SubscriptionPrice
     * const SubscriptionPrice = await prisma.subscriptionPrice.create({
     *   data: {
     *     // ... data to create a SubscriptionPrice
     *   }
     * })
     * 
    **/
    create<T extends SubscriptionPriceCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPriceCreateArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many SubscriptionPrices.
     *     @param {SubscriptionPriceCreateManyArgs} args - Arguments to create many SubscriptionPrices.
     *     @example
     *     // Create many SubscriptionPrices
     *     const subscriptionPrice = await prisma.subscriptionPrice.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SubscriptionPriceCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPriceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SubscriptionPrice.
     * @param {SubscriptionPriceDeleteArgs} args - Arguments to delete one SubscriptionPrice.
     * @example
     * // Delete one SubscriptionPrice
     * const SubscriptionPrice = await prisma.subscriptionPrice.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPrice
     *   }
     * })
     * 
    **/
    delete<T extends SubscriptionPriceDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPriceDeleteArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one SubscriptionPrice.
     * @param {SubscriptionPriceUpdateArgs} args - Arguments to update one SubscriptionPrice.
     * @example
     * // Update one SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubscriptionPriceUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPriceUpdateArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more SubscriptionPrices.
     * @param {SubscriptionPriceDeleteManyArgs} args - Arguments to filter SubscriptionPrices to delete.
     * @example
     * // Delete a few SubscriptionPrices
     * const { count } = await prisma.subscriptionPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubscriptionPriceDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPriceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPrices
     * const subscriptionPrice = await prisma.subscriptionPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubscriptionPriceUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPriceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubscriptionPrice.
     * @param {SubscriptionPriceUpsertArgs} args - Arguments to update or create a SubscriptionPrice.
     * @example
     * // Update or create a SubscriptionPrice
     * const subscriptionPrice = await prisma.subscriptionPrice.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPrice we want to update
     *   }
     * })
    **/
    upsert<T extends SubscriptionPriceUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPriceUpsertArgs<ExtArgs>>
    ): Prisma__SubscriptionPriceClient<$Types.GetResult<SubscriptionPricePayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of SubscriptionPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceCountArgs} args - Arguments to filter SubscriptionPrices to count.
     * @example
     * // Count the number of SubscriptionPrices
     * const count = await prisma.subscriptionPrice.count({
     *   where: {
     *     // ... the filter for the SubscriptionPrices we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPriceCountArgs>(
      args?: Subset<T, SubscriptionPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPriceAggregateArgs>(args: Subset<T, SubscriptionPriceAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPriceAggregateType<T>>

    /**
     * Group by SubscriptionPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPriceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPriceGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubscriptionPriceClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tier<T extends SubscriptionTierArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionTierArgs<ExtArgs>>): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * SubscriptionPrice base type for findUnique actions
   */
  export type SubscriptionPriceFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPrice to fetch.
     */
    where: SubscriptionPriceWhereUniqueInput
  }

  /**
   * SubscriptionPrice findUnique
   */
  export interface SubscriptionPriceFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionPriceFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * SubscriptionPrice findUniqueOrThrow
   */
  export type SubscriptionPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPrice to fetch.
     */
    where: SubscriptionPriceWhereUniqueInput
  }


  /**
   * SubscriptionPrice base type for findFirst actions
   */
  export type SubscriptionPriceFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPrice to fetch.
     */
    where?: SubscriptionPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPrices to fetch.
     */
    orderBy?: Enumerable<SubscriptionPriceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPrices.
     */
    cursor?: SubscriptionPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPrices.
     */
    distinct?: Enumerable<SubscriptionPriceScalarFieldEnum>
  }

  /**
   * SubscriptionPrice findFirst
   */
  export interface SubscriptionPriceFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionPriceFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * SubscriptionPrice findFirstOrThrow
   */
  export type SubscriptionPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPrice to fetch.
     */
    where?: SubscriptionPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPrices to fetch.
     */
    orderBy?: Enumerable<SubscriptionPriceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPrices.
     */
    cursor?: SubscriptionPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPrices.
     */
    distinct?: Enumerable<SubscriptionPriceScalarFieldEnum>
  }


  /**
   * SubscriptionPrice findMany
   */
  export type SubscriptionPriceFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPrices to fetch.
     */
    where?: SubscriptionPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPrices to fetch.
     */
    orderBy?: Enumerable<SubscriptionPriceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPrices.
     */
    cursor?: SubscriptionPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPrices.
     */
    skip?: number
    distinct?: Enumerable<SubscriptionPriceScalarFieldEnum>
  }


  /**
   * SubscriptionPrice create
   */
  export type SubscriptionPriceCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPrice.
     */
    data: XOR<SubscriptionPriceCreateInput, SubscriptionPriceUncheckedCreateInput>
  }


  /**
   * SubscriptionPrice createMany
   */
  export type SubscriptionPriceCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPrices.
     */
    data: Enumerable<SubscriptionPriceCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * SubscriptionPrice update
   */
  export type SubscriptionPriceUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPrice.
     */
    data: XOR<SubscriptionPriceUpdateInput, SubscriptionPriceUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPrice to update.
     */
    where: SubscriptionPriceWhereUniqueInput
  }


  /**
   * SubscriptionPrice updateMany
   */
  export type SubscriptionPriceUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPrices.
     */
    data: XOR<SubscriptionPriceUpdateManyMutationInput, SubscriptionPriceUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPrices to update
     */
    where?: SubscriptionPriceWhereInput
  }


  /**
   * SubscriptionPrice upsert
   */
  export type SubscriptionPriceUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPrice to update in case it exists.
     */
    where: SubscriptionPriceWhereUniqueInput
    /**
     * In case the SubscriptionPrice found by the `where` argument doesn't exist, create a new SubscriptionPrice with this data.
     */
    create: XOR<SubscriptionPriceCreateInput, SubscriptionPriceUncheckedCreateInput>
    /**
     * In case the SubscriptionPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPriceUpdateInput, SubscriptionPriceUncheckedUpdateInput>
  }


  /**
   * SubscriptionPrice delete
   */
  export type SubscriptionPriceDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPrice to delete.
     */
    where: SubscriptionPriceWhereUniqueInput
  }


  /**
   * SubscriptionPrice deleteMany
   */
  export type SubscriptionPriceDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPrices to delete
     */
    where?: SubscriptionPriceWhereInput
  }


  /**
   * SubscriptionPrice without action
   */
  export type SubscriptionPriceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPrice
     */
    select?: SubscriptionPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionPriceInclude<ExtArgs> | null
  }



  /**
   * Model Subscription
   */


  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tierId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    status: string | null
    startAt: Date | null
    endAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tierId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    status: string | null
    startAt: Date | null
    endAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    tierId: number
    stripeSubscriptionId: number
    stripePriceId: number
    status: number
    startAt: number
    endAt: number
    createdAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    tierId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    startAt?: true
    endAt?: true
    createdAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    tierId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    startAt?: true
    endAt?: true
    createdAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    tierId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    startAt?: true
    endAt?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: Enumerable<SubscriptionOrderByWithAggregationInput>
    by: SubscriptionScalarFieldEnum[]
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }


  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt: Date | null
    endAt: Date | null
    createdAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tierId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    status?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
    user?: boolean | UserArgs<ExtArgs>
    tier?: boolean | SubscriptionTierArgs<ExtArgs>
    payments?: boolean | Subscription$paymentsArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    tierId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    status?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    user?: boolean | UserArgs<ExtArgs>
    tier?: boolean | SubscriptionTierArgs<ExtArgs>
    payments?: boolean | Subscription$paymentsArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeArgs<ExtArgs>
  }


  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionArgs> = $Types.GetResult<SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubscriptionFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Subscription'> extends True ? Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubscriptionFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Subscription'> extends True ? Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubscriptionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
    **/
    create<T extends SubscriptionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Subscriptions.
     *     @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     *     @example
     *     // Create many Subscriptions
     *     const subscription = await prisma.subscription.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SubscriptionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
    **/
    delete<T extends SubscriptionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubscriptionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubscriptionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubscriptionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
    **/
    upsert<T extends SubscriptionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>
    ): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user<T extends UserArgs<ExtArgs> = {}>(args?: Subset<T, UserArgs<ExtArgs>>): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    tier<T extends SubscriptionTierArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionTierArgs<ExtArgs>>): Prisma__SubscriptionTierClient<$Types.GetResult<SubscriptionTierPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    payments<T extends Subscription$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Subscription$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Subscription base type for findUnique actions
   */
  export type SubscriptionFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUnique
   */
  export interface SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }


  /**
   * Subscription base type for findFirst actions
   */
  export type SubscriptionFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: Enumerable<SubscriptionScalarFieldEnum>
  }

  /**
   * Subscription findFirst
   */
  export interface SubscriptionFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends SubscriptionFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: Enumerable<SubscriptionScalarFieldEnum>
  }


  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: Enumerable<SubscriptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: Enumerable<SubscriptionScalarFieldEnum>
  }


  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }


  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: Enumerable<SubscriptionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }


  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }


  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }


  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }


  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }


  /**
   * Subscription.payments
   */
  export type Subscription$paymentsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<PaymentScalarFieldEnum>
  }


  /**
   * Subscription without action
   */
  export type SubscriptionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }



  /**
   * Model Payment
   */


  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amountCents: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amountCents: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    subscriptionId: string | null
    amountCents: number | null
    currency: string | null
    stripePaymentIntent: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    subscriptionId: string | null
    amountCents: number | null
    currency: string | null
    stripePaymentIntent: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    userId: number
    subscriptionId: number
    amountCents: number
    currency: number
    stripePaymentIntent: number
    status: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amountCents?: true
  }

  export type PaymentSumAggregateInputType = {
    amountCents?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    userId?: true
    subscriptionId?: true
    amountCents?: true
    currency?: true
    stripePaymentIntent?: true
    status?: true
    createdAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    userId?: true
    subscriptionId?: true
    amountCents?: true
    currency?: true
    stripePaymentIntent?: true
    status?: true
    createdAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    userId?: true
    subscriptionId?: true
    amountCents?: true
    currency?: true
    stripePaymentIntent?: true
    status?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: Enumerable<PaymentOrderByWithAggregationInput>
    by: PaymentScalarFieldEnum[]
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }


  export type PaymentGroupByOutputType = {
    id: string
    userId: string
    subscriptionId: string | null
    amountCents: number
    currency: string
    stripePaymentIntent: string | null
    status: string
    metadata: JsonValue | null
    createdAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    subscriptionId?: boolean
    amountCents?: boolean
    currency?: boolean
    stripePaymentIntent?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserArgs<ExtArgs>
    subscription?: boolean | SubscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    userId?: boolean
    subscriptionId?: boolean
    amountCents?: boolean
    currency?: boolean
    stripePaymentIntent?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    user?: boolean | UserArgs<ExtArgs>
    subscription?: boolean | SubscriptionArgs<ExtArgs>
  }


  type PaymentGetPayload<S extends boolean | null | undefined | PaymentArgs> = $Types.GetResult<PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PaymentFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Payment'> extends True ? Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PaymentFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Payment'> extends True ? Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PaymentFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
    **/
    create<T extends PaymentCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Payments.
     *     @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     *     @example
     *     // Create many Payments
     *     const payment = await prisma.payment.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends PaymentCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
    **/
    delete<T extends PaymentDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PaymentUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PaymentDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PaymentUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
    **/
    upsert<T extends PaymentUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>
    ): Prisma__PaymentClient<$Types.GetResult<PaymentPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user<T extends UserArgs<ExtArgs> = {}>(args?: Subset<T, UserArgs<ExtArgs>>): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    subscription<T extends SubscriptionArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Types.GetResult<SubscriptionPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Payment base type for findUnique actions
   */
  export type PaymentFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUnique
   */
  export interface PaymentFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends PaymentFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }


  /**
   * Payment base type for findFirst actions
   */
  export type PaymentFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: Enumerable<PaymentScalarFieldEnum>
  }

  /**
   * Payment findFirst
   */
  export interface PaymentFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends PaymentFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: Enumerable<PaymentScalarFieldEnum>
  }


  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: Enumerable<PaymentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: Enumerable<PaymentScalarFieldEnum>
  }


  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }


  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: Enumerable<PaymentCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }


  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }


  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }


  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }


  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }


  /**
   * Payment without action
   */
  export type PaymentArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PaymentInclude<ExtArgs> | null
  }



  /**
   * Model Gym
   */


  export type AggregateGym = {
    _count: GymCountAggregateOutputType | null
    _avg: GymAvgAggregateOutputType | null
    _sum: GymSumAggregateOutputType | null
    _min: GymMinAggregateOutputType | null
    _max: GymMaxAggregateOutputType | null
  }

  export type GymAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    tier: number | null
  }

  export type GymSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    tier: number | null
  }

  export type GymMinAggregateOutputType = {
    id: string | null
    name: string | null
    addressLine: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    openingTime: string | null
    closingTime: string | null
    is24Hours: boolean | null
    tier: number | null
    coverImageUrl: string | null
    status: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type GymMaxAggregateOutputType = {
    id: string | null
    name: string | null
    addressLine: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    openingTime: string | null
    closingTime: string | null
    is24Hours: boolean | null
    tier: number | null
    coverImageUrl: string | null
    status: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type GymCountAggregateOutputType = {
    id: number
    name: number
    addressLine: number
    city: number
    latitude: number
    longitude: number
    openingTime: number
    closingTime: number
    is24Hours: number
    tier: number
    coverImageUrl: number
    status: number
    ownerId: number
    createdAt: number
    _all: number
  }


  export type GymAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    tier?: true
  }

  export type GymSumAggregateInputType = {
    latitude?: true
    longitude?: true
    tier?: true
  }

  export type GymMinAggregateInputType = {
    id?: true
    name?: true
    addressLine?: true
    city?: true
    latitude?: true
    longitude?: true
    openingTime?: true
    closingTime?: true
    is24Hours?: true
    tier?: true
    coverImageUrl?: true
    status?: true
    ownerId?: true
    createdAt?: true
  }

  export type GymMaxAggregateInputType = {
    id?: true
    name?: true
    addressLine?: true
    city?: true
    latitude?: true
    longitude?: true
    openingTime?: true
    closingTime?: true
    is24Hours?: true
    tier?: true
    coverImageUrl?: true
    status?: true
    ownerId?: true
    createdAt?: true
  }

  export type GymCountAggregateInputType = {
    id?: true
    name?: true
    addressLine?: true
    city?: true
    latitude?: true
    longitude?: true
    openingTime?: true
    closingTime?: true
    is24Hours?: true
    tier?: true
    coverImageUrl?: true
    status?: true
    ownerId?: true
    createdAt?: true
    _all?: true
  }

  export type GymAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gym to aggregate.
     */
    where?: GymWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gyms to fetch.
     */
    orderBy?: Enumerable<GymOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GymWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gyms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gyms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gyms
    **/
    _count?: true | GymCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GymAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GymSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GymMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GymMaxAggregateInputType
  }

  export type GetGymAggregateType<T extends GymAggregateArgs> = {
        [P in keyof T & keyof AggregateGym]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGym[P]>
      : GetScalarType<T[P], AggregateGym[P]>
  }




  export type GymGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: GymWhereInput
    orderBy?: Enumerable<GymOrderByWithAggregationInput>
    by: GymScalarFieldEnum[]
    having?: GymScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GymCountAggregateInputType | true
    _avg?: GymAvgAggregateInputType
    _sum?: GymSumAggregateInputType
    _min?: GymMinAggregateInputType
    _max?: GymMaxAggregateInputType
  }


  export type GymGroupByOutputType = {
    id: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime: string | null
    closingTime: string | null
    is24Hours: boolean
    tier: number
    coverImageUrl: string | null
    status: string
    ownerId: string | null
    createdAt: Date
    _count: GymCountAggregateOutputType | null
    _avg: GymAvgAggregateOutputType | null
    _sum: GymSumAggregateOutputType | null
    _min: GymMinAggregateOutputType | null
    _max: GymMaxAggregateOutputType | null
  }

  type GetGymGroupByPayload<T extends GymGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<GymGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GymGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GymGroupByOutputType[P]>
            : GetScalarType<T[P], GymGroupByOutputType[P]>
        }
      >
    >


  export type GymSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    addressLine?: boolean
    city?: boolean
    latitude?: boolean
    longitude?: boolean
    openingTime?: boolean
    closingTime?: boolean
    is24Hours?: boolean
    tier?: boolean
    coverImageUrl?: boolean
    status?: boolean
    ownerId?: boolean
    createdAt?: boolean
    owner?: boolean | UserArgs<ExtArgs>
    checkIns?: boolean | Gym$checkInsArgs<ExtArgs>
    photos?: boolean | Gym$photosArgs<ExtArgs>
    _count?: boolean | GymCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["gym"]>

  export type GymSelectScalar = {
    id?: boolean
    name?: boolean
    addressLine?: boolean
    city?: boolean
    latitude?: boolean
    longitude?: boolean
    openingTime?: boolean
    closingTime?: boolean
    is24Hours?: boolean
    tier?: boolean
    coverImageUrl?: boolean
    status?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }

  export type GymInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    owner?: boolean | UserArgs<ExtArgs>
    checkIns?: boolean | Gym$checkInsArgs<ExtArgs>
    photos?: boolean | Gym$photosArgs<ExtArgs>
    _count?: boolean | GymCountOutputTypeArgs<ExtArgs>
  }


  type GymGetPayload<S extends boolean | null | undefined | GymArgs> = $Types.GetResult<GymPayload, S>

  type GymCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<GymFindManyArgs, 'select' | 'include'> & {
      select?: GymCountAggregateInputType | true
    }

  export interface GymDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gym'], meta: { name: 'Gym' } }
    /**
     * Find zero or one Gym that matches the filter.
     * @param {GymFindUniqueArgs} args - Arguments to find a Gym
     * @example
     * // Get one Gym
     * const gym = await prisma.gym.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends GymFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, GymFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Gym'> extends True ? Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Gym that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {GymFindUniqueOrThrowArgs} args - Arguments to find a Gym
     * @example
     * // Get one Gym
     * const gym = await prisma.gym.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends GymFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GymFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Gym that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymFindFirstArgs} args - Arguments to find a Gym
     * @example
     * // Get one Gym
     * const gym = await prisma.gym.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends GymFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, GymFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Gym'> extends True ? Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Gym that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymFindFirstOrThrowArgs} args - Arguments to find a Gym
     * @example
     * // Get one Gym
     * const gym = await prisma.gym.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends GymFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GymFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Gyms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gyms
     * const gyms = await prisma.gym.findMany()
     * 
     * // Get first 10 Gyms
     * const gyms = await prisma.gym.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gymWithIdOnly = await prisma.gym.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends GymFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<GymPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Gym.
     * @param {GymCreateArgs} args - Arguments to create a Gym.
     * @example
     * // Create one Gym
     * const Gym = await prisma.gym.create({
     *   data: {
     *     // ... data to create a Gym
     *   }
     * })
     * 
    **/
    create<T extends GymCreateArgs<ExtArgs>>(
      args: SelectSubset<T, GymCreateArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Gyms.
     *     @param {GymCreateManyArgs} args - Arguments to create many Gyms.
     *     @example
     *     // Create many Gyms
     *     const gym = await prisma.gym.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends GymCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Gym.
     * @param {GymDeleteArgs} args - Arguments to delete one Gym.
     * @example
     * // Delete one Gym
     * const Gym = await prisma.gym.delete({
     *   where: {
     *     // ... filter to delete one Gym
     *   }
     * })
     * 
    **/
    delete<T extends GymDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, GymDeleteArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Gym.
     * @param {GymUpdateArgs} args - Arguments to update one Gym.
     * @example
     * // Update one Gym
     * const gym = await prisma.gym.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GymUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, GymUpdateArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Gyms.
     * @param {GymDeleteManyArgs} args - Arguments to filter Gyms to delete.
     * @example
     * // Delete a few Gyms
     * const { count } = await prisma.gym.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GymDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gyms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gyms
     * const gym = await prisma.gym.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GymUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, GymUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Gym.
     * @param {GymUpsertArgs} args - Arguments to update or create a Gym.
     * @example
     * // Update or create a Gym
     * const gym = await prisma.gym.upsert({
     *   create: {
     *     // ... data to create a Gym
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gym we want to update
     *   }
     * })
    **/
    upsert<T extends GymUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, GymUpsertArgs<ExtArgs>>
    ): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Gyms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymCountArgs} args - Arguments to filter Gyms to count.
     * @example
     * // Count the number of Gyms
     * const count = await prisma.gym.count({
     *   where: {
     *     // ... the filter for the Gyms we want to count
     *   }
     * })
    **/
    count<T extends GymCountArgs>(
      args?: Subset<T, GymCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GymCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gym.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GymAggregateArgs>(args: Subset<T, GymAggregateArgs>): Prisma.PrismaPromise<GetGymAggregateType<T>>

    /**
     * Group by Gym.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GymGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GymGroupByArgs['orderBy'] }
        : { orderBy?: GymGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GymGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGymGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Gym.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__GymClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    owner<T extends UserArgs<ExtArgs> = {}>(args?: Subset<T, UserArgs<ExtArgs>>): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    checkIns<T extends Gym$checkInsArgs<ExtArgs> = {}>(args?: Subset<T, Gym$checkInsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findMany', never>| Null>;

    photos<T extends Gym$photosArgs<ExtArgs> = {}>(args?: Subset<T, Gym$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Gym base type for findUnique actions
   */
  export type GymFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter, which Gym to fetch.
     */
    where: GymWhereUniqueInput
  }

  /**
   * Gym findUnique
   */
  export interface GymFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends GymFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Gym findUniqueOrThrow
   */
  export type GymFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter, which Gym to fetch.
     */
    where: GymWhereUniqueInput
  }


  /**
   * Gym base type for findFirst actions
   */
  export type GymFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter, which Gym to fetch.
     */
    where?: GymWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gyms to fetch.
     */
    orderBy?: Enumerable<GymOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gyms.
     */
    cursor?: GymWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gyms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gyms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gyms.
     */
    distinct?: Enumerable<GymScalarFieldEnum>
  }

  /**
   * Gym findFirst
   */
  export interface GymFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends GymFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Gym findFirstOrThrow
   */
  export type GymFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter, which Gym to fetch.
     */
    where?: GymWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gyms to fetch.
     */
    orderBy?: Enumerable<GymOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gyms.
     */
    cursor?: GymWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gyms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gyms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gyms.
     */
    distinct?: Enumerable<GymScalarFieldEnum>
  }


  /**
   * Gym findMany
   */
  export type GymFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter, which Gyms to fetch.
     */
    where?: GymWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gyms to fetch.
     */
    orderBy?: Enumerable<GymOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gyms.
     */
    cursor?: GymWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gyms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gyms.
     */
    skip?: number
    distinct?: Enumerable<GymScalarFieldEnum>
  }


  /**
   * Gym create
   */
  export type GymCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * The data needed to create a Gym.
     */
    data: XOR<GymCreateInput, GymUncheckedCreateInput>
  }


  /**
   * Gym createMany
   */
  export type GymCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gyms.
     */
    data: Enumerable<GymCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Gym update
   */
  export type GymUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * The data needed to update a Gym.
     */
    data: XOR<GymUpdateInput, GymUncheckedUpdateInput>
    /**
     * Choose, which Gym to update.
     */
    where: GymWhereUniqueInput
  }


  /**
   * Gym updateMany
   */
  export type GymUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gyms.
     */
    data: XOR<GymUpdateManyMutationInput, GymUncheckedUpdateManyInput>
    /**
     * Filter which Gyms to update
     */
    where?: GymWhereInput
  }


  /**
   * Gym upsert
   */
  export type GymUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * The filter to search for the Gym to update in case it exists.
     */
    where: GymWhereUniqueInput
    /**
     * In case the Gym found by the `where` argument doesn't exist, create a new Gym with this data.
     */
    create: XOR<GymCreateInput, GymUncheckedCreateInput>
    /**
     * In case the Gym was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GymUpdateInput, GymUncheckedUpdateInput>
  }


  /**
   * Gym delete
   */
  export type GymDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
    /**
     * Filter which Gym to delete.
     */
    where: GymWhereUniqueInput
  }


  /**
   * Gym deleteMany
   */
  export type GymDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gyms to delete
     */
    where?: GymWhereInput
  }


  /**
   * Gym.checkIns
   */
  export type Gym$checkInsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    where?: CheckInWhereInput
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    cursor?: CheckInWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<CheckInScalarFieldEnum>
  }


  /**
   * Gym.photos
   */
  export type Gym$photosArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    where?: GymPhotoWhereInput
    orderBy?: Enumerable<GymPhotoOrderByWithRelationInput>
    cursor?: GymPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<GymPhotoScalarFieldEnum>
  }


  /**
   * Gym without action
   */
  export type GymArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gym
     */
    select?: GymSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymInclude<ExtArgs> | null
  }



  /**
   * Model GymPhoto
   */


  export type AggregateGymPhoto = {
    _count: GymPhotoCountAggregateOutputType | null
    _min: GymPhotoMinAggregateOutputType | null
    _max: GymPhotoMaxAggregateOutputType | null
  }

  export type GymPhotoMinAggregateOutputType = {
    id: string | null
    gymId: string | null
    url: string | null
    createdAt: Date | null
  }

  export type GymPhotoMaxAggregateOutputType = {
    id: string | null
    gymId: string | null
    url: string | null
    createdAt: Date | null
  }

  export type GymPhotoCountAggregateOutputType = {
    id: number
    gymId: number
    url: number
    createdAt: number
    _all: number
  }


  export type GymPhotoMinAggregateInputType = {
    id?: true
    gymId?: true
    url?: true
    createdAt?: true
  }

  export type GymPhotoMaxAggregateInputType = {
    id?: true
    gymId?: true
    url?: true
    createdAt?: true
  }

  export type GymPhotoCountAggregateInputType = {
    id?: true
    gymId?: true
    url?: true
    createdAt?: true
    _all?: true
  }

  export type GymPhotoAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which GymPhoto to aggregate.
     */
    where?: GymPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GymPhotos to fetch.
     */
    orderBy?: Enumerable<GymPhotoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GymPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GymPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GymPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GymPhotos
    **/
    _count?: true | GymPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GymPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GymPhotoMaxAggregateInputType
  }

  export type GetGymPhotoAggregateType<T extends GymPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateGymPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGymPhoto[P]>
      : GetScalarType<T[P], AggregateGymPhoto[P]>
  }




  export type GymPhotoGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: GymPhotoWhereInput
    orderBy?: Enumerable<GymPhotoOrderByWithAggregationInput>
    by: GymPhotoScalarFieldEnum[]
    having?: GymPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GymPhotoCountAggregateInputType | true
    _min?: GymPhotoMinAggregateInputType
    _max?: GymPhotoMaxAggregateInputType
  }


  export type GymPhotoGroupByOutputType = {
    id: string
    gymId: string
    url: string
    createdAt: Date
    _count: GymPhotoCountAggregateOutputType | null
    _min: GymPhotoMinAggregateOutputType | null
    _max: GymPhotoMaxAggregateOutputType | null
  }

  type GetGymPhotoGroupByPayload<T extends GymPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<GymPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GymPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GymPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], GymPhotoGroupByOutputType[P]>
        }
      >
    >


  export type GymPhotoSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gymId?: boolean
    url?: boolean
    createdAt?: boolean
    gym?: boolean | GymArgs<ExtArgs>
  }, ExtArgs["result"]["gymPhoto"]>

  export type GymPhotoSelectScalar = {
    id?: boolean
    gymId?: boolean
    url?: boolean
    createdAt?: boolean
  }

  export type GymPhotoInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    gym?: boolean | GymArgs<ExtArgs>
  }


  type GymPhotoGetPayload<S extends boolean | null | undefined | GymPhotoArgs> = $Types.GetResult<GymPhotoPayload, S>

  type GymPhotoCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<GymPhotoFindManyArgs, 'select' | 'include'> & {
      select?: GymPhotoCountAggregateInputType | true
    }

  export interface GymPhotoDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GymPhoto'], meta: { name: 'GymPhoto' } }
    /**
     * Find zero or one GymPhoto that matches the filter.
     * @param {GymPhotoFindUniqueArgs} args - Arguments to find a GymPhoto
     * @example
     * // Get one GymPhoto
     * const gymPhoto = await prisma.gymPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends GymPhotoFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, GymPhotoFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'GymPhoto'> extends True ? Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one GymPhoto that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {GymPhotoFindUniqueOrThrowArgs} args - Arguments to find a GymPhoto
     * @example
     * // Get one GymPhoto
     * const gymPhoto = await prisma.gymPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends GymPhotoFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GymPhotoFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first GymPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoFindFirstArgs} args - Arguments to find a GymPhoto
     * @example
     * // Get one GymPhoto
     * const gymPhoto = await prisma.gymPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends GymPhotoFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, GymPhotoFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'GymPhoto'> extends True ? Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first GymPhoto that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoFindFirstOrThrowArgs} args - Arguments to find a GymPhoto
     * @example
     * // Get one GymPhoto
     * const gymPhoto = await prisma.gymPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends GymPhotoFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, GymPhotoFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more GymPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GymPhotos
     * const gymPhotos = await prisma.gymPhoto.findMany()
     * 
     * // Get first 10 GymPhotos
     * const gymPhotos = await prisma.gymPhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gymPhotoWithIdOnly = await prisma.gymPhoto.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends GymPhotoFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymPhotoFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a GymPhoto.
     * @param {GymPhotoCreateArgs} args - Arguments to create a GymPhoto.
     * @example
     * // Create one GymPhoto
     * const GymPhoto = await prisma.gymPhoto.create({
     *   data: {
     *     // ... data to create a GymPhoto
     *   }
     * })
     * 
    **/
    create<T extends GymPhotoCreateArgs<ExtArgs>>(
      args: SelectSubset<T, GymPhotoCreateArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many GymPhotos.
     *     @param {GymPhotoCreateManyArgs} args - Arguments to create many GymPhotos.
     *     @example
     *     // Create many GymPhotos
     *     const gymPhoto = await prisma.gymPhoto.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends GymPhotoCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymPhotoCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GymPhoto.
     * @param {GymPhotoDeleteArgs} args - Arguments to delete one GymPhoto.
     * @example
     * // Delete one GymPhoto
     * const GymPhoto = await prisma.gymPhoto.delete({
     *   where: {
     *     // ... filter to delete one GymPhoto
     *   }
     * })
     * 
    **/
    delete<T extends GymPhotoDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, GymPhotoDeleteArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one GymPhoto.
     * @param {GymPhotoUpdateArgs} args - Arguments to update one GymPhoto.
     * @example
     * // Update one GymPhoto
     * const gymPhoto = await prisma.gymPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends GymPhotoUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, GymPhotoUpdateArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more GymPhotos.
     * @param {GymPhotoDeleteManyArgs} args - Arguments to filter GymPhotos to delete.
     * @example
     * // Delete a few GymPhotos
     * const { count } = await prisma.gymPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends GymPhotoDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, GymPhotoDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GymPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GymPhotos
     * const gymPhoto = await prisma.gymPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends GymPhotoUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, GymPhotoUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GymPhoto.
     * @param {GymPhotoUpsertArgs} args - Arguments to update or create a GymPhoto.
     * @example
     * // Update or create a GymPhoto
     * const gymPhoto = await prisma.gymPhoto.upsert({
     *   create: {
     *     // ... data to create a GymPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GymPhoto we want to update
     *   }
     * })
    **/
    upsert<T extends GymPhotoUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, GymPhotoUpsertArgs<ExtArgs>>
    ): Prisma__GymPhotoClient<$Types.GetResult<GymPhotoPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of GymPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoCountArgs} args - Arguments to filter GymPhotos to count.
     * @example
     * // Count the number of GymPhotos
     * const count = await prisma.gymPhoto.count({
     *   where: {
     *     // ... the filter for the GymPhotos we want to count
     *   }
     * })
    **/
    count<T extends GymPhotoCountArgs>(
      args?: Subset<T, GymPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GymPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GymPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GymPhotoAggregateArgs>(args: Subset<T, GymPhotoAggregateArgs>): Prisma.PrismaPromise<GetGymPhotoAggregateType<T>>

    /**
     * Group by GymPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GymPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GymPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GymPhotoGroupByArgs['orderBy'] }
        : { orderBy?: GymPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GymPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGymPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for GymPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__GymPhotoClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    gym<T extends GymArgs<ExtArgs> = {}>(args?: Subset<T, GymArgs<ExtArgs>>): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * GymPhoto base type for findUnique actions
   */
  export type GymPhotoFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter, which GymPhoto to fetch.
     */
    where: GymPhotoWhereUniqueInput
  }

  /**
   * GymPhoto findUnique
   */
  export interface GymPhotoFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends GymPhotoFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * GymPhoto findUniqueOrThrow
   */
  export type GymPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter, which GymPhoto to fetch.
     */
    where: GymPhotoWhereUniqueInput
  }


  /**
   * GymPhoto base type for findFirst actions
   */
  export type GymPhotoFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter, which GymPhoto to fetch.
     */
    where?: GymPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GymPhotos to fetch.
     */
    orderBy?: Enumerable<GymPhotoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GymPhotos.
     */
    cursor?: GymPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GymPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GymPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GymPhotos.
     */
    distinct?: Enumerable<GymPhotoScalarFieldEnum>
  }

  /**
   * GymPhoto findFirst
   */
  export interface GymPhotoFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends GymPhotoFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * GymPhoto findFirstOrThrow
   */
  export type GymPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter, which GymPhoto to fetch.
     */
    where?: GymPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GymPhotos to fetch.
     */
    orderBy?: Enumerable<GymPhotoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GymPhotos.
     */
    cursor?: GymPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GymPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GymPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GymPhotos.
     */
    distinct?: Enumerable<GymPhotoScalarFieldEnum>
  }


  /**
   * GymPhoto findMany
   */
  export type GymPhotoFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter, which GymPhotos to fetch.
     */
    where?: GymPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GymPhotos to fetch.
     */
    orderBy?: Enumerable<GymPhotoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GymPhotos.
     */
    cursor?: GymPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GymPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GymPhotos.
     */
    skip?: number
    distinct?: Enumerable<GymPhotoScalarFieldEnum>
  }


  /**
   * GymPhoto create
   */
  export type GymPhotoCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a GymPhoto.
     */
    data: XOR<GymPhotoCreateInput, GymPhotoUncheckedCreateInput>
  }


  /**
   * GymPhoto createMany
   */
  export type GymPhotoCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GymPhotos.
     */
    data: Enumerable<GymPhotoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * GymPhoto update
   */
  export type GymPhotoUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a GymPhoto.
     */
    data: XOR<GymPhotoUpdateInput, GymPhotoUncheckedUpdateInput>
    /**
     * Choose, which GymPhoto to update.
     */
    where: GymPhotoWhereUniqueInput
  }


  /**
   * GymPhoto updateMany
   */
  export type GymPhotoUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GymPhotos.
     */
    data: XOR<GymPhotoUpdateManyMutationInput, GymPhotoUncheckedUpdateManyInput>
    /**
     * Filter which GymPhotos to update
     */
    where?: GymPhotoWhereInput
  }


  /**
   * GymPhoto upsert
   */
  export type GymPhotoUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the GymPhoto to update in case it exists.
     */
    where: GymPhotoWhereUniqueInput
    /**
     * In case the GymPhoto found by the `where` argument doesn't exist, create a new GymPhoto with this data.
     */
    create: XOR<GymPhotoCreateInput, GymPhotoUncheckedCreateInput>
    /**
     * In case the GymPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GymPhotoUpdateInput, GymPhotoUncheckedUpdateInput>
  }


  /**
   * GymPhoto delete
   */
  export type GymPhotoDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
    /**
     * Filter which GymPhoto to delete.
     */
    where: GymPhotoWhereUniqueInput
  }


  /**
   * GymPhoto deleteMany
   */
  export type GymPhotoDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which GymPhotos to delete
     */
    where?: GymPhotoWhereInput
  }


  /**
   * GymPhoto without action
   */
  export type GymPhotoArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GymPhoto
     */
    select?: GymPhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GymPhotoInclude<ExtArgs> | null
  }



  /**
   * Model CheckIn
   */


  export type AggregateCheckIn = {
    _count: CheckInCountAggregateOutputType | null
    _min: CheckInMinAggregateOutputType | null
    _max: CheckInMaxAggregateOutputType | null
  }

  export type CheckInMinAggregateOutputType = {
    id: string | null
    userId: string | null
    gymId: string | null
    checkedInAt: Date | null
    qrJti: string | null
    createdAt: Date | null
  }

  export type CheckInMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    gymId: string | null
    checkedInAt: Date | null
    qrJti: string | null
    createdAt: Date | null
  }

  export type CheckInCountAggregateOutputType = {
    id: number
    userId: number
    gymId: number
    checkedInAt: number
    qrJti: number
    createdAt: number
    _all: number
  }


  export type CheckInMinAggregateInputType = {
    id?: true
    userId?: true
    gymId?: true
    checkedInAt?: true
    qrJti?: true
    createdAt?: true
  }

  export type CheckInMaxAggregateInputType = {
    id?: true
    userId?: true
    gymId?: true
    checkedInAt?: true
    qrJti?: true
    createdAt?: true
  }

  export type CheckInCountAggregateInputType = {
    id?: true
    userId?: true
    gymId?: true
    checkedInAt?: true
    qrJti?: true
    createdAt?: true
    _all?: true
  }

  export type CheckInAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CheckIn to aggregate.
     */
    where?: CheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckIns to fetch.
     */
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CheckIns
    **/
    _count?: true | CheckInCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CheckInMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CheckInMaxAggregateInputType
  }

  export type GetCheckInAggregateType<T extends CheckInAggregateArgs> = {
        [P in keyof T & keyof AggregateCheckIn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCheckIn[P]>
      : GetScalarType<T[P], AggregateCheckIn[P]>
  }




  export type CheckInGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CheckInWhereInput
    orderBy?: Enumerable<CheckInOrderByWithAggregationInput>
    by: CheckInScalarFieldEnum[]
    having?: CheckInScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CheckInCountAggregateInputType | true
    _min?: CheckInMinAggregateInputType
    _max?: CheckInMaxAggregateInputType
  }


  export type CheckInGroupByOutputType = {
    id: string
    userId: string
    gymId: string
    checkedInAt: Date
    qrJti: string | null
    createdAt: Date
    _count: CheckInCountAggregateOutputType | null
    _min: CheckInMinAggregateOutputType | null
    _max: CheckInMaxAggregateOutputType | null
  }

  type GetCheckInGroupByPayload<T extends CheckInGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<CheckInGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CheckInGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CheckInGroupByOutputType[P]>
            : GetScalarType<T[P], CheckInGroupByOutputType[P]>
        }
      >
    >


  export type CheckInSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gymId?: boolean
    checkedInAt?: boolean
    qrJti?: boolean
    createdAt?: boolean
    user?: boolean | UserArgs<ExtArgs>
    gym?: boolean | GymArgs<ExtArgs>
  }, ExtArgs["result"]["checkIn"]>

  export type CheckInSelectScalar = {
    id?: boolean
    userId?: boolean
    gymId?: boolean
    checkedInAt?: boolean
    qrJti?: boolean
    createdAt?: boolean
  }

  export type CheckInInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    user?: boolean | UserArgs<ExtArgs>
    gym?: boolean | GymArgs<ExtArgs>
  }


  type CheckInGetPayload<S extends boolean | null | undefined | CheckInArgs> = $Types.GetResult<CheckInPayload, S>

  type CheckInCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<CheckInFindManyArgs, 'select' | 'include'> & {
      select?: CheckInCountAggregateInputType | true
    }

  export interface CheckInDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CheckIn'], meta: { name: 'CheckIn' } }
    /**
     * Find zero or one CheckIn that matches the filter.
     * @param {CheckInFindUniqueArgs} args - Arguments to find a CheckIn
     * @example
     * // Get one CheckIn
     * const checkIn = await prisma.checkIn.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CheckInFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, CheckInFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'CheckIn'> extends True ? Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one CheckIn that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {CheckInFindUniqueOrThrowArgs} args - Arguments to find a CheckIn
     * @example
     * // Get one CheckIn
     * const checkIn = await prisma.checkIn.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CheckInFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CheckInFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first CheckIn that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInFindFirstArgs} args - Arguments to find a CheckIn
     * @example
     * // Get one CheckIn
     * const checkIn = await prisma.checkIn.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CheckInFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, CheckInFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'CheckIn'> extends True ? Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first CheckIn that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInFindFirstOrThrowArgs} args - Arguments to find a CheckIn
     * @example
     * // Get one CheckIn
     * const checkIn = await prisma.checkIn.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CheckInFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CheckInFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more CheckIns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CheckIns
     * const checkIns = await prisma.checkIn.findMany()
     * 
     * // Get first 10 CheckIns
     * const checkIns = await prisma.checkIn.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const checkInWithIdOnly = await prisma.checkIn.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CheckInFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CheckInFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a CheckIn.
     * @param {CheckInCreateArgs} args - Arguments to create a CheckIn.
     * @example
     * // Create one CheckIn
     * const CheckIn = await prisma.checkIn.create({
     *   data: {
     *     // ... data to create a CheckIn
     *   }
     * })
     * 
    **/
    create<T extends CheckInCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CheckInCreateArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many CheckIns.
     *     @param {CheckInCreateManyArgs} args - Arguments to create many CheckIns.
     *     @example
     *     // Create many CheckIns
     *     const checkIn = await prisma.checkIn.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CheckInCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CheckInCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CheckIn.
     * @param {CheckInDeleteArgs} args - Arguments to delete one CheckIn.
     * @example
     * // Delete one CheckIn
     * const CheckIn = await prisma.checkIn.delete({
     *   where: {
     *     // ... filter to delete one CheckIn
     *   }
     * })
     * 
    **/
    delete<T extends CheckInDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CheckInDeleteArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one CheckIn.
     * @param {CheckInUpdateArgs} args - Arguments to update one CheckIn.
     * @example
     * // Update one CheckIn
     * const checkIn = await prisma.checkIn.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CheckInUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CheckInUpdateArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more CheckIns.
     * @param {CheckInDeleteManyArgs} args - Arguments to filter CheckIns to delete.
     * @example
     * // Delete a few CheckIns
     * const { count } = await prisma.checkIn.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CheckInDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CheckInDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CheckIns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CheckIns
     * const checkIn = await prisma.checkIn.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CheckInUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CheckInUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CheckIn.
     * @param {CheckInUpsertArgs} args - Arguments to update or create a CheckIn.
     * @example
     * // Update or create a CheckIn
     * const checkIn = await prisma.checkIn.upsert({
     *   create: {
     *     // ... data to create a CheckIn
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CheckIn we want to update
     *   }
     * })
    **/
    upsert<T extends CheckInUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CheckInUpsertArgs<ExtArgs>>
    ): Prisma__CheckInClient<$Types.GetResult<CheckInPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of CheckIns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInCountArgs} args - Arguments to filter CheckIns to count.
     * @example
     * // Count the number of CheckIns
     * const count = await prisma.checkIn.count({
     *   where: {
     *     // ... the filter for the CheckIns we want to count
     *   }
     * })
    **/
    count<T extends CheckInCountArgs>(
      args?: Subset<T, CheckInCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CheckInCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CheckIn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CheckInAggregateArgs>(args: Subset<T, CheckInAggregateArgs>): Prisma.PrismaPromise<GetCheckInAggregateType<T>>

    /**
     * Group by CheckIn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CheckInGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CheckInGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CheckInGroupByArgs['orderBy'] }
        : { orderBy?: CheckInGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CheckInGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCheckInGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for CheckIn.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__CheckInClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user<T extends UserArgs<ExtArgs> = {}>(args?: Subset<T, UserArgs<ExtArgs>>): Prisma__UserClient<$Types.GetResult<UserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    gym<T extends GymArgs<ExtArgs> = {}>(args?: Subset<T, GymArgs<ExtArgs>>): Prisma__GymClient<$Types.GetResult<GymPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * CheckIn base type for findUnique actions
   */
  export type CheckInFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter, which CheckIn to fetch.
     */
    where: CheckInWhereUniqueInput
  }

  /**
   * CheckIn findUnique
   */
  export interface CheckInFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CheckInFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CheckIn findUniqueOrThrow
   */
  export type CheckInFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter, which CheckIn to fetch.
     */
    where: CheckInWhereUniqueInput
  }


  /**
   * CheckIn base type for findFirst actions
   */
  export type CheckInFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter, which CheckIn to fetch.
     */
    where?: CheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckIns to fetch.
     */
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CheckIns.
     */
    cursor?: CheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CheckIns.
     */
    distinct?: Enumerable<CheckInScalarFieldEnum>
  }

  /**
   * CheckIn findFirst
   */
  export interface CheckInFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CheckInFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CheckIn findFirstOrThrow
   */
  export type CheckInFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter, which CheckIn to fetch.
     */
    where?: CheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckIns to fetch.
     */
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CheckIns.
     */
    cursor?: CheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckIns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CheckIns.
     */
    distinct?: Enumerable<CheckInScalarFieldEnum>
  }


  /**
   * CheckIn findMany
   */
  export type CheckInFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter, which CheckIns to fetch.
     */
    where?: CheckInWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CheckIns to fetch.
     */
    orderBy?: Enumerable<CheckInOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CheckIns.
     */
    cursor?: CheckInWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CheckIns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CheckIns.
     */
    skip?: number
    distinct?: Enumerable<CheckInScalarFieldEnum>
  }


  /**
   * CheckIn create
   */
  export type CheckInCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * The data needed to create a CheckIn.
     */
    data: XOR<CheckInCreateInput, CheckInUncheckedCreateInput>
  }


  /**
   * CheckIn createMany
   */
  export type CheckInCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CheckIns.
     */
    data: Enumerable<CheckInCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * CheckIn update
   */
  export type CheckInUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * The data needed to update a CheckIn.
     */
    data: XOR<CheckInUpdateInput, CheckInUncheckedUpdateInput>
    /**
     * Choose, which CheckIn to update.
     */
    where: CheckInWhereUniqueInput
  }


  /**
   * CheckIn updateMany
   */
  export type CheckInUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CheckIns.
     */
    data: XOR<CheckInUpdateManyMutationInput, CheckInUncheckedUpdateManyInput>
    /**
     * Filter which CheckIns to update
     */
    where?: CheckInWhereInput
  }


  /**
   * CheckIn upsert
   */
  export type CheckInUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * The filter to search for the CheckIn to update in case it exists.
     */
    where: CheckInWhereUniqueInput
    /**
     * In case the CheckIn found by the `where` argument doesn't exist, create a new CheckIn with this data.
     */
    create: XOR<CheckInCreateInput, CheckInUncheckedCreateInput>
    /**
     * In case the CheckIn was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CheckInUpdateInput, CheckInUncheckedUpdateInput>
  }


  /**
   * CheckIn delete
   */
  export type CheckInDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
    /**
     * Filter which CheckIn to delete.
     */
    where: CheckInWhereUniqueInput
  }


  /**
   * CheckIn deleteMany
   */
  export type CheckInDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CheckIns to delete
     */
    where?: CheckInWhereInput
  }


  /**
   * CheckIn without action
   */
  export type CheckInArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CheckIn
     */
    select?: CheckInSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CheckInInclude<ExtArgs> | null
  }



  /**
   * Model QrJtiUsage
   */


  export type AggregateQrJtiUsage = {
    _count: QrJtiUsageCountAggregateOutputType | null
    _min: QrJtiUsageMinAggregateOutputType | null
    _max: QrJtiUsageMaxAggregateOutputType | null
  }

  export type QrJtiUsageMinAggregateOutputType = {
    id: string | null
    jti: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type QrJtiUsageMaxAggregateOutputType = {
    id: string | null
    jti: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type QrJtiUsageCountAggregateOutputType = {
    id: number
    jti: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type QrJtiUsageMinAggregateInputType = {
    id?: true
    jti?: true
    createdAt?: true
    expiresAt?: true
  }

  export type QrJtiUsageMaxAggregateInputType = {
    id?: true
    jti?: true
    createdAt?: true
    expiresAt?: true
  }

  export type QrJtiUsageCountAggregateInputType = {
    id?: true
    jti?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type QrJtiUsageAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrJtiUsage to aggregate.
     */
    where?: QrJtiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrJtiUsages to fetch.
     */
    orderBy?: Enumerable<QrJtiUsageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QrJtiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrJtiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrJtiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QrJtiUsages
    **/
    _count?: true | QrJtiUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QrJtiUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QrJtiUsageMaxAggregateInputType
  }

  export type GetQrJtiUsageAggregateType<T extends QrJtiUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateQrJtiUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQrJtiUsage[P]>
      : GetScalarType<T[P], AggregateQrJtiUsage[P]>
  }




  export type QrJtiUsageGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: QrJtiUsageWhereInput
    orderBy?: Enumerable<QrJtiUsageOrderByWithAggregationInput>
    by: QrJtiUsageScalarFieldEnum[]
    having?: QrJtiUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QrJtiUsageCountAggregateInputType | true
    _min?: QrJtiUsageMinAggregateInputType
    _max?: QrJtiUsageMaxAggregateInputType
  }


  export type QrJtiUsageGroupByOutputType = {
    id: string
    jti: string
    createdAt: Date
    expiresAt: Date
    _count: QrJtiUsageCountAggregateOutputType | null
    _min: QrJtiUsageMinAggregateOutputType | null
    _max: QrJtiUsageMaxAggregateOutputType | null
  }

  type GetQrJtiUsageGroupByPayload<T extends QrJtiUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<QrJtiUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QrJtiUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QrJtiUsageGroupByOutputType[P]>
            : GetScalarType<T[P], QrJtiUsageGroupByOutputType[P]>
        }
      >
    >


  export type QrJtiUsageSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jti?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["qrJtiUsage"]>

  export type QrJtiUsageSelectScalar = {
    id?: boolean
    jti?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }


  type QrJtiUsageGetPayload<S extends boolean | null | undefined | QrJtiUsageArgs> = $Types.GetResult<QrJtiUsagePayload, S>

  type QrJtiUsageCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<QrJtiUsageFindManyArgs, 'select' | 'include'> & {
      select?: QrJtiUsageCountAggregateInputType | true
    }

  export interface QrJtiUsageDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QrJtiUsage'], meta: { name: 'QrJtiUsage' } }
    /**
     * Find zero or one QrJtiUsage that matches the filter.
     * @param {QrJtiUsageFindUniqueArgs} args - Arguments to find a QrJtiUsage
     * @example
     * // Get one QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends QrJtiUsageFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, QrJtiUsageFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'QrJtiUsage'> extends True ? Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one QrJtiUsage that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {QrJtiUsageFindUniqueOrThrowArgs} args - Arguments to find a QrJtiUsage
     * @example
     * // Get one QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends QrJtiUsageFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, QrJtiUsageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first QrJtiUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageFindFirstArgs} args - Arguments to find a QrJtiUsage
     * @example
     * // Get one QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends QrJtiUsageFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, QrJtiUsageFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'QrJtiUsage'> extends True ? Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first QrJtiUsage that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageFindFirstOrThrowArgs} args - Arguments to find a QrJtiUsage
     * @example
     * // Get one QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends QrJtiUsageFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, QrJtiUsageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more QrJtiUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QrJtiUsages
     * const qrJtiUsages = await prisma.qrJtiUsage.findMany()
     * 
     * // Get first 10 QrJtiUsages
     * const qrJtiUsages = await prisma.qrJtiUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qrJtiUsageWithIdOnly = await prisma.qrJtiUsage.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends QrJtiUsageFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, QrJtiUsageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a QrJtiUsage.
     * @param {QrJtiUsageCreateArgs} args - Arguments to create a QrJtiUsage.
     * @example
     * // Create one QrJtiUsage
     * const QrJtiUsage = await prisma.qrJtiUsage.create({
     *   data: {
     *     // ... data to create a QrJtiUsage
     *   }
     * })
     * 
    **/
    create<T extends QrJtiUsageCreateArgs<ExtArgs>>(
      args: SelectSubset<T, QrJtiUsageCreateArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many QrJtiUsages.
     *     @param {QrJtiUsageCreateManyArgs} args - Arguments to create many QrJtiUsages.
     *     @example
     *     // Create many QrJtiUsages
     *     const qrJtiUsage = await prisma.qrJtiUsage.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends QrJtiUsageCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, QrJtiUsageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a QrJtiUsage.
     * @param {QrJtiUsageDeleteArgs} args - Arguments to delete one QrJtiUsage.
     * @example
     * // Delete one QrJtiUsage
     * const QrJtiUsage = await prisma.qrJtiUsage.delete({
     *   where: {
     *     // ... filter to delete one QrJtiUsage
     *   }
     * })
     * 
    **/
    delete<T extends QrJtiUsageDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, QrJtiUsageDeleteArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one QrJtiUsage.
     * @param {QrJtiUsageUpdateArgs} args - Arguments to update one QrJtiUsage.
     * @example
     * // Update one QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends QrJtiUsageUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, QrJtiUsageUpdateArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more QrJtiUsages.
     * @param {QrJtiUsageDeleteManyArgs} args - Arguments to filter QrJtiUsages to delete.
     * @example
     * // Delete a few QrJtiUsages
     * const { count } = await prisma.qrJtiUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends QrJtiUsageDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, QrJtiUsageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrJtiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QrJtiUsages
     * const qrJtiUsage = await prisma.qrJtiUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends QrJtiUsageUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, QrJtiUsageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QrJtiUsage.
     * @param {QrJtiUsageUpsertArgs} args - Arguments to update or create a QrJtiUsage.
     * @example
     * // Update or create a QrJtiUsage
     * const qrJtiUsage = await prisma.qrJtiUsage.upsert({
     *   create: {
     *     // ... data to create a QrJtiUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QrJtiUsage we want to update
     *   }
     * })
    **/
    upsert<T extends QrJtiUsageUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, QrJtiUsageUpsertArgs<ExtArgs>>
    ): Prisma__QrJtiUsageClient<$Types.GetResult<QrJtiUsagePayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of QrJtiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageCountArgs} args - Arguments to filter QrJtiUsages to count.
     * @example
     * // Count the number of QrJtiUsages
     * const count = await prisma.qrJtiUsage.count({
     *   where: {
     *     // ... the filter for the QrJtiUsages we want to count
     *   }
     * })
    **/
    count<T extends QrJtiUsageCountArgs>(
      args?: Subset<T, QrJtiUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QrJtiUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QrJtiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QrJtiUsageAggregateArgs>(args: Subset<T, QrJtiUsageAggregateArgs>): Prisma.PrismaPromise<GetQrJtiUsageAggregateType<T>>

    /**
     * Group by QrJtiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrJtiUsageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QrJtiUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QrJtiUsageGroupByArgs['orderBy'] }
        : { orderBy?: QrJtiUsageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QrJtiUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQrJtiUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for QrJtiUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__QrJtiUsageClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * QrJtiUsage base type for findUnique actions
   */
  export type QrJtiUsageFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter, which QrJtiUsage to fetch.
     */
    where: QrJtiUsageWhereUniqueInput
  }

  /**
   * QrJtiUsage findUnique
   */
  export interface QrJtiUsageFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends QrJtiUsageFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * QrJtiUsage findUniqueOrThrow
   */
  export type QrJtiUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter, which QrJtiUsage to fetch.
     */
    where: QrJtiUsageWhereUniqueInput
  }


  /**
   * QrJtiUsage base type for findFirst actions
   */
  export type QrJtiUsageFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter, which QrJtiUsage to fetch.
     */
    where?: QrJtiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrJtiUsages to fetch.
     */
    orderBy?: Enumerable<QrJtiUsageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrJtiUsages.
     */
    cursor?: QrJtiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrJtiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrJtiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrJtiUsages.
     */
    distinct?: Enumerable<QrJtiUsageScalarFieldEnum>
  }

  /**
   * QrJtiUsage findFirst
   */
  export interface QrJtiUsageFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends QrJtiUsageFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * QrJtiUsage findFirstOrThrow
   */
  export type QrJtiUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter, which QrJtiUsage to fetch.
     */
    where?: QrJtiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrJtiUsages to fetch.
     */
    orderBy?: Enumerable<QrJtiUsageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrJtiUsages.
     */
    cursor?: QrJtiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrJtiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrJtiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrJtiUsages.
     */
    distinct?: Enumerable<QrJtiUsageScalarFieldEnum>
  }


  /**
   * QrJtiUsage findMany
   */
  export type QrJtiUsageFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter, which QrJtiUsages to fetch.
     */
    where?: QrJtiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrJtiUsages to fetch.
     */
    orderBy?: Enumerable<QrJtiUsageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QrJtiUsages.
     */
    cursor?: QrJtiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrJtiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrJtiUsages.
     */
    skip?: number
    distinct?: Enumerable<QrJtiUsageScalarFieldEnum>
  }


  /**
   * QrJtiUsage create
   */
  export type QrJtiUsageCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * The data needed to create a QrJtiUsage.
     */
    data: XOR<QrJtiUsageCreateInput, QrJtiUsageUncheckedCreateInput>
  }


  /**
   * QrJtiUsage createMany
   */
  export type QrJtiUsageCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QrJtiUsages.
     */
    data: Enumerable<QrJtiUsageCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * QrJtiUsage update
   */
  export type QrJtiUsageUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * The data needed to update a QrJtiUsage.
     */
    data: XOR<QrJtiUsageUpdateInput, QrJtiUsageUncheckedUpdateInput>
    /**
     * Choose, which QrJtiUsage to update.
     */
    where: QrJtiUsageWhereUniqueInput
  }


  /**
   * QrJtiUsage updateMany
   */
  export type QrJtiUsageUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QrJtiUsages.
     */
    data: XOR<QrJtiUsageUpdateManyMutationInput, QrJtiUsageUncheckedUpdateManyInput>
    /**
     * Filter which QrJtiUsages to update
     */
    where?: QrJtiUsageWhereInput
  }


  /**
   * QrJtiUsage upsert
   */
  export type QrJtiUsageUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * The filter to search for the QrJtiUsage to update in case it exists.
     */
    where: QrJtiUsageWhereUniqueInput
    /**
     * In case the QrJtiUsage found by the `where` argument doesn't exist, create a new QrJtiUsage with this data.
     */
    create: XOR<QrJtiUsageCreateInput, QrJtiUsageUncheckedCreateInput>
    /**
     * In case the QrJtiUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QrJtiUsageUpdateInput, QrJtiUsageUncheckedUpdateInput>
  }


  /**
   * QrJtiUsage delete
   */
  export type QrJtiUsageDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
    /**
     * Filter which QrJtiUsage to delete.
     */
    where: QrJtiUsageWhereUniqueInput
  }


  /**
   * QrJtiUsage deleteMany
   */
  export type QrJtiUsageDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrJtiUsages to delete
     */
    where?: QrJtiUsageWhereInput
  }


  /**
   * QrJtiUsage without action
   */
  export type QrJtiUsageArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrJtiUsage
     */
    select?: QrJtiUsageSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    otpHash: 'otpHash',
    otpExpiresAt: 'otpExpiresAt',
    otpAttempts: 'otpAttempts'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SubscriptionTierScalarFieldEnum: {
    id: 'id',
    name: 'name',
    accessTier: 'accessTier',
    createdAt: 'createdAt'
  };

  export type SubscriptionTierScalarFieldEnum = (typeof SubscriptionTierScalarFieldEnum)[keyof typeof SubscriptionTierScalarFieldEnum]


  export const SubscriptionPriceScalarFieldEnum: {
    id: 'id',
    tierId: 'tierId',
    stripePriceId: 'stripePriceId',
    interval: 'interval',
    priceCents: 'priceCents',
    createdAt: 'createdAt'
  };

  export type SubscriptionPriceScalarFieldEnum = (typeof SubscriptionPriceScalarFieldEnum)[keyof typeof SubscriptionPriceScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tierId: 'tierId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    stripePriceId: 'stripePriceId',
    status: 'status',
    startAt: 'startAt',
    endAt: 'endAt',
    createdAt: 'createdAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    subscriptionId: 'subscriptionId',
    amountCents: 'amountCents',
    currency: 'currency',
    stripePaymentIntent: 'stripePaymentIntent',
    status: 'status',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const GymScalarFieldEnum: {
    id: 'id',
    name: 'name',
    addressLine: 'addressLine',
    city: 'city',
    latitude: 'latitude',
    longitude: 'longitude',
    openingTime: 'openingTime',
    closingTime: 'closingTime',
    is24Hours: 'is24Hours',
    tier: 'tier',
    coverImageUrl: 'coverImageUrl',
    status: 'status',
    ownerId: 'ownerId',
    createdAt: 'createdAt'
  };

  export type GymScalarFieldEnum = (typeof GymScalarFieldEnum)[keyof typeof GymScalarFieldEnum]


  export const GymPhotoScalarFieldEnum: {
    id: 'id',
    gymId: 'gymId',
    url: 'url',
    createdAt: 'createdAt'
  };

  export type GymPhotoScalarFieldEnum = (typeof GymPhotoScalarFieldEnum)[keyof typeof GymPhotoScalarFieldEnum]


  export const CheckInScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    gymId: 'gymId',
    checkedInAt: 'checkedInAt',
    qrJti: 'qrJti',
    createdAt: 'createdAt'
  };

  export type CheckInScalarFieldEnum = (typeof CheckInScalarFieldEnum)[keyof typeof CheckInScalarFieldEnum]


  export const QrJtiUsageScalarFieldEnum: {
    id: 'id',
    jti: 'jti',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type QrJtiUsageScalarFieldEnum = (typeof QrJtiUsageScalarFieldEnum)[keyof typeof QrJtiUsageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    email?: StringFilter | string
    passwordHash?: StringFilter | string
    role?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    otpHash?: StringNullableFilter | string | null
    otpExpiresAt?: DateTimeNullableFilter | Date | string | null
    otpAttempts?: IntNullableFilter | number | null
    subscriptions?: SubscriptionListRelationFilter
    payments?: PaymentListRelationFilter
    checkIns?: CheckInListRelationFilter
    gymsOwned?: GymListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    otpHash?: SortOrderInput | SortOrder
    otpExpiresAt?: SortOrderInput | SortOrder
    otpAttempts?: SortOrderInput | SortOrder
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    checkIns?: CheckInOrderByRelationAggregateInput
    gymsOwned?: GymOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = {
    id?: string
    email?: string
  }

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    otpHash?: SortOrderInput | SortOrder
    otpExpiresAt?: SortOrderInput | SortOrder
    otpAttempts?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    passwordHash?: StringWithAggregatesFilter | string
    role?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    otpHash?: StringNullableWithAggregatesFilter | string | null
    otpExpiresAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    otpAttempts?: IntNullableWithAggregatesFilter | number | null
  }

  export type SubscriptionTierWhereInput = {
    AND?: Enumerable<SubscriptionTierWhereInput>
    OR?: Enumerable<SubscriptionTierWhereInput>
    NOT?: Enumerable<SubscriptionTierWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    accessTier?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    prices?: SubscriptionPriceListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
  }

  export type SubscriptionTierOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    accessTier?: SortOrder
    createdAt?: SortOrder
    prices?: SubscriptionPriceOrderByRelationAggregateInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
  }

  export type SubscriptionTierWhereUniqueInput = {
    id?: string
  }

  export type SubscriptionTierOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    accessTier?: SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionTierCountOrderByAggregateInput
    _avg?: SubscriptionTierAvgOrderByAggregateInput
    _max?: SubscriptionTierMaxOrderByAggregateInput
    _min?: SubscriptionTierMinOrderByAggregateInput
    _sum?: SubscriptionTierSumOrderByAggregateInput
  }

  export type SubscriptionTierScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SubscriptionTierScalarWhereWithAggregatesInput>
    OR?: Enumerable<SubscriptionTierScalarWhereWithAggregatesInput>
    NOT?: Enumerable<SubscriptionTierScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    accessTier?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type SubscriptionPriceWhereInput = {
    AND?: Enumerable<SubscriptionPriceWhereInput>
    OR?: Enumerable<SubscriptionPriceWhereInput>
    NOT?: Enumerable<SubscriptionPriceWhereInput>
    id?: StringFilter | string
    tierId?: StringFilter | string
    stripePriceId?: StringFilter | string
    interval?: StringFilter | string
    priceCents?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    tier?: XOR<SubscriptionTierRelationFilter, SubscriptionTierWhereInput>
  }

  export type SubscriptionPriceOrderByWithRelationInput = {
    id?: SortOrder
    tierId?: SortOrder
    stripePriceId?: SortOrder
    interval?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    tier?: SubscriptionTierOrderByWithRelationInput
  }

  export type SubscriptionPriceWhereUniqueInput = {
    id?: string
    stripePriceId?: string
  }

  export type SubscriptionPriceOrderByWithAggregationInput = {
    id?: SortOrder
    tierId?: SortOrder
    stripePriceId?: SortOrder
    interval?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionPriceCountOrderByAggregateInput
    _avg?: SubscriptionPriceAvgOrderByAggregateInput
    _max?: SubscriptionPriceMaxOrderByAggregateInput
    _min?: SubscriptionPriceMinOrderByAggregateInput
    _sum?: SubscriptionPriceSumOrderByAggregateInput
  }

  export type SubscriptionPriceScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SubscriptionPriceScalarWhereWithAggregatesInput>
    OR?: Enumerable<SubscriptionPriceScalarWhereWithAggregatesInput>
    NOT?: Enumerable<SubscriptionPriceScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tierId?: StringWithAggregatesFilter | string
    stripePriceId?: StringWithAggregatesFilter | string
    interval?: StringWithAggregatesFilter | string
    priceCents?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: Enumerable<SubscriptionWhereInput>
    OR?: Enumerable<SubscriptionWhereInput>
    NOT?: Enumerable<SubscriptionWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    tierId?: StringFilter | string
    stripeSubscriptionId?: StringFilter | string
    stripePriceId?: StringFilter | string
    status?: StringFilter | string
    startAt?: DateTimeNullableFilter | Date | string | null
    endAt?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    tier?: XOR<SubscriptionTierRelationFilter, SubscriptionTierWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tierId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    startAt?: SortOrderInput | SortOrder
    endAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    tier?: SubscriptionTierOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type SubscriptionWhereUniqueInput = {
    id?: string
    stripeSubscriptionId?: string
  }

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tierId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    startAt?: SortOrderInput | SortOrder
    endAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>
    OR?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<SubscriptionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    userId?: StringWithAggregatesFilter | string
    tierId?: StringWithAggregatesFilter | string
    stripeSubscriptionId?: StringWithAggregatesFilter | string
    stripePriceId?: StringWithAggregatesFilter | string
    status?: StringWithAggregatesFilter | string
    startAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    endAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type PaymentWhereInput = {
    AND?: Enumerable<PaymentWhereInput>
    OR?: Enumerable<PaymentWhereInput>
    NOT?: Enumerable<PaymentWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    subscriptionId?: StringNullableFilter | string | null
    amountCents?: IntFilter | number
    currency?: StringFilter | string
    stripePaymentIntent?: StringNullableFilter | string | null
    status?: StringFilter | string
    metadata?: JsonNullableFilter
    createdAt?: DateTimeFilter | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    subscription?: XOR<SubscriptionRelationFilter, SubscriptionWhereInput> | null
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    stripePaymentIntent?: SortOrderInput | SortOrder
    status?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    subscription?: SubscriptionOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = {
    id?: string
  }

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    stripePaymentIntent?: SortOrderInput | SortOrder
    status?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PaymentScalarWhereWithAggregatesInput>
    OR?: Enumerable<PaymentScalarWhereWithAggregatesInput>
    NOT?: Enumerable<PaymentScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    userId?: StringWithAggregatesFilter | string
    subscriptionId?: StringNullableWithAggregatesFilter | string | null
    amountCents?: IntWithAggregatesFilter | number
    currency?: StringWithAggregatesFilter | string
    stripePaymentIntent?: StringNullableWithAggregatesFilter | string | null
    status?: StringWithAggregatesFilter | string
    metadata?: JsonNullableWithAggregatesFilter
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type GymWhereInput = {
    AND?: Enumerable<GymWhereInput>
    OR?: Enumerable<GymWhereInput>
    NOT?: Enumerable<GymWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    addressLine?: StringFilter | string
    city?: StringFilter | string
    latitude?: FloatFilter | number
    longitude?: FloatFilter | number
    openingTime?: StringNullableFilter | string | null
    closingTime?: StringNullableFilter | string | null
    is24Hours?: BoolFilter | boolean
    tier?: IntFilter | number
    coverImageUrl?: StringNullableFilter | string | null
    status?: StringFilter | string
    ownerId?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    owner?: XOR<UserRelationFilter, UserWhereInput> | null
    checkIns?: CheckInListRelationFilter
    photos?: GymPhotoListRelationFilter
  }

  export type GymOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    addressLine?: SortOrder
    city?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    openingTime?: SortOrderInput | SortOrder
    closingTime?: SortOrderInput | SortOrder
    is24Hours?: SortOrder
    tier?: SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    checkIns?: CheckInOrderByRelationAggregateInput
    photos?: GymPhotoOrderByRelationAggregateInput
  }

  export type GymWhereUniqueInput = {
    id?: string
  }

  export type GymOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    addressLine?: SortOrder
    city?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    openingTime?: SortOrderInput | SortOrder
    closingTime?: SortOrderInput | SortOrder
    is24Hours?: SortOrder
    tier?: SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GymCountOrderByAggregateInput
    _avg?: GymAvgOrderByAggregateInput
    _max?: GymMaxOrderByAggregateInput
    _min?: GymMinOrderByAggregateInput
    _sum?: GymSumOrderByAggregateInput
  }

  export type GymScalarWhereWithAggregatesInput = {
    AND?: Enumerable<GymScalarWhereWithAggregatesInput>
    OR?: Enumerable<GymScalarWhereWithAggregatesInput>
    NOT?: Enumerable<GymScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    addressLine?: StringWithAggregatesFilter | string
    city?: StringWithAggregatesFilter | string
    latitude?: FloatWithAggregatesFilter | number
    longitude?: FloatWithAggregatesFilter | number
    openingTime?: StringNullableWithAggregatesFilter | string | null
    closingTime?: StringNullableWithAggregatesFilter | string | null
    is24Hours?: BoolWithAggregatesFilter | boolean
    tier?: IntWithAggregatesFilter | number
    coverImageUrl?: StringNullableWithAggregatesFilter | string | null
    status?: StringWithAggregatesFilter | string
    ownerId?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type GymPhotoWhereInput = {
    AND?: Enumerable<GymPhotoWhereInput>
    OR?: Enumerable<GymPhotoWhereInput>
    NOT?: Enumerable<GymPhotoWhereInput>
    id?: StringFilter | string
    gymId?: StringFilter | string
    url?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    gym?: XOR<GymRelationFilter, GymWhereInput>
  }

  export type GymPhotoOrderByWithRelationInput = {
    id?: SortOrder
    gymId?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    gym?: GymOrderByWithRelationInput
  }

  export type GymPhotoWhereUniqueInput = {
    id?: string
  }

  export type GymPhotoOrderByWithAggregationInput = {
    id?: SortOrder
    gymId?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    _count?: GymPhotoCountOrderByAggregateInput
    _max?: GymPhotoMaxOrderByAggregateInput
    _min?: GymPhotoMinOrderByAggregateInput
  }

  export type GymPhotoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<GymPhotoScalarWhereWithAggregatesInput>
    OR?: Enumerable<GymPhotoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<GymPhotoScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    gymId?: StringWithAggregatesFilter | string
    url?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type CheckInWhereInput = {
    AND?: Enumerable<CheckInWhereInput>
    OR?: Enumerable<CheckInWhereInput>
    NOT?: Enumerable<CheckInWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    gymId?: StringFilter | string
    checkedInAt?: DateTimeFilter | Date | string
    qrJti?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    gym?: XOR<GymRelationFilter, GymWhereInput>
  }

  export type CheckInOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    gymId?: SortOrder
    checkedInAt?: SortOrder
    qrJti?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    gym?: GymOrderByWithRelationInput
  }

  export type CheckInWhereUniqueInput = {
    id?: string
  }

  export type CheckInOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    gymId?: SortOrder
    checkedInAt?: SortOrder
    qrJti?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CheckInCountOrderByAggregateInput
    _max?: CheckInMaxOrderByAggregateInput
    _min?: CheckInMinOrderByAggregateInput
  }

  export type CheckInScalarWhereWithAggregatesInput = {
    AND?: Enumerable<CheckInScalarWhereWithAggregatesInput>
    OR?: Enumerable<CheckInScalarWhereWithAggregatesInput>
    NOT?: Enumerable<CheckInScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    userId?: StringWithAggregatesFilter | string
    gymId?: StringWithAggregatesFilter | string
    checkedInAt?: DateTimeWithAggregatesFilter | Date | string
    qrJti?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type QrJtiUsageWhereInput = {
    AND?: Enumerable<QrJtiUsageWhereInput>
    OR?: Enumerable<QrJtiUsageWhereInput>
    NOT?: Enumerable<QrJtiUsageWhereInput>
    id?: StringFilter | string
    jti?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    expiresAt?: DateTimeFilter | Date | string
  }

  export type QrJtiUsageOrderByWithRelationInput = {
    id?: SortOrder
    jti?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type QrJtiUsageWhereUniqueInput = {
    id?: string
    jti?: string
  }

  export type QrJtiUsageOrderByWithAggregationInput = {
    id?: SortOrder
    jti?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: QrJtiUsageCountOrderByAggregateInput
    _max?: QrJtiUsageMaxOrderByAggregateInput
    _min?: QrJtiUsageMinOrderByAggregateInput
  }

  export type QrJtiUsageScalarWhereWithAggregatesInput = {
    AND?: Enumerable<QrJtiUsageScalarWhereWithAggregatesInput>
    OR?: Enumerable<QrJtiUsageScalarWhereWithAggregatesInput>
    NOT?: Enumerable<QrJtiUsageScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    jti?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    expiresAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    checkIns?: CheckInCreateNestedManyWithoutUserInput
    gymsOwned?: GymCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    checkIns?: CheckInUncheckedCreateNestedManyWithoutUserInput
    gymsOwned?: GymUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUncheckedUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SubscriptionTierCreateInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    prices?: SubscriptionPriceCreateNestedManyWithoutTierInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierUncheckedCreateInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    prices?: SubscriptionPriceUncheckedCreateNestedManyWithoutTierInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: SubscriptionPriceUpdateManyWithoutTierNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTierNestedInput
  }

  export type SubscriptionTierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: SubscriptionPriceUncheckedUpdateManyWithoutTierNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTierNestedInput
  }

  export type SubscriptionTierCreateManyInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
  }

  export type SubscriptionTierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionTierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceCreateInput = {
    id?: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
    tier: SubscriptionTierCreateNestedOneWithoutPricesInput
  }

  export type SubscriptionPriceUncheckedCreateInput = {
    id?: string
    tierId: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
  }

  export type SubscriptionPriceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tier?: SubscriptionTierUpdateOneRequiredWithoutPricesNestedInput
  }

  export type SubscriptionPriceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceCreateManyInput = {
    id?: string
    tierId: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
  }

  export type SubscriptionPriceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionsInput
    tier: SubscriptionTierCreateNestedOneWithoutSubscriptionsInput
    payments?: PaymentCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
    tier?: SubscriptionTierUpdateOneRequiredWithoutSubscriptionsNestedInput
    payments?: PaymentUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPaymentsInput
    subscription?: SubscriptionCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    userId: string
    subscriptionId?: string | null
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
    subscription?: SubscriptionUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    userId: string
    subscriptionId?: string | null
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymCreateInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
    owner?: UserCreateNestedOneWithoutGymsOwnedInput
    checkIns?: CheckInCreateNestedManyWithoutGymInput
    photos?: GymPhotoCreateNestedManyWithoutGymInput
  }

  export type GymUncheckedCreateInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    ownerId?: string | null
    createdAt?: Date | string
    checkIns?: CheckInUncheckedCreateNestedManyWithoutGymInput
    photos?: GymPhotoUncheckedCreateNestedManyWithoutGymInput
  }

  export type GymUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutGymsOwnedNestedInput
    checkIns?: CheckInUpdateManyWithoutGymNestedInput
    photos?: GymPhotoUpdateManyWithoutGymNestedInput
  }

  export type GymUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIns?: CheckInUncheckedUpdateManyWithoutGymNestedInput
    photos?: GymPhotoUncheckedUpdateManyWithoutGymNestedInput
  }

  export type GymCreateManyInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    ownerId?: string | null
    createdAt?: Date | string
  }

  export type GymUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoCreateInput = {
    id?: string
    url: string
    createdAt?: Date | string
    gym: GymCreateNestedOneWithoutPhotosInput
  }

  export type GymPhotoUncheckedCreateInput = {
    id?: string
    gymId: string
    url: string
    createdAt?: Date | string
  }

  export type GymPhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gym?: GymUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type GymPhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoCreateManyInput = {
    id?: string
    gymId: string
    url: string
    createdAt?: Date | string
  }

  export type GymPhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInCreateInput = {
    id?: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCheckInsInput
    gym: GymCreateNestedOneWithoutCheckInsInput
  }

  export type CheckInUncheckedCreateInput = {
    id?: string
    userId: string
    gymId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type CheckInUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCheckInsNestedInput
    gym?: GymUpdateOneRequiredWithoutCheckInsNestedInput
  }

  export type CheckInUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInCreateManyInput = {
    id?: string
    userId: string
    gymId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type CheckInUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrJtiUsageCreateInput = {
    id?: string
    jti: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type QrJtiUsageUncheckedCreateInput = {
    id?: string
    jti: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type QrJtiUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrJtiUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrJtiUsageCreateManyInput = {
    id?: string
    jti: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type QrJtiUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrJtiUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jti?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type CheckInListRelationFilter = {
    every?: CheckInWhereInput
    some?: CheckInWhereInput
    none?: CheckInWhereInput
  }

  export type GymListRelationFilter = {
    every?: GymWhereInput
    some?: GymWhereInput
    none?: GymWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CheckInOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GymOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    otpAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    otpHash?: SortOrder
    otpExpiresAt?: SortOrder
    otpAttempts?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    otpAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type SubscriptionPriceListRelationFilter = {
    every?: SubscriptionPriceWhereInput
    some?: SubscriptionPriceWhereInput
    none?: SubscriptionPriceWhereInput
  }

  export type SubscriptionPriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionTierCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessTier?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionTierAvgOrderByAggregateInput = {
    accessTier?: SortOrder
  }

  export type SubscriptionTierMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessTier?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionTierMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accessTier?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionTierSumOrderByAggregateInput = {
    accessTier?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type SubscriptionTierRelationFilter = {
    is?: SubscriptionTierWhereInput | null
    isNot?: SubscriptionTierWhereInput | null
  }

  export type SubscriptionPriceCountOrderByAggregateInput = {
    id?: SortOrder
    tierId?: SortOrder
    stripePriceId?: SortOrder
    interval?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPriceAvgOrderByAggregateInput = {
    priceCents?: SortOrder
  }

  export type SubscriptionPriceMaxOrderByAggregateInput = {
    id?: SortOrder
    tierId?: SortOrder
    stripePriceId?: SortOrder
    interval?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPriceMinOrderByAggregateInput = {
    id?: SortOrder
    tierId?: SortOrder
    stripePriceId?: SortOrder
    interval?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionPriceSumOrderByAggregateInput = {
    priceCents?: SortOrder
  }

  export type UserRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tierId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tierId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tierId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type SubscriptionRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subscriptionId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    stripePaymentIntent?: SortOrder
    status?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amountCents?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subscriptionId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    stripePaymentIntent?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subscriptionId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    stripePaymentIntent?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amountCents?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type GymPhotoListRelationFilter = {
    every?: GymPhotoWhereInput
    some?: GymPhotoWhereInput
    none?: GymPhotoWhereInput
  }

  export type GymPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GymCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    addressLine?: SortOrder
    city?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    is24Hours?: SortOrder
    tier?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type GymAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    tier?: SortOrder
  }

  export type GymMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    addressLine?: SortOrder
    city?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    is24Hours?: SortOrder
    tier?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type GymMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    addressLine?: SortOrder
    city?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    is24Hours?: SortOrder
    tier?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type GymSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    tier?: SortOrder
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type GymRelationFilter = {
    is?: GymWhereInput | null
    isNot?: GymWhereInput | null
  }

  export type GymPhotoCountOrderByAggregateInput = {
    id?: SortOrder
    gymId?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type GymPhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    gymId?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type GymPhotoMinOrderByAggregateInput = {
    id?: SortOrder
    gymId?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckInCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gymId?: SortOrder
    checkedInAt?: SortOrder
    qrJti?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckInMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gymId?: SortOrder
    checkedInAt?: SortOrder
    qrJti?: SortOrder
    createdAt?: SortOrder
  }

  export type CheckInMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gymId?: SortOrder
    checkedInAt?: SortOrder
    qrJti?: SortOrder
    createdAt?: SortOrder
  }

  export type QrJtiUsageCountOrderByAggregateInput = {
    id?: SortOrder
    jti?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type QrJtiUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    jti?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type QrJtiUsageMinOrderByAggregateInput = {
    id?: SortOrder
    jti?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutUserInput>, Enumerable<SubscriptionUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutUserInput>
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: Enumerable<SubscriptionWhereUniqueInput>
  }

  export type PaymentCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutUserInput>, Enumerable<PaymentUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutUserInput>
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: Enumerable<PaymentWhereUniqueInput>
  }

  export type CheckInCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutUserInput>, Enumerable<CheckInUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutUserInput>
    createMany?: CheckInCreateManyUserInputEnvelope
    connect?: Enumerable<CheckInWhereUniqueInput>
  }

  export type GymCreateNestedManyWithoutOwnerInput = {
    create?: XOR<Enumerable<GymCreateWithoutOwnerInput>, Enumerable<GymUncheckedCreateWithoutOwnerInput>>
    connectOrCreate?: Enumerable<GymCreateOrConnectWithoutOwnerInput>
    createMany?: GymCreateManyOwnerInputEnvelope
    connect?: Enumerable<GymWhereUniqueInput>
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutUserInput>, Enumerable<SubscriptionUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutUserInput>
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: Enumerable<SubscriptionWhereUniqueInput>
  }

  export type PaymentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutUserInput>, Enumerable<PaymentUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutUserInput>
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: Enumerable<PaymentWhereUniqueInput>
  }

  export type CheckInUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutUserInput>, Enumerable<CheckInUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutUserInput>
    createMany?: CheckInCreateManyUserInputEnvelope
    connect?: Enumerable<CheckInWhereUniqueInput>
  }

  export type GymUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<Enumerable<GymCreateWithoutOwnerInput>, Enumerable<GymUncheckedCreateWithoutOwnerInput>>
    connectOrCreate?: Enumerable<GymCreateOrConnectWithoutOwnerInput>
    createMany?: GymCreateManyOwnerInputEnvelope
    connect?: Enumerable<GymWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutUserInput>, Enumerable<SubscriptionUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutUserInput>
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: Enumerable<SubscriptionWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>
    delete?: Enumerable<SubscriptionWhereUniqueInput>
    connect?: Enumerable<SubscriptionWhereUniqueInput>
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>
  }

  export type PaymentUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutUserInput>, Enumerable<PaymentUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<PaymentUpsertWithWhereUniqueWithoutUserInput>
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: Enumerable<PaymentWhereUniqueInput>
    disconnect?: Enumerable<PaymentWhereUniqueInput>
    delete?: Enumerable<PaymentWhereUniqueInput>
    connect?: Enumerable<PaymentWhereUniqueInput>
    update?: Enumerable<PaymentUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<PaymentUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<PaymentScalarWhereInput>
  }

  export type CheckInUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutUserInput>, Enumerable<CheckInUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<CheckInUpsertWithWhereUniqueWithoutUserInput>
    createMany?: CheckInCreateManyUserInputEnvelope
    set?: Enumerable<CheckInWhereUniqueInput>
    disconnect?: Enumerable<CheckInWhereUniqueInput>
    delete?: Enumerable<CheckInWhereUniqueInput>
    connect?: Enumerable<CheckInWhereUniqueInput>
    update?: Enumerable<CheckInUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<CheckInUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<CheckInScalarWhereInput>
  }

  export type GymUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<Enumerable<GymCreateWithoutOwnerInput>, Enumerable<GymUncheckedCreateWithoutOwnerInput>>
    connectOrCreate?: Enumerable<GymCreateOrConnectWithoutOwnerInput>
    upsert?: Enumerable<GymUpsertWithWhereUniqueWithoutOwnerInput>
    createMany?: GymCreateManyOwnerInputEnvelope
    set?: Enumerable<GymWhereUniqueInput>
    disconnect?: Enumerable<GymWhereUniqueInput>
    delete?: Enumerable<GymWhereUniqueInput>
    connect?: Enumerable<GymWhereUniqueInput>
    update?: Enumerable<GymUpdateWithWhereUniqueWithoutOwnerInput>
    updateMany?: Enumerable<GymUpdateManyWithWhereWithoutOwnerInput>
    deleteMany?: Enumerable<GymScalarWhereInput>
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutUserInput>, Enumerable<SubscriptionUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutUserInput>
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: Enumerable<SubscriptionWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>
    delete?: Enumerable<SubscriptionWhereUniqueInput>
    connect?: Enumerable<SubscriptionWhereUniqueInput>
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>
  }

  export type PaymentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutUserInput>, Enumerable<PaymentUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<PaymentUpsertWithWhereUniqueWithoutUserInput>
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: Enumerable<PaymentWhereUniqueInput>
    disconnect?: Enumerable<PaymentWhereUniqueInput>
    delete?: Enumerable<PaymentWhereUniqueInput>
    connect?: Enumerable<PaymentWhereUniqueInput>
    update?: Enumerable<PaymentUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<PaymentUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<PaymentScalarWhereInput>
  }

  export type CheckInUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutUserInput>, Enumerable<CheckInUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<CheckInUpsertWithWhereUniqueWithoutUserInput>
    createMany?: CheckInCreateManyUserInputEnvelope
    set?: Enumerable<CheckInWhereUniqueInput>
    disconnect?: Enumerable<CheckInWhereUniqueInput>
    delete?: Enumerable<CheckInWhereUniqueInput>
    connect?: Enumerable<CheckInWhereUniqueInput>
    update?: Enumerable<CheckInUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<CheckInUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<CheckInScalarWhereInput>
  }

  export type GymUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<Enumerable<GymCreateWithoutOwnerInput>, Enumerable<GymUncheckedCreateWithoutOwnerInput>>
    connectOrCreate?: Enumerable<GymCreateOrConnectWithoutOwnerInput>
    upsert?: Enumerable<GymUpsertWithWhereUniqueWithoutOwnerInput>
    createMany?: GymCreateManyOwnerInputEnvelope
    set?: Enumerable<GymWhereUniqueInput>
    disconnect?: Enumerable<GymWhereUniqueInput>
    delete?: Enumerable<GymWhereUniqueInput>
    connect?: Enumerable<GymWhereUniqueInput>
    update?: Enumerable<GymUpdateWithWhereUniqueWithoutOwnerInput>
    updateMany?: Enumerable<GymUpdateManyWithWhereWithoutOwnerInput>
    deleteMany?: Enumerable<GymScalarWhereInput>
  }

  export type SubscriptionPriceCreateNestedManyWithoutTierInput = {
    create?: XOR<Enumerable<SubscriptionPriceCreateWithoutTierInput>, Enumerable<SubscriptionPriceUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionPriceCreateOrConnectWithoutTierInput>
    createMany?: SubscriptionPriceCreateManyTierInputEnvelope
    connect?: Enumerable<SubscriptionPriceWhereUniqueInput>
  }

  export type SubscriptionCreateNestedManyWithoutTierInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutTierInput>, Enumerable<SubscriptionUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTierInput>
    createMany?: SubscriptionCreateManyTierInputEnvelope
    connect?: Enumerable<SubscriptionWhereUniqueInput>
  }

  export type SubscriptionPriceUncheckedCreateNestedManyWithoutTierInput = {
    create?: XOR<Enumerable<SubscriptionPriceCreateWithoutTierInput>, Enumerable<SubscriptionPriceUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionPriceCreateOrConnectWithoutTierInput>
    createMany?: SubscriptionPriceCreateManyTierInputEnvelope
    connect?: Enumerable<SubscriptionPriceWhereUniqueInput>
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutTierInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutTierInput>, Enumerable<SubscriptionUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTierInput>
    createMany?: SubscriptionCreateManyTierInputEnvelope
    connect?: Enumerable<SubscriptionWhereUniqueInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SubscriptionPriceUpdateManyWithoutTierNestedInput = {
    create?: XOR<Enumerable<SubscriptionPriceCreateWithoutTierInput>, Enumerable<SubscriptionPriceUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionPriceCreateOrConnectWithoutTierInput>
    upsert?: Enumerable<SubscriptionPriceUpsertWithWhereUniqueWithoutTierInput>
    createMany?: SubscriptionPriceCreateManyTierInputEnvelope
    set?: Enumerable<SubscriptionPriceWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionPriceWhereUniqueInput>
    delete?: Enumerable<SubscriptionPriceWhereUniqueInput>
    connect?: Enumerable<SubscriptionPriceWhereUniqueInput>
    update?: Enumerable<SubscriptionPriceUpdateWithWhereUniqueWithoutTierInput>
    updateMany?: Enumerable<SubscriptionPriceUpdateManyWithWhereWithoutTierInput>
    deleteMany?: Enumerable<SubscriptionPriceScalarWhereInput>
  }

  export type SubscriptionUpdateManyWithoutTierNestedInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutTierInput>, Enumerable<SubscriptionUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTierInput>
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutTierInput>
    createMany?: SubscriptionCreateManyTierInputEnvelope
    set?: Enumerable<SubscriptionWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>
    delete?: Enumerable<SubscriptionWhereUniqueInput>
    connect?: Enumerable<SubscriptionWhereUniqueInput>
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutTierInput>
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutTierInput>
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>
  }

  export type SubscriptionPriceUncheckedUpdateManyWithoutTierNestedInput = {
    create?: XOR<Enumerable<SubscriptionPriceCreateWithoutTierInput>, Enumerable<SubscriptionPriceUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionPriceCreateOrConnectWithoutTierInput>
    upsert?: Enumerable<SubscriptionPriceUpsertWithWhereUniqueWithoutTierInput>
    createMany?: SubscriptionPriceCreateManyTierInputEnvelope
    set?: Enumerable<SubscriptionPriceWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionPriceWhereUniqueInput>
    delete?: Enumerable<SubscriptionPriceWhereUniqueInput>
    connect?: Enumerable<SubscriptionPriceWhereUniqueInput>
    update?: Enumerable<SubscriptionPriceUpdateWithWhereUniqueWithoutTierInput>
    updateMany?: Enumerable<SubscriptionPriceUpdateManyWithWhereWithoutTierInput>
    deleteMany?: Enumerable<SubscriptionPriceScalarWhereInput>
  }

  export type SubscriptionUncheckedUpdateManyWithoutTierNestedInput = {
    create?: XOR<Enumerable<SubscriptionCreateWithoutTierInput>, Enumerable<SubscriptionUncheckedCreateWithoutTierInput>>
    connectOrCreate?: Enumerable<SubscriptionCreateOrConnectWithoutTierInput>
    upsert?: Enumerable<SubscriptionUpsertWithWhereUniqueWithoutTierInput>
    createMany?: SubscriptionCreateManyTierInputEnvelope
    set?: Enumerable<SubscriptionWhereUniqueInput>
    disconnect?: Enumerable<SubscriptionWhereUniqueInput>
    delete?: Enumerable<SubscriptionWhereUniqueInput>
    connect?: Enumerable<SubscriptionWhereUniqueInput>
    update?: Enumerable<SubscriptionUpdateWithWhereUniqueWithoutTierInput>
    updateMany?: Enumerable<SubscriptionUpdateManyWithWhereWithoutTierInput>
    deleteMany?: Enumerable<SubscriptionScalarWhereInput>
  }

  export type SubscriptionTierCreateNestedOneWithoutPricesInput = {
    create?: XOR<SubscriptionTierCreateWithoutPricesInput, SubscriptionTierUncheckedCreateWithoutPricesInput>
    connectOrCreate?: SubscriptionTierCreateOrConnectWithoutPricesInput
    connect?: SubscriptionTierWhereUniqueInput
  }

  export type SubscriptionTierUpdateOneRequiredWithoutPricesNestedInput = {
    create?: XOR<SubscriptionTierCreateWithoutPricesInput, SubscriptionTierUncheckedCreateWithoutPricesInput>
    connectOrCreate?: SubscriptionTierCreateOrConnectWithoutPricesInput
    upsert?: SubscriptionTierUpsertWithoutPricesInput
    connect?: SubscriptionTierWhereUniqueInput
    update?: XOR<SubscriptionTierUpdateWithoutPricesInput, SubscriptionTierUncheckedUpdateWithoutPricesInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type SubscriptionTierCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<SubscriptionTierCreateWithoutSubscriptionsInput, SubscriptionTierUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionTierCreateOrConnectWithoutSubscriptionsInput
    connect?: SubscriptionTierWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutSubscriptionInput>, Enumerable<PaymentUncheckedCreateWithoutSubscriptionInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutSubscriptionInput>
    createMany?: PaymentCreateManySubscriptionInputEnvelope
    connect?: Enumerable<PaymentWhereUniqueInput>
  }

  export type PaymentUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutSubscriptionInput>, Enumerable<PaymentUncheckedCreateWithoutSubscriptionInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutSubscriptionInput>
    createMany?: PaymentCreateManySubscriptionInputEnvelope
    connect?: Enumerable<PaymentWhereUniqueInput>
  }

  export type UserUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    upsert?: UserUpsertWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type SubscriptionTierUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<SubscriptionTierCreateWithoutSubscriptionsInput, SubscriptionTierUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionTierCreateOrConnectWithoutSubscriptionsInput
    upsert?: SubscriptionTierUpsertWithoutSubscriptionsInput
    connect?: SubscriptionTierWhereUniqueInput
    update?: XOR<SubscriptionTierUpdateWithoutSubscriptionsInput, SubscriptionTierUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type PaymentUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutSubscriptionInput>, Enumerable<PaymentUncheckedCreateWithoutSubscriptionInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutSubscriptionInput>
    upsert?: Enumerable<PaymentUpsertWithWhereUniqueWithoutSubscriptionInput>
    createMany?: PaymentCreateManySubscriptionInputEnvelope
    set?: Enumerable<PaymentWhereUniqueInput>
    disconnect?: Enumerable<PaymentWhereUniqueInput>
    delete?: Enumerable<PaymentWhereUniqueInput>
    connect?: Enumerable<PaymentWhereUniqueInput>
    update?: Enumerable<PaymentUpdateWithWhereUniqueWithoutSubscriptionInput>
    updateMany?: Enumerable<PaymentUpdateManyWithWhereWithoutSubscriptionInput>
    deleteMany?: Enumerable<PaymentScalarWhereInput>
  }

  export type PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<Enumerable<PaymentCreateWithoutSubscriptionInput>, Enumerable<PaymentUncheckedCreateWithoutSubscriptionInput>>
    connectOrCreate?: Enumerable<PaymentCreateOrConnectWithoutSubscriptionInput>
    upsert?: Enumerable<PaymentUpsertWithWhereUniqueWithoutSubscriptionInput>
    createMany?: PaymentCreateManySubscriptionInputEnvelope
    set?: Enumerable<PaymentWhereUniqueInput>
    disconnect?: Enumerable<PaymentWhereUniqueInput>
    delete?: Enumerable<PaymentWhereUniqueInput>
    connect?: Enumerable<PaymentWhereUniqueInput>
    update?: Enumerable<PaymentUpdateWithWhereUniqueWithoutSubscriptionInput>
    updateMany?: Enumerable<PaymentUpdateManyWithWhereWithoutSubscriptionInput>
    deleteMany?: Enumerable<PaymentScalarWhereInput>
  }

  export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type SubscriptionCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<SubscriptionCreateWithoutPaymentsInput, SubscriptionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPaymentsInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    upsert?: UserUpsertWithoutPaymentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type SubscriptionUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPaymentsInput, SubscriptionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPaymentsInput
    upsert?: SubscriptionUpsertWithoutPaymentsInput
    disconnect?: boolean
    delete?: boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<SubscriptionUpdateWithoutPaymentsInput, SubscriptionUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserCreateNestedOneWithoutGymsOwnedInput = {
    create?: XOR<UserCreateWithoutGymsOwnedInput, UserUncheckedCreateWithoutGymsOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutGymsOwnedInput
    connect?: UserWhereUniqueInput
  }

  export type CheckInCreateNestedManyWithoutGymInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutGymInput>, Enumerable<CheckInUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutGymInput>
    createMany?: CheckInCreateManyGymInputEnvelope
    connect?: Enumerable<CheckInWhereUniqueInput>
  }

  export type GymPhotoCreateNestedManyWithoutGymInput = {
    create?: XOR<Enumerable<GymPhotoCreateWithoutGymInput>, Enumerable<GymPhotoUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<GymPhotoCreateOrConnectWithoutGymInput>
    createMany?: GymPhotoCreateManyGymInputEnvelope
    connect?: Enumerable<GymPhotoWhereUniqueInput>
  }

  export type CheckInUncheckedCreateNestedManyWithoutGymInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutGymInput>, Enumerable<CheckInUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutGymInput>
    createMany?: CheckInCreateManyGymInputEnvelope
    connect?: Enumerable<CheckInWhereUniqueInput>
  }

  export type GymPhotoUncheckedCreateNestedManyWithoutGymInput = {
    create?: XOR<Enumerable<GymPhotoCreateWithoutGymInput>, Enumerable<GymPhotoUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<GymPhotoCreateOrConnectWithoutGymInput>
    createMany?: GymPhotoCreateManyGymInputEnvelope
    connect?: Enumerable<GymPhotoWhereUniqueInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutGymsOwnedNestedInput = {
    create?: XOR<UserCreateWithoutGymsOwnedInput, UserUncheckedCreateWithoutGymsOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutGymsOwnedInput
    upsert?: UserUpsertWithoutGymsOwnedInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutGymsOwnedInput, UserUncheckedUpdateWithoutGymsOwnedInput>
  }

  export type CheckInUpdateManyWithoutGymNestedInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutGymInput>, Enumerable<CheckInUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutGymInput>
    upsert?: Enumerable<CheckInUpsertWithWhereUniqueWithoutGymInput>
    createMany?: CheckInCreateManyGymInputEnvelope
    set?: Enumerable<CheckInWhereUniqueInput>
    disconnect?: Enumerable<CheckInWhereUniqueInput>
    delete?: Enumerable<CheckInWhereUniqueInput>
    connect?: Enumerable<CheckInWhereUniqueInput>
    update?: Enumerable<CheckInUpdateWithWhereUniqueWithoutGymInput>
    updateMany?: Enumerable<CheckInUpdateManyWithWhereWithoutGymInput>
    deleteMany?: Enumerable<CheckInScalarWhereInput>
  }

  export type GymPhotoUpdateManyWithoutGymNestedInput = {
    create?: XOR<Enumerable<GymPhotoCreateWithoutGymInput>, Enumerable<GymPhotoUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<GymPhotoCreateOrConnectWithoutGymInput>
    upsert?: Enumerable<GymPhotoUpsertWithWhereUniqueWithoutGymInput>
    createMany?: GymPhotoCreateManyGymInputEnvelope
    set?: Enumerable<GymPhotoWhereUniqueInput>
    disconnect?: Enumerable<GymPhotoWhereUniqueInput>
    delete?: Enumerable<GymPhotoWhereUniqueInput>
    connect?: Enumerable<GymPhotoWhereUniqueInput>
    update?: Enumerable<GymPhotoUpdateWithWhereUniqueWithoutGymInput>
    updateMany?: Enumerable<GymPhotoUpdateManyWithWhereWithoutGymInput>
    deleteMany?: Enumerable<GymPhotoScalarWhereInput>
  }

  export type CheckInUncheckedUpdateManyWithoutGymNestedInput = {
    create?: XOR<Enumerable<CheckInCreateWithoutGymInput>, Enumerable<CheckInUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<CheckInCreateOrConnectWithoutGymInput>
    upsert?: Enumerable<CheckInUpsertWithWhereUniqueWithoutGymInput>
    createMany?: CheckInCreateManyGymInputEnvelope
    set?: Enumerable<CheckInWhereUniqueInput>
    disconnect?: Enumerable<CheckInWhereUniqueInput>
    delete?: Enumerable<CheckInWhereUniqueInput>
    connect?: Enumerable<CheckInWhereUniqueInput>
    update?: Enumerable<CheckInUpdateWithWhereUniqueWithoutGymInput>
    updateMany?: Enumerable<CheckInUpdateManyWithWhereWithoutGymInput>
    deleteMany?: Enumerable<CheckInScalarWhereInput>
  }

  export type GymPhotoUncheckedUpdateManyWithoutGymNestedInput = {
    create?: XOR<Enumerable<GymPhotoCreateWithoutGymInput>, Enumerable<GymPhotoUncheckedCreateWithoutGymInput>>
    connectOrCreate?: Enumerable<GymPhotoCreateOrConnectWithoutGymInput>
    upsert?: Enumerable<GymPhotoUpsertWithWhereUniqueWithoutGymInput>
    createMany?: GymPhotoCreateManyGymInputEnvelope
    set?: Enumerable<GymPhotoWhereUniqueInput>
    disconnect?: Enumerable<GymPhotoWhereUniqueInput>
    delete?: Enumerable<GymPhotoWhereUniqueInput>
    connect?: Enumerable<GymPhotoWhereUniqueInput>
    update?: Enumerable<GymPhotoUpdateWithWhereUniqueWithoutGymInput>
    updateMany?: Enumerable<GymPhotoUpdateManyWithWhereWithoutGymInput>
    deleteMany?: Enumerable<GymPhotoScalarWhereInput>
  }

  export type GymCreateNestedOneWithoutPhotosInput = {
    create?: XOR<GymCreateWithoutPhotosInput, GymUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: GymCreateOrConnectWithoutPhotosInput
    connect?: GymWhereUniqueInput
  }

  export type GymUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<GymCreateWithoutPhotosInput, GymUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: GymCreateOrConnectWithoutPhotosInput
    upsert?: GymUpsertWithoutPhotosInput
    connect?: GymWhereUniqueInput
    update?: XOR<GymUpdateWithoutPhotosInput, GymUncheckedUpdateWithoutPhotosInput>
  }

  export type UserCreateNestedOneWithoutCheckInsInput = {
    create?: XOR<UserCreateWithoutCheckInsInput, UserUncheckedCreateWithoutCheckInsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckInsInput
    connect?: UserWhereUniqueInput
  }

  export type GymCreateNestedOneWithoutCheckInsInput = {
    create?: XOR<GymCreateWithoutCheckInsInput, GymUncheckedCreateWithoutCheckInsInput>
    connectOrCreate?: GymCreateOrConnectWithoutCheckInsInput
    connect?: GymWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCheckInsNestedInput = {
    create?: XOR<UserCreateWithoutCheckInsInput, UserUncheckedCreateWithoutCheckInsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckInsInput
    upsert?: UserUpsertWithoutCheckInsInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutCheckInsInput, UserUncheckedUpdateWithoutCheckInsInput>
  }

  export type GymUpdateOneRequiredWithoutCheckInsNestedInput = {
    create?: XOR<GymCreateWithoutCheckInsInput, GymUncheckedCreateWithoutCheckInsInput>
    connectOrCreate?: GymCreateOrConnectWithoutCheckInsInput
    upsert?: GymUpsertWithoutCheckInsInput
    connect?: GymWhereUniqueInput
    update?: XOR<GymUpdateWithoutCheckInsInput, GymUncheckedUpdateWithoutCheckInsInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    tier: SubscriptionTierCreateNestedOneWithoutSubscriptionsInput
    payments?: PaymentCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: Enumerable<SubscriptionCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutUserInput = {
    id?: string
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    subscription?: SubscriptionCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutUserInput = {
    id?: string
    subscriptionId?: string | null
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutUserInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateManyUserInputEnvelope = {
    data: Enumerable<PaymentCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type CheckInCreateWithoutUserInput = {
    id?: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
    gym: GymCreateNestedOneWithoutCheckInsInput
  }

  export type CheckInUncheckedCreateWithoutUserInput = {
    id?: string
    gymId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type CheckInCreateOrConnectWithoutUserInput = {
    where: CheckInWhereUniqueInput
    create: XOR<CheckInCreateWithoutUserInput, CheckInUncheckedCreateWithoutUserInput>
  }

  export type CheckInCreateManyUserInputEnvelope = {
    data: Enumerable<CheckInCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type GymCreateWithoutOwnerInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
    checkIns?: CheckInCreateNestedManyWithoutGymInput
    photos?: GymPhotoCreateNestedManyWithoutGymInput
  }

  export type GymUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
    checkIns?: CheckInUncheckedCreateNestedManyWithoutGymInput
    photos?: GymPhotoUncheckedCreateNestedManyWithoutGymInput
  }

  export type GymCreateOrConnectWithoutOwnerInput = {
    where: GymWhereUniqueInput
    create: XOR<GymCreateWithoutOwnerInput, GymUncheckedCreateWithoutOwnerInput>
  }

  export type GymCreateManyOwnerInputEnvelope = {
    data: Enumerable<GymCreateManyOwnerInput>
    skipDuplicates?: boolean
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: Enumerable<SubscriptionScalarWhereInput>
    OR?: Enumerable<SubscriptionScalarWhereInput>
    NOT?: Enumerable<SubscriptionScalarWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    tierId?: StringFilter | string
    stripeSubscriptionId?: StringFilter | string
    stripePriceId?: StringFilter | string
    status?: StringFilter | string
    startAt?: DateTimeNullableFilter | Date | string | null
    endAt?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithWhereWithoutUserInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutPaymentsInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: Enumerable<PaymentScalarWhereInput>
    OR?: Enumerable<PaymentScalarWhereInput>
    NOT?: Enumerable<PaymentScalarWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    subscriptionId?: StringNullableFilter | string | null
    amountCents?: IntFilter | number
    currency?: StringFilter | string
    stripePaymentIntent?: StringNullableFilter | string | null
    status?: StringFilter | string
    metadata?: JsonNullableFilter
    createdAt?: DateTimeFilter | Date | string
  }

  export type CheckInUpsertWithWhereUniqueWithoutUserInput = {
    where: CheckInWhereUniqueInput
    update: XOR<CheckInUpdateWithoutUserInput, CheckInUncheckedUpdateWithoutUserInput>
    create: XOR<CheckInCreateWithoutUserInput, CheckInUncheckedCreateWithoutUserInput>
  }

  export type CheckInUpdateWithWhereUniqueWithoutUserInput = {
    where: CheckInWhereUniqueInput
    data: XOR<CheckInUpdateWithoutUserInput, CheckInUncheckedUpdateWithoutUserInput>
  }

  export type CheckInUpdateManyWithWhereWithoutUserInput = {
    where: CheckInScalarWhereInput
    data: XOR<CheckInUpdateManyMutationInput, CheckInUncheckedUpdateManyWithoutCheckInsInput>
  }

  export type CheckInScalarWhereInput = {
    AND?: Enumerable<CheckInScalarWhereInput>
    OR?: Enumerable<CheckInScalarWhereInput>
    NOT?: Enumerable<CheckInScalarWhereInput>
    id?: StringFilter | string
    userId?: StringFilter | string
    gymId?: StringFilter | string
    checkedInAt?: DateTimeFilter | Date | string
    qrJti?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type GymUpsertWithWhereUniqueWithoutOwnerInput = {
    where: GymWhereUniqueInput
    update: XOR<GymUpdateWithoutOwnerInput, GymUncheckedUpdateWithoutOwnerInput>
    create: XOR<GymCreateWithoutOwnerInput, GymUncheckedCreateWithoutOwnerInput>
  }

  export type GymUpdateWithWhereUniqueWithoutOwnerInput = {
    where: GymWhereUniqueInput
    data: XOR<GymUpdateWithoutOwnerInput, GymUncheckedUpdateWithoutOwnerInput>
  }

  export type GymUpdateManyWithWhereWithoutOwnerInput = {
    where: GymScalarWhereInput
    data: XOR<GymUpdateManyMutationInput, GymUncheckedUpdateManyWithoutGymsOwnedInput>
  }

  export type GymScalarWhereInput = {
    AND?: Enumerable<GymScalarWhereInput>
    OR?: Enumerable<GymScalarWhereInput>
    NOT?: Enumerable<GymScalarWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    addressLine?: StringFilter | string
    city?: StringFilter | string
    latitude?: FloatFilter | number
    longitude?: FloatFilter | number
    openingTime?: StringNullableFilter | string | null
    closingTime?: StringNullableFilter | string | null
    is24Hours?: BoolFilter | boolean
    tier?: IntFilter | number
    coverImageUrl?: StringNullableFilter | string | null
    status?: StringFilter | string
    ownerId?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
  }

  export type SubscriptionPriceCreateWithoutTierInput = {
    id?: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
  }

  export type SubscriptionPriceUncheckedCreateWithoutTierInput = {
    id?: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
  }

  export type SubscriptionPriceCreateOrConnectWithoutTierInput = {
    where: SubscriptionPriceWhereUniqueInput
    create: XOR<SubscriptionPriceCreateWithoutTierInput, SubscriptionPriceUncheckedCreateWithoutTierInput>
  }

  export type SubscriptionPriceCreateManyTierInputEnvelope = {
    data: Enumerable<SubscriptionPriceCreateManyTierInput>
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutTierInput = {
    id?: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionsInput
    payments?: PaymentCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutTierInput = {
    id?: string
    userId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionCreateOrConnectWithoutTierInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTierInput, SubscriptionUncheckedCreateWithoutTierInput>
  }

  export type SubscriptionCreateManyTierInputEnvelope = {
    data: Enumerable<SubscriptionCreateManyTierInput>
    skipDuplicates?: boolean
  }

  export type SubscriptionPriceUpsertWithWhereUniqueWithoutTierInput = {
    where: SubscriptionPriceWhereUniqueInput
    update: XOR<SubscriptionPriceUpdateWithoutTierInput, SubscriptionPriceUncheckedUpdateWithoutTierInput>
    create: XOR<SubscriptionPriceCreateWithoutTierInput, SubscriptionPriceUncheckedCreateWithoutTierInput>
  }

  export type SubscriptionPriceUpdateWithWhereUniqueWithoutTierInput = {
    where: SubscriptionPriceWhereUniqueInput
    data: XOR<SubscriptionPriceUpdateWithoutTierInput, SubscriptionPriceUncheckedUpdateWithoutTierInput>
  }

  export type SubscriptionPriceUpdateManyWithWhereWithoutTierInput = {
    where: SubscriptionPriceScalarWhereInput
    data: XOR<SubscriptionPriceUpdateManyMutationInput, SubscriptionPriceUncheckedUpdateManyWithoutPricesInput>
  }

  export type SubscriptionPriceScalarWhereInput = {
    AND?: Enumerable<SubscriptionPriceScalarWhereInput>
    OR?: Enumerable<SubscriptionPriceScalarWhereInput>
    NOT?: Enumerable<SubscriptionPriceScalarWhereInput>
    id?: StringFilter | string
    tierId?: StringFilter | string
    stripePriceId?: StringFilter | string
    interval?: StringFilter | string
    priceCents?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutTierInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutTierInput, SubscriptionUncheckedUpdateWithoutTierInput>
    create: XOR<SubscriptionCreateWithoutTierInput, SubscriptionUncheckedCreateWithoutTierInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutTierInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutTierInput, SubscriptionUncheckedUpdateWithoutTierInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutTierInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput>
  }

  export type SubscriptionTierCreateWithoutPricesInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierUncheckedCreateWithoutPricesInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierCreateOrConnectWithoutPricesInput = {
    where: SubscriptionTierWhereUniqueInput
    create: XOR<SubscriptionTierCreateWithoutPricesInput, SubscriptionTierUncheckedCreateWithoutPricesInput>
  }

  export type SubscriptionTierUpsertWithoutPricesInput = {
    update: XOR<SubscriptionTierUpdateWithoutPricesInput, SubscriptionTierUncheckedUpdateWithoutPricesInput>
    create: XOR<SubscriptionTierCreateWithoutPricesInput, SubscriptionTierUncheckedCreateWithoutPricesInput>
  }

  export type SubscriptionTierUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTierNestedInput
  }

  export type SubscriptionTierUncheckedUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTierNestedInput
  }

  export type UserCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    payments?: PaymentCreateNestedManyWithoutUserInput
    checkIns?: CheckInCreateNestedManyWithoutUserInput
    gymsOwned?: GymCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    checkIns?: CheckInUncheckedCreateNestedManyWithoutUserInput
    gymsOwned?: GymUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutSubscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
  }

  export type SubscriptionTierCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    prices?: SubscriptionPriceCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    accessTier: number
    createdAt?: Date | string
    prices?: SubscriptionPriceUncheckedCreateNestedManyWithoutTierInput
  }

  export type SubscriptionTierCreateOrConnectWithoutSubscriptionsInput = {
    where: SubscriptionTierWhereUniqueInput
    create: XOR<SubscriptionTierCreateWithoutSubscriptionsInput, SubscriptionTierUncheckedCreateWithoutSubscriptionsInput>
  }

  export type PaymentCreateWithoutSubscriptionInput = {
    id?: string
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    userId: string
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutSubscriptionInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutSubscriptionInput, PaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type PaymentCreateManySubscriptionInputEnvelope = {
    data: Enumerable<PaymentCreateManySubscriptionInput>
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSubscriptionsInput = {
    update: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UserUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    payments?: PaymentUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUncheckedUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type SubscriptionTierUpsertWithoutSubscriptionsInput = {
    update: XOR<SubscriptionTierUpdateWithoutSubscriptionsInput, SubscriptionTierUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<SubscriptionTierCreateWithoutSubscriptionsInput, SubscriptionTierUncheckedCreateWithoutSubscriptionsInput>
  }

  export type SubscriptionTierUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: SubscriptionPriceUpdateManyWithoutTierNestedInput
  }

  export type SubscriptionTierUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessTier?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: SubscriptionPriceUncheckedUpdateManyWithoutTierNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutSubscriptionInput, PaymentUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<PaymentCreateWithoutSubscriptionInput, PaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutSubscriptionInput, PaymentUncheckedUpdateWithoutSubscriptionInput>
  }

  export type PaymentUpdateManyWithWhereWithoutSubscriptionInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutPaymentsInput>
  }

  export type UserCreateWithoutPaymentsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    checkIns?: CheckInCreateNestedManyWithoutUserInput
    gymsOwned?: GymCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    checkIns?: CheckInUncheckedCreateNestedManyWithoutUserInput
    gymsOwned?: GymUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
  }

  export type SubscriptionCreateWithoutPaymentsInput = {
    id?: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionsInput
    tier: SubscriptionTierCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateWithoutPaymentsInput = {
    id?: string
    userId: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutPaymentsInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutPaymentsInput, SubscriptionUncheckedCreateWithoutPaymentsInput>
  }

  export type UserUpsertWithoutPaymentsInput = {
    update: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
  }

  export type UserUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUncheckedUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type SubscriptionUpsertWithoutPaymentsInput = {
    update: XOR<SubscriptionUpdateWithoutPaymentsInput, SubscriptionUncheckedUpdateWithoutPaymentsInput>
    create: XOR<SubscriptionCreateWithoutPaymentsInput, SubscriptionUncheckedCreateWithoutPaymentsInput>
  }

  export type SubscriptionUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
    tier?: SubscriptionTierUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutGymsOwnedInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    checkIns?: CheckInCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGymsOwnedInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    checkIns?: CheckInUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGymsOwnedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGymsOwnedInput, UserUncheckedCreateWithoutGymsOwnedInput>
  }

  export type CheckInCreateWithoutGymInput = {
    id?: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCheckInsInput
  }

  export type CheckInUncheckedCreateWithoutGymInput = {
    id?: string
    userId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type CheckInCreateOrConnectWithoutGymInput = {
    where: CheckInWhereUniqueInput
    create: XOR<CheckInCreateWithoutGymInput, CheckInUncheckedCreateWithoutGymInput>
  }

  export type CheckInCreateManyGymInputEnvelope = {
    data: Enumerable<CheckInCreateManyGymInput>
    skipDuplicates?: boolean
  }

  export type GymPhotoCreateWithoutGymInput = {
    id?: string
    url: string
    createdAt?: Date | string
  }

  export type GymPhotoUncheckedCreateWithoutGymInput = {
    id?: string
    url: string
    createdAt?: Date | string
  }

  export type GymPhotoCreateOrConnectWithoutGymInput = {
    where: GymPhotoWhereUniqueInput
    create: XOR<GymPhotoCreateWithoutGymInput, GymPhotoUncheckedCreateWithoutGymInput>
  }

  export type GymPhotoCreateManyGymInputEnvelope = {
    data: Enumerable<GymPhotoCreateManyGymInput>
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGymsOwnedInput = {
    update: XOR<UserUpdateWithoutGymsOwnedInput, UserUncheckedUpdateWithoutGymsOwnedInput>
    create: XOR<UserCreateWithoutGymsOwnedInput, UserUncheckedCreateWithoutGymsOwnedInput>
  }

  export type UserUpdateWithoutGymsOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGymsOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    checkIns?: CheckInUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CheckInUpsertWithWhereUniqueWithoutGymInput = {
    where: CheckInWhereUniqueInput
    update: XOR<CheckInUpdateWithoutGymInput, CheckInUncheckedUpdateWithoutGymInput>
    create: XOR<CheckInCreateWithoutGymInput, CheckInUncheckedCreateWithoutGymInput>
  }

  export type CheckInUpdateWithWhereUniqueWithoutGymInput = {
    where: CheckInWhereUniqueInput
    data: XOR<CheckInUpdateWithoutGymInput, CheckInUncheckedUpdateWithoutGymInput>
  }

  export type CheckInUpdateManyWithWhereWithoutGymInput = {
    where: CheckInScalarWhereInput
    data: XOR<CheckInUpdateManyMutationInput, CheckInUncheckedUpdateManyWithoutCheckInsInput>
  }

  export type GymPhotoUpsertWithWhereUniqueWithoutGymInput = {
    where: GymPhotoWhereUniqueInput
    update: XOR<GymPhotoUpdateWithoutGymInput, GymPhotoUncheckedUpdateWithoutGymInput>
    create: XOR<GymPhotoCreateWithoutGymInput, GymPhotoUncheckedCreateWithoutGymInput>
  }

  export type GymPhotoUpdateWithWhereUniqueWithoutGymInput = {
    where: GymPhotoWhereUniqueInput
    data: XOR<GymPhotoUpdateWithoutGymInput, GymPhotoUncheckedUpdateWithoutGymInput>
  }

  export type GymPhotoUpdateManyWithWhereWithoutGymInput = {
    where: GymPhotoScalarWhereInput
    data: XOR<GymPhotoUpdateManyMutationInput, GymPhotoUncheckedUpdateManyWithoutPhotosInput>
  }

  export type GymPhotoScalarWhereInput = {
    AND?: Enumerable<GymPhotoScalarWhereInput>
    OR?: Enumerable<GymPhotoScalarWhereInput>
    NOT?: Enumerable<GymPhotoScalarWhereInput>
    id?: StringFilter | string
    gymId?: StringFilter | string
    url?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
  }

  export type GymCreateWithoutPhotosInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
    owner?: UserCreateNestedOneWithoutGymsOwnedInput
    checkIns?: CheckInCreateNestedManyWithoutGymInput
  }

  export type GymUncheckedCreateWithoutPhotosInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    ownerId?: string | null
    createdAt?: Date | string
    checkIns?: CheckInUncheckedCreateNestedManyWithoutGymInput
  }

  export type GymCreateOrConnectWithoutPhotosInput = {
    where: GymWhereUniqueInput
    create: XOR<GymCreateWithoutPhotosInput, GymUncheckedCreateWithoutPhotosInput>
  }

  export type GymUpsertWithoutPhotosInput = {
    update: XOR<GymUpdateWithoutPhotosInput, GymUncheckedUpdateWithoutPhotosInput>
    create: XOR<GymCreateWithoutPhotosInput, GymUncheckedCreateWithoutPhotosInput>
  }

  export type GymUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutGymsOwnedNestedInput
    checkIns?: CheckInUpdateManyWithoutGymNestedInput
  }

  export type GymUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIns?: CheckInUncheckedUpdateManyWithoutGymNestedInput
  }

  export type UserCreateWithoutCheckInsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    payments?: PaymentCreateNestedManyWithoutUserInput
    gymsOwned?: GymCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutCheckInsInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role?: string
    createdAt?: Date | string
    otpHash?: string | null
    otpExpiresAt?: Date | string | null
    otpAttempts?: number | null
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    payments?: PaymentUncheckedCreateNestedManyWithoutUserInput
    gymsOwned?: GymUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutCheckInsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCheckInsInput, UserUncheckedCreateWithoutCheckInsInput>
  }

  export type GymCreateWithoutCheckInsInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
    owner?: UserCreateNestedOneWithoutGymsOwnedInput
    photos?: GymPhotoCreateNestedManyWithoutGymInput
  }

  export type GymUncheckedCreateWithoutCheckInsInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    ownerId?: string | null
    createdAt?: Date | string
    photos?: GymPhotoUncheckedCreateNestedManyWithoutGymInput
  }

  export type GymCreateOrConnectWithoutCheckInsInput = {
    where: GymWhereUniqueInput
    create: XOR<GymCreateWithoutCheckInsInput, GymUncheckedCreateWithoutCheckInsInput>
  }

  export type UserUpsertWithoutCheckInsInput = {
    update: XOR<UserUpdateWithoutCheckInsInput, UserUncheckedUpdateWithoutCheckInsInput>
    create: XOR<UserCreateWithoutCheckInsInput, UserUncheckedCreateWithoutCheckInsInput>
  }

  export type UserUpdateWithoutCheckInsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    payments?: PaymentUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutCheckInsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    otpHash?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otpAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    gymsOwned?: GymUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type GymUpsertWithoutCheckInsInput = {
    update: XOR<GymUpdateWithoutCheckInsInput, GymUncheckedUpdateWithoutCheckInsInput>
    create: XOR<GymCreateWithoutCheckInsInput, GymUncheckedCreateWithoutCheckInsInput>
  }

  export type GymUpdateWithoutCheckInsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutGymsOwnedNestedInput
    photos?: GymPhotoUpdateManyWithoutGymNestedInput
  }

  export type GymUncheckedUpdateWithoutCheckInsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: GymPhotoUncheckedUpdateManyWithoutGymNestedInput
  }

  export type SubscriptionCreateManyUserInput = {
    id?: string
    tierId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PaymentCreateManyUserInput = {
    id?: string
    subscriptionId?: string | null
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CheckInCreateManyUserInput = {
    id?: string
    gymId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type GymCreateManyOwnerInput = {
    id?: string
    name: string
    addressLine: string
    city: string
    latitude: number
    longitude: number
    openingTime?: string | null
    closingTime?: string | null
    is24Hours?: boolean
    tier: number
    coverImageUrl?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tier?: SubscriptionTierUpdateOneRequiredWithoutSubscriptionsNestedInput
    payments?: PaymentUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: SubscriptionUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gym?: GymUpdateOneRequiredWithoutCheckInsNestedInput
  }

  export type CheckInUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInUncheckedUpdateManyWithoutCheckInsInput = {
    id?: StringFieldUpdateOperationsInput | string
    gymId?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIns?: CheckInUpdateManyWithoutGymNestedInput
    photos?: GymPhotoUpdateManyWithoutGymNestedInput
  }

  export type GymUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIns?: CheckInUncheckedUpdateManyWithoutGymNestedInput
    photos?: GymPhotoUncheckedUpdateManyWithoutGymNestedInput
  }

  export type GymUncheckedUpdateManyWithoutGymsOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    addressLine?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    openingTime?: NullableStringFieldUpdateOperationsInput | string | null
    closingTime?: NullableStringFieldUpdateOperationsInput | string | null
    is24Hours?: BoolFieldUpdateOperationsInput | boolean
    tier?: IntFieldUpdateOperationsInput | number
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceCreateManyTierInput = {
    id?: string
    stripePriceId: string
    interval: string
    priceCents: number
    createdAt?: Date | string
  }

  export type SubscriptionCreateManyTierInput = {
    id?: string
    userId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: string
    startAt?: Date | string | null
    endAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionPriceUpdateWithoutTierInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceUncheckedUpdateWithoutTierInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPriceUncheckedUpdateManyWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUpdateWithoutTierInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
    payments?: PaymentUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutTierInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeSubscriptionId?: StringFieldUpdateOperationsInput | string
    stripePriceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type PaymentCreateManySubscriptionInput = {
    id?: string
    userId: string
    amountCents: number
    currency: string
    stripePaymentIntent?: string | null
    status: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PaymentUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    stripePaymentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CheckInCreateManyGymInput = {
    id?: string
    userId: string
    checkedInAt?: Date | string
    qrJti?: string | null
    createdAt?: Date | string
  }

  export type GymPhotoCreateManyGymInput = {
    id?: string
    url: string
    createdAt?: Date | string
  }

  export type CheckInUpdateWithoutGymInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCheckInsNestedInput
  }

  export type CheckInUncheckedUpdateWithoutGymInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrJti?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoUpdateWithoutGymInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoUncheckedUpdateWithoutGymInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GymPhotoUncheckedUpdateManyWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}