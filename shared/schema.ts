import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products table - main inventory items
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(0),
  shelfNumber: text("shelf_number").notNull(),
  expirationDate: timestamp("expiration_date"),
  minQuantity: integer("min_quantity").notNull().default(10),
  category: text("category"),
  description: text("description"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Borrowed Items table - track who borrowed what
export const borrowedItems = pgTable("borrowed_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  borrowerName: text("borrower_name").notNull(),
  quantity: integer("quantity").notNull(),
  borrowDate: timestamp("borrow_date").notNull().default(sql`now()`),
  returnDate: timestamp("return_date"),
  returned: integer("returned").notNull().default(0), // 0 = not returned, 1 = returned
});

export const insertBorrowedItemSchema = createInsertSchema(borrowedItems).omit({
  id: true,
  borrowDate: true,
});

export type InsertBorrowedItem = z.infer<typeof insertBorrowedItemSchema>;
export type BorrowedItem = typeof borrowedItems.$inferSelect;

// Reminders table - notes for reordering products
export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productName: text("product_name").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  priority: text("priority").notNull().default("medium"), // low, medium, high
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;
