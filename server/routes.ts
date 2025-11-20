import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertBorrowedItemSchema, insertReminderSchema } from "@shared/schema";
import type { Product, BorrowedItem, Reminder } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialization endpoint to load data from client
  app.post("/api/init", async (req, res) => {
    try {
      const { products, borrowed, reminders } = req.body;
      
      // Load products
      if (Array.isArray(products)) {
        for (const product of products) {
          await storage.createProduct(product);
        }
      }
      
      // Load borrowed items
      if (Array.isArray(borrowed)) {
        for (const item of borrowed) {
          await storage.createBorrowedItem(item);
        }
      }
      
      // Load reminders
      if (Array.isArray(reminders)) {
        for (const reminder of reminders) {
          await storage.createReminder(reminder);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to initialize data" });
    }
  });

  // Product Routes
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      console.log("Received product data:", req.body);
      const validatedData = insertProductSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product validation error:", error);
      res.status(400).json({ error: "Invalid product data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Borrowed Items Routes
  app.get("/api/borrowed", async (_req, res) => {
    try {
      const items = await storage.getBorrowedItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch borrowed items" });
    }
  });

  app.get("/api/borrowed/:id", async (req, res) => {
    try {
      const item = await storage.getBorrowedItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Borrowed item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch borrowed item" });
    }
  });

  app.post("/api/borrowed", async (req, res) => {
    try {
      const validatedData = insertBorrowedItemSchema.parse(req.body);
      const item = await storage.createBorrowedItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid borrowed item data" });
    }
  });

  app.put("/api/borrowed/:id/return", async (req, res) => {
    try {
      const item = await storage.markAsReturned(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Borrowed item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark as returned" });
    }
  });

  // Reminders Routes
  app.get("/api/reminders", async (_req, res) => {
    try {
      const reminders = await storage.getReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  app.get("/api/reminders/:id", async (req, res) => {
    try {
      const reminder = await storage.getReminder(req.params.id);
      if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminder" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const validatedData = insertReminderSchema.parse(req.body);
      const reminder = await storage.createReminder(validatedData);
      res.status(201).json(reminder);
    } catch (error) {
      res.status(400).json({ error: "Invalid reminder data" });
    }
  });

  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReminder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
