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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Calendar Usage Guide</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors p-1"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{CALENDAR_HELP_TEXT}</Markdown>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />
    </div>
  );
}
