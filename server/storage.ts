import {
  type Product,
  type InsertProduct,
  type BorrowedItem,
  type InsertBorrowedItem,
  type Reminder,
  type InsertReminder,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { dbStorage } from "./dbStorage";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Borrowed Items
  getBorrowedItems(): Promise<BorrowedItem[]>;
  getBorrowedItem(id: string): Promise<BorrowedItem | undefined>;
  createBorrowedItem(item: InsertBorrowedItem): Promise<BorrowedItem>;
  markAsReturned(id: string): Promise<BorrowedItem | undefined>;

  // Reminders
  getReminders(): Promise<Reminder[]>;
  getReminder(id: string): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  deleteReminder(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private borrowedItems: Map<string, BorrowedItem>;
  private reminders: Map<string, Reminder>;

  constructor() {
    this.products = new Map();
    this.borrowedItems = new Map();
    this.reminders = new Map();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct | Product): Promise<Product> {
    // If the product already has an ID (from localStorage), preserve it
    const id = (insertProduct as any).id || randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      category: insertProduct.category || null,
      description: insertProduct.description || null,
      expirationDate: insertProduct.expirationDate || null,
    };
    
    // Avoid duplicates when initializing from localStorage
    if (!this.products.has(id)) {
      this.products.set(id, product);
    }
    
    return product;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { 
      ...insertProduct, 
      id,
      category: insertProduct.category || null,
      description: insertProduct.description || null,
      expirationDate: insertProduct.expirationDate || null,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Borrowed Items
  async getBorrowedItems(): Promise<BorrowedItem[]> {
    return Array.from(this.borrowedItems.values());
  }

  async getBorrowedItem(id: string): Promise<BorrowedItem | undefined> {
    return this.borrowedItems.get(id);
  }

  async createBorrowedItem(insertItem: InsertBorrowedItem | BorrowedItem): Promise<BorrowedItem> {
    const id = (insertItem as any).id || randomUUID();
    const item: BorrowedItem = {
      ...insertItem,
      id,
      productId: insertItem.productId || randomUUID(),
      borrowDate: (insertItem as any).borrowDate || new Date(),
      returnDate: insertItem.returnDate || null,
    };
    
    if (!this.borrowedItems.has(id)) {
      this.borrowedItems.set(id, item);
    }
    
    return item;
  }

  async markAsReturned(id: string): Promise<BorrowedItem | undefined> {
    const item = this.borrowedItems.get(id);
    if (!item) return undefined;
    
    const updated: BorrowedItem = { ...item, returned: 1 };
    this.borrowedItems.set(id, updated);
    return updated;
  }

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values());
  }

  async getReminder(id: string): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async createReminder(insertReminder: InsertReminder | Reminder): Promise<Reminder> {
    const id = (insertReminder as any).id || randomUUID();
    const reminder: Reminder = {
      ...insertReminder,
      id,
      createdAt: (insertReminder as any).createdAt || new Date(),
    };
    
    if (!this.reminders.has(id)) {
      this.reminders.set(id, reminder);
    }
    
    return reminder;
  }

  async deleteReminder(id: string): Promise<boolean> {
    return this.reminders.delete(id);
  }
}

// Use DB-backed storage when USE_DB environment variable is truthy, otherwise in-memory storage
const useDb = process.env.USE_DB === "true" || process.env.USE_DB === "1";

// Attempt to load DB-backed storage dynamically. If loading fails (for example
// because `better-sqlite3` isn't installed), fall back to the in-memory store
// and log a helpful message instead of crashing the process.
let storageInstance: IStorage;
if (useDb) {
  try {
    // dynamic import so missing native modules don't throw at module-evaluation time
    // Top-level await is supported because the project is ESM and Node 18+ is targeted.
    const mod = await import("./dbStorage");
    storageInstance = mod.dbStorage as IStorage;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("USE_DB is enabled but failed to load DB storage. Falling back to in-memory storage.", err);
    storageInstance = new MemStorage();
  }
} else {
  storageInstance = new MemStorage();
}

export const storage = storageInstance;
