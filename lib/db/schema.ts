import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  numeric,
  integer,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Better Auth tables — column names are camelCase to match Better Auth defaults.
// Do not rename these columns.
// ---------------------------------------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// ---------------------------------------------------------------------------
// App tables — plain userId column for per-user scoping (no FK by default).
// ---------------------------------------------------------------------------
export const deal = pgTable("deal", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  merchant: text("merchant").notNull(),
  category: text("category").notNull().default("Other"),
  originalPrice: numeric("originalPrice", { precision: 10, scale: 2 }).notNull(),
  dealPrice: numeric("dealPrice", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const mealPlan = pgTable("meal_plan", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  budget: numeric("budget", { precision: 10, scale: 2 }).notNull(),
  household: integer("household").notNull().default(1),
  diet: text("diet").notNull().default("No restrictions"),
  store: text("store").notNull(),
  estimatedTotal: numeric("estimatedTotal", { precision: 10, scale: 2 }).notNull(),
  plan: jsonb("plan").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const coinTransaction = pgTable(
  "coin_transaction",
  {
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    type: text("type").notNull(), // "earn" | "redeem"
    coins: integer("coins").notNull(),
    dollars: numeric("dollars", { precision: 10, scale: 2 }).notNull().default("0"),
    reason: text("reason").notNull(),
    refKey: text("refKey"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    // Enforces idempotency for coin awards: ON CONFLICT DO NOTHING relies on
    // this constraint to suppress duplicate (userId, refKey) inserts.
    // NULL refKeys (e.g. redeem rows) are treated as distinct by Postgres, so
    // multiple null-refKey rows per user remain allowed.
    uniqueIndex("coin_transaction_user_ref_key").on(table.userId, table.refKey),
  ],
)

// Single global row (id = "global") holding the app owner's affiliate config.
export const affiliateSetting = pgTable("affiliate_setting", {
  id: text("id").primaryKey(),
  amazonTag: text("amazonTag").notNull().default(""),
  linkWrapperBase: text("linkWrapperBase").notNull().default(""),
  commissionRate: numeric("commissionRate", { precision: 5, scale: 4 }).notNull().default("0.03"),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Outbound affiliate click log used to project earnings.
export const affiliateClick = pgTable("affiliate_click", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  source: text("source").notNull(), // "deal" | "shopping"
  label: text("label").notNull(),
  merchant: text("merchant").notNull(),
  url: text("url").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  estCommission: numeric("estCommission", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
