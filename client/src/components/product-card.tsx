import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";
import type { Product } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-product-${product.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-card-title truncate" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </CardTitle>
          {product.category && (
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${product.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(product)} data-testid={`button-edit-${product.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(product.id)}
              className="text-destructive"
              data-testid={`button-delete-${product.id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium" data-testid={`text-quantity-${product.id}`}>
              {product.quantity} units
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Shelf No.</p>
            <p className="font-medium" data-testid={`text-shelf-${product.id}`}>
              {product.shelfNumber}
            </p>
          </div>
        </div>
        {product.expirationDate && (
          <div className="text-sm">
            <p className="text-muted-foreground">Expiration Date</p>
            <p className="font-medium" data-testid={`text-expiration-${product.id}`}>
              {format(new Date(product.expirationDate), "MMM d, yyyy")}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <StatusBadge type="stock" quantity={product.quantity} minQuantity={product.minQuantity} />
          <StatusBadge type="expiration" expirationDate={product.expirationDate} />
        </div>
      </CardContent>
    </Card>
  );
}
