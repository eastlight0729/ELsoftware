interface ChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchedule: () => void;
  onSelectAction: () => void;
  position: { x: number; y: number } | null;
}

export function ChoiceModal({ isOpen, onClose, onSelectSchedule, onSelectAction, position }: ChoiceModalProps) {
  if (!isOpen || !position) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        className="fixed z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 w-48 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
        style={{ top: position.y + 10, left: position.x }}
      >
        <button
          onClick={onSelectSchedule}
          className="w-full px-3 py-2 text-sm text-left flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors text-neutral-700 dark:text-neutral-200"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Schedule Range</span>
        </button>
        <button
          onClick={onSelectAction}
          className="w-full px-3 py-2 text-sm text-left flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors text-neutral-700 dark:text-neutral-200"
        >
          <div
            className="w-2 h-1.5 bg-green-700 dark:bg-green-600"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
          <span>Add Action</span>
        </button>
      </div>
    </>
  );
}
