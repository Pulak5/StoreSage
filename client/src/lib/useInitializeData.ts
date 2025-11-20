import { useEffect, useRef } from "react";
import { localStorageService } from "./localStorage";

export function useInitializeData() {
  const initialized = useRef(false);

  useEffect(() => {
    const initializeServerData = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        // Load data from localStorage
        const products = localStorageService.getProducts();
        const borrowed = localStorageService.getBorrowedItems();
        const reminders = localStorageService.getReminders();

        // Initialize server with localStorage data if any exists
        if (products.length > 0 || borrowed.length > 0 || reminders.length > 0) {
          await fetch("/api/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products, borrowed, reminders }),
          });
        }
      } catch (error) {
        console.error("Failed to initialize server data:", error);
      }
    };

    initializeServerData();
  }, []);
}
