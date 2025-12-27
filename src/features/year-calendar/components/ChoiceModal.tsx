import { X } from "lucide-react";

interface ChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchedule: () => void;
  onSelectAction: () => void;
}

export function ChoiceModal({ isOpen, onClose, onSelectSchedule, onSelectAction }: ChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Select Type</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <button
            onClick={onSelectSchedule}
            className="w-full py-4 px-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <div className="w-4 h-4 bg-green-500 rounded-sm" />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">Schedule</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Mark a green box</div>
            </div>
          </button>

          <button
            onClick={onSelectAction}
            className="w-full py-4 px-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-500 group-hover:scale-110 transition-transform">
              <div
                className="w-2.5 h-2 bg-green-700 dark:bg-green-600"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </div>
            <div className="text-left">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">Action</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Add a blue dot task</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
