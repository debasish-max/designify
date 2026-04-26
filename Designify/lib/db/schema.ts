import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  role: text("role").default("user").notNull(), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow(),
});

export const CategoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: jsonb("image"),
  hasFrontAndBack: boolean("has_front_and_back").default(false),
});

export const ProductsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  pricing: integer("pricing").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isPopular: boolean("is_popular").default(false),
  categoryName: text("category_name").notNull(),
  productImage: jsonb("product_image").notNull(), // Array of image URLs
  documentId: text("document_id").notNull(), // For legacy frontend compatibility
  sizes: jsonb("sizes"), // Array of sizes e.g. ["S", "M", "L"]
  mockup2dFront: text("mockup_2d_front"), // URL for Front 2D mockup design
  mockup2dBack: text("mockup_2d_back"), // URL for Back 2D mockup design
});

export const CartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  productId: integer("product_id").notNull(),
  designUrl: text("design_url"),
  quantity: integer("quantity").default(1),
});

export const OrdersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  zip: text("zip").notNull(),
  address: text("address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentId: text("payment_id"),
  paymentMethod: text("payment_method").notNull(), // 'cod' or 'online'
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
