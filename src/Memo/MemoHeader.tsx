import { Eye, PenLine } from "lucide-react";

interface MemoHeaderProps {
  /** Whether the view is currently in preview mode. */
  isPreview: boolean;
  /** Callback to toggle between editor and preview modes. */
  onTogglePreview: () => void;
}

/**
 * Header section for the Memo component.
 * Contains the query title and a toggle button to switch between Editor and Preview modes.
 */
export function MemoHeader({ isPreview, onTogglePreview }: MemoHeaderProps) {
  return (
    <div className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
      <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">{isPreview ? "Preview" : "Editor"}</h3>
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-400 font-medium hidden sm:block">
          {isPreview ? "Read Mode" : "Markdown Supported"}
        </span>
        <button
          onClick={onTogglePreview}
          className="p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title={isPreview ? "Switch to Editor" : "Switch to Preview"}
        >
          {isPreview ? <PenLine size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
