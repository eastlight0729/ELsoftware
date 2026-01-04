import { useEffect, useRef, useState } from "react";
import { Archive } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KanbanCard } from "../types";

interface KanbanCardModalProps {
  isOpen: boolean;
  card: KanbanCard | null;
  onSave: (id: string, updates: Partial<KanbanCard>) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const SIZES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "8", label: "8" },
];

export function KanbanCardModal({ isOpen, card, onSave, onRemove, onClose }: KanbanCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("1");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && card) {
      setTitle(card.content);
      setDescription(card.description || "");
      setSize(card.size || "1");
      requestAnimationFrame(() => {
        titleInputRef.current?.focus();
      });
    }
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    onSave(card.id, {
      content: title.trim(),
      description: description.trim(),
      size,
    });
    onClose();
  };

  const handleRemove = () => {
    onRemove(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-white/40"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header containing Title Input */}
        <div className="px-6 py-5 border-b border-black/5">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                document.getElementById("card-description")?.focus();
              }
            }}
            className="w-full text-lg font-semibold text-neutral-800 bg-transparent border-none outline-none placeholder:text-neutral-400"
            placeholder="Card Title"
          />
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Size Selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Size</span>
            <div className="flex space-x-1">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 border",
                    size === s.value
                      ? "bg-sky-400 border-sky-400 text-white shadow-md scale-110"
                      : "bg-white/50 border-neutral-200 text-neutral-600 hover:border-sky-300 hover:text-sky-500 hover:bg-white"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full h-96 py-4 bg-transparent border-y border-neutral-100 outline-none resize-none text-neutral-700 text-sm transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50/50 border-t border-black/5">
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-3 py-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <Archive size={16} />
            <span className="hidden sm:inline">Archive</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-black/5 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-5 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-400/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
