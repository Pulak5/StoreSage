import type { Product, BorrowedItem, Reminder } from "@shared/schema";

const STORAGE_KEYS = {
  PRODUCTS: "inventory_products",
  BORROWED: "inventory_borrowed",
  REMINDERS: "inventory_reminders",
};

export const localStorageService = {
  // Products
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Borrowed Items
  getBorrowedItems(): BorrowedItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.BORROWED);
    return data ? JSON.parse(data) : [];
  },

  saveBorrowedItems(items: BorrowedItem[]): void {
    localStorage.setItem(STORAGE_KEYS.BORROWED, JSON.stringify(items));
  },

  // Reminders
  getReminders(): Reminder[] {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  },

  saveReminders(reminders: Reminder[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.BORROWED);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
  },
};
