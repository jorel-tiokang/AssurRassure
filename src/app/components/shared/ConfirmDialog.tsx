import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isDestructive = false
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-white border-ink/10 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-ink font-display">
            {isDestructive && <AlertTriangle className="h-5 w-5 text-red-600" />}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-ink-muted">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="rounded-sm border-ink/20 hover:bg-zinc-50 hover:text-ink">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onClose();
            }}
            className={`rounded-sm ${isDestructive ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#0055FF] text-white hover:bg-[#0044cc]"}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
