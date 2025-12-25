import { Plus, X } from "lucide-react";
import { useState } from "react";

interface NewCardFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export function NewCardForm({ onSubmit, onCancel }: NewCardFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter task content..."
        className="w-full p-2 text-sm rounded-lg bg-white dark:bg-neutral-900 border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[80px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded hover:bg-indigo-600 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add Card
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </form>
  );
}
