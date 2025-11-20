import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ReminderDialog } from "@/components/reminder-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Reminder, InsertReminder } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Reminders() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertReminder) => apiRequest("POST", "/api/reminders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({ title: "Reminder added successfully" });
      setDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to add reminder", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/reminders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({ title: "Reminder deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete reminder", variant: "destructive" });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white hover:bg-red-600";
      case "medium":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "low":
        return "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return "";
    }
  };

  const sortedReminders = reminders?.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-page-header md:text-page-header font-medium">Reminders</h1>
          <p className="text-muted-foreground mt-1">Product reorder reminders and notes</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-reminder">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : sortedReminders && sortedReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReminders.map((reminder) => (
            <Card key={reminder.id} className="hover-elevate" data-testid={`card-reminder-${reminder.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-card-title flex-1">{reminder.productName}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(reminder.id)}
                    disabled={deleteMutation.isPending}
                    className="h-8 w-8"
                    data-testid={`button-delete-reminder-${reminder.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className={`text-xs w-fit ${getPriorityColor(reminder.priority)}`}>
                  {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm" data-testid={`text-reminder-note-${reminder.id}`}>{reminder.note}</p>
                <p className="text-xs text-muted-foreground">
                  Created {format(new Date(reminder.createdAt), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reminders yet. Add a reminder to track reorder needs!</p>
          </CardContent>
        </Card>
      )}

      <ReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
