import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";

interface StatusBadgeProps {
  expirationDate?: Date | string | null;
  quantity?: number;
  minQuantity?: number;
  type?: "expiration" | "stock";
}

export function StatusBadge({ expirationDate, quantity, minQuantity, type = "expiration" }: StatusBadgeProps) {
  if (type === "stock" && quantity !== undefined && minQuantity !== undefined) {
    if (quantity === 0) {
      return (
        <Badge variant="destructive" className="text-xs" data-testid="badge-out-of-stock">
          Out of Stock
        </Badge>
      );
    }
    if (quantity <= minQuantity) {
      return (
        <Badge className="text-xs bg-orange-500 text-white hover:bg-orange-600" data-testid="badge-low-stock">
          Low Stock
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs" data-testid="badge-in-stock">
        In Stock
      </Badge>
    );
  }

  if (type === "expiration" && expirationDate) {
    const expDate = typeof expirationDate === "string" ? new Date(expirationDate) : expirationDate;
    const daysUntilExpiration = differenceInDays(expDate, new Date());

    if (daysUntilExpiration < 0) {
      return (
        <Badge variant="destructive" className="text-xs" data-testid="badge-expired">
          Expired
        </Badge>
      );
    }
    if (daysUntilExpiration <= 7) {
      return (
        <Badge className="text-xs bg-amber-500 text-white hover:bg-amber-600" data-testid="badge-expiring-soon">
          Expiring Soon
        </Badge>
      );
    }
  }

  return null;
}
