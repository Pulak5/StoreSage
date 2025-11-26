import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { localStorageService } from "./localStorage";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // If API fails (e.g., no backend server), handle offline
    if (method === "POST") {
      // For POST (create), save to localStorage
      if (url === "/api/products" && data) {
        const products = localStorageService.getProducts();
        const newProduct = { 
          id: Date.now().toString(), 
          ...(data as any),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        products.push(newProduct);
        localStorageService.saveProducts(products);
        return new Response(JSON.stringify(newProduct), { status: 201 });
      } else if (url === "/api/borrowed" && data) {
        const items = localStorageService.getBorrowedItems();
        const newItem = { 
          id: Date.now().toString(), 
          ...(data as any),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        items.push(newItem);
        localStorageService.saveBorrowedItems(items);
        return new Response(JSON.stringify(newItem), { status: 201 });
      } else if (url === "/api/reminders" && data) {
        const reminders = localStorageService.getReminders();
        const newReminder = { 
          id: Date.now().toString(), 
          ...(data as any),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        reminders.push(newReminder);
        localStorageService.saveReminders(reminders);
        return new Response(JSON.stringify(newReminder), { status: 201 });
      }
    } else if (method === "PUT") {
      // For PUT (update), save to localStorage
      const idMatch = url.match(/\/api\/(\w+)\/(.+)$/);
      if (idMatch) {
        const [, type, id] = idMatch;
        if (type === "products") {
          const products = localStorageService.getProducts();
          const idx = products.findIndex(p => p.id === id);
          if (idx >= 0) {
            products[idx] = { ...products[idx], ...(data as any), updatedAt: new Date() };
            localStorageService.saveProducts(products);
            return new Response(JSON.stringify(products[idx]), { status: 200 });
          }
        }
      }
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Sync with localStorage after successful GET
      if (url === "/api/products") {
        localStorageService.saveProducts(data);
      } else if (url === "/api/borrowed") {
        localStorageService.saveBorrowedItems(data);
      } else if (url === "/api/reminders") {
        localStorageService.saveReminders(data);
      }
      
      return data;
    } catch (error) {
      // If API fails, fall back to localStorage
      if (url === "/api/products") {
        return localStorageService.getProducts();
      } else if (url === "/api/borrowed") {
        return localStorageService.getBorrowedItems();
      } else if (url === "/api/reminders") {
        return localStorageService.getReminders();
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
