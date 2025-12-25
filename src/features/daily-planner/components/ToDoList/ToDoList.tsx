import React from "react";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { ToDo } from "../../types";

/**
 * Props for the ToDoList component.
 */
interface ToDoListProps {
  /** Array of todo items to display. */
  todos: ToDo[];
  /** Callback triggered when a task is removed. */
  onRemove: (id: string) => void;
  /** Callback triggered when a task's completion status is toggled. */
  onToggle: (id: string) => void;
}

/**
 * ToDoList Component
 * Renders a list of interactive task items.
 * Allows users to toggle completion, see category colors, and delete tasks.
 */
export const ToDoList: React.FC<ToDoListProps> = ({ todos, onRemove, onToggle }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 w-full max-w-2xl">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`group flex items-center justify-between gap-3 px-4 py-3 bg-white border rounded-xl shadow-sm transition-all hover:shadow-md ${
            todo.completed ? "border-slate-100 bg-slate-50 opacity-75" : "border-slate-200"
          }`}
        >
          {/* Main Task Area (Clickable to toggle completion) */}
          <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onToggle(todo.id)}>
            {/* Category Color Indicator */}
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${!todo.color ? "border border-slate-300" : ""}`}
              style={{ backgroundColor: todo.color || "transparent" }}
            />
            {/* Completion Status Icon */}
            <button
              className={`text-slate-400 transition-colors ${
                todo.completed ? "text-green-500" : "hover:text-blue-500"
              }`}
            >
              {todo.completed ? <CheckCircle size={20} className="fill-green-100" /> : <Circle size={20} />}
            </button>
            {/* Task Description Text */}
            <span
              className={`text-sm font-medium truncate select-none ${
                todo.completed ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {todo.text}
            </span>
          </div>

          {/* Delete Action Button (Visible on hover) */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => onRemove(todo.id)}
            title="Remove task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* Empty State Message */}
      {todos.length === 0 && <div className="text-sm text-slate-400 italic px-2">No tasks added yet.</div>}
    </div>
  );
};
