import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBorrowedItemSchema, type BorrowedItem, type InsertBorrowedItem } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertBorrowedItemSchema.extend({
  returnDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BorrowedItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertBorrowedItem) => void;
  item?: BorrowedItem;
  isPending?: boolean;
}

export function BorrowedItemDialog({ open, onOpenChange, onSubmit, item, isPending }: BorrowedItemDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item
      ? {
          productId: item.productId,
          productName: item.productName,
          borrowerName: item.borrowerName,
          quantity: item.quantity,
          returnDate: item.returnDate ? new Date(item.returnDate).toISOString().split("T")[0] : "",
          returned: item.returned,
        }
      : {
          productId: "",
          productName: "",
          borrowerName: "",
          quantity: 1,
          returnDate: "",
          returned: 0,
        },
  });

  const handleSubmit = (data: FormValues) => {
    const submitData: InsertBorrowedItem = {
      ...data,
      returnDate: data.returnDate ? new Date(data.returnDate) : null,
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Borrowed Item" : "Record Borrowed Item"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Office Supplies" {...field} data-testid="input-borrowed-product" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="borrowerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} data-testid="input-borrower-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-borrowed-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-return-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel-borrowed"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-save-borrowed">
                {isPending ? "Saving..." : item ? "Update" : "Add Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
