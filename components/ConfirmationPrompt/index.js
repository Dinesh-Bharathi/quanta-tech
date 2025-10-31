"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmation } from "@/context/ConfirmationContext";

const ConfirmationPrompt = () => {
  const { confirmation } = useConfirmation();

  if (!confirmation) return null;

  return (
    <AlertDialog open={!!confirmation}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {confirmation.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {confirmation.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel
            onClick={confirmation.onCancel}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            {confirmation.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmation.onConfirm}
            className={
              confirmation.isDangerous
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {confirmation.confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationPrompt;
