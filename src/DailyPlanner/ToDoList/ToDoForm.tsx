import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { ColorGrid } from "../PlannerGrid/PopoverColorGrid";

/**
 * Props for the ToDoForm component.
 */
interface ToDoFormProps {
  /** Callback triggered when the form is submitted. */
  onAdd: (e: React.FormEvent) => void;
  /** The current text value for the new task. */
  newTodoText: string;
  /** Setter for the new task text value. */
  setNewTodoText: (text: string) => void;
  /** The current color value selected for the new task. */
  newTodoColor: string;
  /** Setter for the new task color value. */
  setNewTodoColor: (color: string) => void;
}

/**
 * ToDoForm Component
 * An input form for creating new todo items, including color selection and text entry.
 */
export const ToDoForm: React.FC<ToDoFormProps> = ({
  onAdd,
  newTodoText,
  setNewTodoText,
  newTodoColor,
  setNewTodoColor,
}) => {
  /** UI state to control the visibility of the color picker dropdown. */
  const [showColorPicker, setShowColorPicker] = useState(false);
  /** Reference to the popover element to detect outside clicks. */
  const popoverRef = useRef<HTMLDivElement>(null);

  /**
   * Effect to handle clicks outside the color picker to automatically close it.
   */
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
      {/* Color Selection Control */}
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-5 h-5 rounded-full ring-2 ring-offset-1 focus:outline-none transition-transform hover:scale-105"
          style={{ backgroundColor: newTodoColor }}
          title="Select color"
        />
        {/* Color Picker Popover */}
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <ColorGrid color={newTodoColor} onChange={setNewTodoColor} onClose={() => setShowColorPicker(false)} />
          </div>
        )}
      </div>

      {/* Task Text Input */}
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 h-9 px-2"
      />

      {/* Submit Button */}
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
