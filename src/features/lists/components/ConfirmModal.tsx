import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
