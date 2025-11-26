import { db, getRawSqlite } from "./db";
import fs from "fs";
import { randomUUID } from "crypto";

// We'll create tables if they don't already exist.
const raw = getRawSqlite();

raw.exec(`
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  shelf_number TEXT NOT NULL,
  expiration_date TEXT,
  min_quantity INTEGER NOT NULL DEFAULT 10,
  category TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS borrowed_items (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  borrower_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  borrow_date TEXT NOT NULL,
  return_date TEXT,
  returned INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium'
);
`);

// Types (loose) to satisfy the storage interface
export interface ProductRecord {
  id: string;
  name: string;
  quantity: number;
  shelf_number: string;
  expiration_date: string | null;
  min_quantity: number;
  category: string | null;
  description: string | null;
}

export interface BorrowedRecord {
  id: string;
  product_id: string;
  product_name: string;
  borrower_name: string;
  quantity: number;
  borrow_date: string;
  return_date: string | null;
  returned: number;
}

export interface ReminderRecord {
  id: string;
  product_name: string;
  note: string;
  created_at: string;
  priority: string;
}

// Minimal DB-backed storage implementing same shape as MemStorage
export class DBStorage {
  async getProducts() {
    const rows: ProductRecord[] = raw.prepare(`SELECT * FROM products`).all();
    return rows.map(r => ({
      ...r,
      shelfNumber: r.shelf_number,
      expirationDate: r.expiration_date ? new Date(r.expiration_date) : null,
      minQuantity: r.min_quantity,
      category: r.category ?? null,
      description: r.description ?? null,
    }));
  }

  async getProduct(id: string) {
    const r: ProductRecord | undefined = raw.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
    if (!r) return undefined;
    return {
      ...r,
      shelfNumber: r.shelf_number,
      expirationDate: r.expiration_date ? new Date(r.expiration_date) : null,
      minQuantity: r.min_quantity,
      category: r.category ?? null,
      description: r.description ?? null,
    } as any;
  }

  async createProduct(insertProduct: any) {
    const id = insertProduct.id || randomUUID();
    const expiration = insertProduct.expirationDate ? (new Date(insertProduct.expirationDate)).toISOString() : null;
    raw.prepare(`INSERT INTO products (id, name, quantity, shelf_number, expiration_date, min_quantity, category, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, insertProduct.name, insertProduct.quantity ?? 0, insertProduct.shelfNumber ?? "", expiration, insertProduct.minQuantity ?? 10, insertProduct.category ?? null, insertProduct.description ?? null);

    return this.getProduct(id) as Promise<any>;
  }

  async updateProduct(id: string, insertProduct: any) {
    const existing = await this.getProduct(id);
    if (!existing) return undefined;
    const expiration = insertProduct.expirationDate ? (new Date(insertProduct.expirationDate)).toISOString() : null;
    raw.prepare(`UPDATE products SET name = ?, quantity = ?, shelf_number = ?, expiration_date = ?, min_quantity = ?, category = ?, description = ? WHERE id = ?`)
      .run(insertProduct.name, insertProduct.quantity ?? 0, insertProduct.shelfNumber ?? "", expiration, insertProduct.minQuantity ?? 10, insertProduct.category ?? null, insertProduct.description ?? null, id);
    return this.getProduct(id) as Promise<any>;
  }

  async deleteProduct(id: string) {
    const info = raw.prepare(`DELETE FROM products WHERE id = ?`).run(id);
    return info.changes > 0;
  }

  // Borrowed Items
  async getBorrowedItems() {
    const rows: BorrowedRecord[] = raw.prepare(`SELECT * FROM borrowed_items`).all();
    return rows.map(r => ({
      ...r,
      borrowDate: new Date(r.borrow_date),
      returnDate: r.return_date ? new Date(r.return_date) : null,
    })) as any;
  }

  async getBorrowedItem(id: string) {
    const r: BorrowedRecord | undefined = raw.prepare(`SELECT * FROM borrowed_items WHERE id = ?`).get(id);
    if (!r) return undefined;
    return {
      ...r,
      borrowDate: new Date(r.borrow_date),
      returnDate: r.return_date ? new Date(r.return_date) : null,
    } as any;
  }

  async createBorrowedItem(insertItem: any) {
    const id = insertItem.id || randomUUID();
    const borrowDate = insertItem.borrowDate ? new Date(insertItem.borrowDate).toISOString() : new Date().toISOString();
    const returnDate = insertItem.returnDate ? new Date(insertItem.returnDate).toISOString() : null;
    raw.prepare(`INSERT INTO borrowed_items (id, product_id, product_name, borrower_name, quantity, borrow_date, return_date, returned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, insertItem.productId ?? randomUUID(), insertItem.productName ?? "", insertItem.borrowerName ?? "", insertItem.quantity ?? 0, borrowDate, returnDate, insertItem.returned ?? 0);
    return this.getBorrowedItem(id) as Promise<any>;
  }

  async markAsReturned(id: string) {
    const existing = await this.getBorrowedItem(id);
    if (!existing) return undefined;
    raw.prepare(`UPDATE borrowed_items SET returned = 1 WHERE id = ?`).run(id);
    return this.getBorrowedItem(id) as Promise<any>;
  }

  // Reminders
  async getReminders() {
    const rows: ReminderRecord[] = raw.prepare(`SELECT * FROM reminders`).all();
    return rows.map(r => ({
      ...r,
      createdAt: new Date(r.created_at),
    })) as any;
  }

  async getReminder(id: string) {
    const r: ReminderRecord | undefined = raw.prepare(`SELECT * FROM reminders WHERE id = ?`).get(id);
    if (!r) return undefined;
    return {
      ...r,
      createdAt: new Date(r.created_at),
    } as any;
  }

  async createReminder(insertReminder: any) {
    const id = insertReminder.id || randomUUID();
    const createdAt = insertReminder.createdAt ? new Date(insertReminder.createdAt).toISOString() : new Date().toISOString();
    raw.prepare(`INSERT INTO reminders (id, product_name, note, created_at, priority) VALUES (?, ?, ?, ?, ?)`)
      .run(id, insertReminder.productName ?? "", insertReminder.note ?? "", createdAt, insertReminder.priority ?? "medium");
    return this.getReminder(id) as Promise<any>;
  }

  async deleteReminder(id: string) {
    const info = raw.prepare(`DELETE FROM reminders WHERE id = ?`).run(id);
    return info.changes > 0;
  }
}

export const dbStorage = new DBStorage();
