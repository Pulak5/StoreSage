import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle2 } from "lucide-react";
import { BorrowedItemDialog } from "@/components/borrowed-item-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BorrowedItem, InsertBorrowedItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Borrowed() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: borrowedItems, isLoading } = useQuery<BorrowedItem[]>({
    queryKey: ["/api/borrowed"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBorrowedItem) => apiRequest("POST", "/api/borrowed", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/borrowed"] });
      toast({ title: "Borrowed item recorded successfully" });
      setDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to record borrowed item", variant: "destructive" });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PUT", `/api/borrowed/${id}/return`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/borrowed"] });
      toast({ title: "Item marked as returned" });
    },
    onError: () => {
      toast({ title: "Failed to mark as returned", variant: "destructive" });
    },
  });

  const activeItems = borrowedItems?.filter((item) => item.returned === 0) || [];
  const returnedItems = borrowedItems?.filter((item) => item.returned === 1) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-page-header md:text-page-header font-medium">Borrowed Items</h1>
          <p className="text-muted-foreground mt-1">Track items borrowed from the store</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-borrowed">
          <Plus className="h-4 w-4 mr-2" />
          Record Borrowed Item
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-section-header font-medium mb-4">Active Borrows</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : activeItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeItems.map((item) => {
                const isOverdue = item.returnDate && isPast(new Date(item.returnDate));
                return (
                  <Card key={item.id} data-testid={`card-borrowed-${item.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-card-title">{item.productName}</CardTitle>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Borrower</p>
                          <p className="font-medium" data-testid={`text-borrower-${item.id}`}>
                            {item.borrowerName}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          {item.returnDate && (
                            <div>
                              <p className="text-muted-foreground">Return By</p>
                              <p className="font-medium">{format(new Date(item.returnDate), "MMM d, yyyy")}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Borrowed On</p>
                          <p className="font-medium">{format(new Date(item.borrowDate), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => returnMutation.mutate(item.id)}
                        disabled={returnMutation.isPending}
                        data-testid={`button-return-${item.id}`}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Returned
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No active borrowed items</p>
              </CardContent>
            </Card>
          )}
        </div>

        {returnedItems.length > 0 && (
          <div>
            <h2 className="text-section-header font-medium mb-4">Returned Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {returnedItems.map((item) => (
                <Card key={item.id} className="opacity-60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-card-title flex items-center gap-2">
                      {item.productName}
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Borrower</p>
                      <p className="font-medium">{item.borrowerName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Borrowed On</p>
                        <p className="font-medium">{format(new Date(item.borrowDate), "MMM d")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BorrowedItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
