import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, AlertTriangle, StickyNote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product, BorrowedItem, Reminder } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays } from "date-fns";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: borrowedItems, isLoading: borrowedLoading } = useQuery<BorrowedItem[]>({
    queryKey: ["/api/borrowed"],
  });

  const { data: reminders, isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
  });

  const stats = {
    totalProducts: products?.length || 0,
    lowStock:
      products?.filter((p) => p.quantity <= p.minQuantity).length || 0,
    expiringSoon:
      products?.filter((p) => {
        if (!p.expirationDate) return false;
        const days = differenceInDays(new Date(p.expirationDate), new Date());
        return days >= 0 && days <= 7;
      }).length || 0,
    borrowedItems: borrowedItems?.filter((b) => b.returned === 0).length || 0,
  };

  const isLoading = productsLoading || borrowedLoading || remindersLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-header md:text-page-header font-medium">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold" data-testid="text-total-products">
                  {stats.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Items in inventory</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-500" data-testid="text-low-stock-count">
                  {stats.lowStock}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-amber-500" data-testid="text-expiring-count">
                  {stats.expiringSoon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Within 7 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Items</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold" data-testid="text-borrowed-count">
                  {stats.borrowedItems}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Currently borrowed</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-section-header">Recent Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            {remindersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : reminders && reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.slice(0, 5).map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                    data-testid={`reminder-${reminder.id}`}
                  >
                    <StickyNote className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{reminder.productName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{reminder.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No reminders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-section-header">Products Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : products ? (
              <div className="space-y-3">
                {products
                  .filter((p) => {
                    const isLowStock = p.quantity <= p.minQuantity;
                    const isExpiringSoon = p.expirationDate
                      ? differenceInDays(new Date(p.expirationDate), new Date()) <= 7 &&
                        differenceInDays(new Date(p.expirationDate), new Date()) >= 0
                      : false;
                    return isLowStock || isExpiringSoon;
                  })
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                      data-testid={`attention-product-${product.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Shelf: {product.shelfNumber} • Qty: {product.quantity}
                        </p>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 ml-2" />
                    </div>
                  ))}
                {products.filter((p) => {
                  const isLowStock = p.quantity <= p.minQuantity;
                  const isExpiringSoon = p.expirationDate
                    ? differenceInDays(new Date(p.expirationDate), new Date()) <= 7
                    : false;
                  return isLowStock || isExpiringSoon;
                }).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">All products are in good condition</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No products found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
