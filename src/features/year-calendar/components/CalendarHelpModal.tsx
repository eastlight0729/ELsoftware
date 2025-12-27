import { X } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CALENDAR_HELP_TEXT } from "../constants";

interface CalendarHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarHelpModal({ isOpen, onClose }: CalendarHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Calendar Usage Guide</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Keyboard shortcuts and interactions</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors p-1"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-4 w-full prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{CALENDAR_HELP_TEXT}</Markdown>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />
    </div>
  );
}
