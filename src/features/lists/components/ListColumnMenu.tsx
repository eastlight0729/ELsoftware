import { Archive, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

interface ListColumnMenuProps {
  onAddCard?: () => void;
  onAddColumn: () => void;
  onArchive: () => void;
  onClose: () => void;
}

export function ListColumnMenu({
  onAddCard,
  onAddColumn,
  onArchive,
  onClose,
}: ListColumnMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        ref={menuRef}
        className="absolute right-0 top-full mt-1 w-40 z-20 bg-white/10 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 py-1 overflow-hidden"
      >
        {onAddCard && (
          <button
            onClick={() => {
              onAddCard();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors border-b border-white/5"
          >
            <Plus size={14} />
            Add Card
          </button>
        )}
        <button
          onClick={() => {
            onAddColumn();
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors border-b border-white/5"
        >
          <Plus size={14} />
          Add Column
        </button>
        <button
          onClick={() => {
            onArchive();
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Archive size={14} />
          Archive Column
        </button>
      </div>
    </>
  );
}
