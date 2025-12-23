import React from "react";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { ToDo } from "../../types";

interface ToDoListProps {
  todos: ToDo[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

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
          <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onToggle(todo.id)}>
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${!todo.color ? "border border-slate-300" : ""}`}
              style={{ backgroundColor: todo.color || "transparent" }}
            />
            <button
              className={`text-slate-400 transition-colors ${
                todo.completed ? "text-green-500" : "hover:text-blue-500"
              }`}
            >
              {todo.completed ? <CheckCircle size={20} className="fill-green-100" /> : <Circle size={20} />}
            </button>
            <span
              className={`text-sm font-medium truncate select-none ${
                todo.completed ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {todo.text}
            </span>
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => onRemove(todo.id)}
            title="Remove task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {todos.length === 0 && <div className="text-sm text-slate-400 italic px-2">No tasks added yet.</div>}
    </div>
  );
};
