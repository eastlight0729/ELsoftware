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
        className="w-full p-3 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 resize-none min-h-[80px] transition-all backdrop-blur-sm"
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
          className="px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-lg border border-white/10 hover:bg-white/30 transition-colors flex items-center gap-1 backdrop-blur-sm"
        >
          <Plus size={14} /> Add Card
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </form>
  );
}
