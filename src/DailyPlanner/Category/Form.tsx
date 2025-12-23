import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { ColorGrid } from "../PlannerGrid/PopoverColorGrid";

interface ToDoFormProps {
  onAdd: (e: React.FormEvent) => void;
  newTodoText: string;
  setNewTodoText: (text: string) => void;
  newTodoColor: string;
  setNewTodoColor: (color: string) => void;
}

export const ToDoForm: React.FC<ToDoFormProps> = ({
  onAdd,
  newTodoText,
  setNewTodoText,
  newTodoColor,
  setNewTodoColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={onAdd}
      className="flex mb-3 gap-3 items-center w-full max-w-2xl p-2 pr-3 rounded-xl border border-slate-200 bg-white"
    >
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-5 h-5 rounded-full ring-2 ring-offset-1 focus:outline-none transition-transform hover:scale-105"
          style={{ backgroundColor: newTodoColor }}
          title="Select color"
        />
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <ColorGrid color={newTodoColor} onChange={setNewTodoColor} onClose={() => setShowColorPicker(false)} />
          </div>
        )}
      </div>

      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 h-9 px-2"
      />
      <button
        type="submit"
        disabled={!newTodoText.trim()}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={16} />
      </button>
    </form>
  );
};
