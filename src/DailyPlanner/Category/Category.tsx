import React from "react";

import { ToDoList } from "./List";
import { ToDoForm } from "./Form";
import { ToDo } from "../../types";

interface CategoryManagerProps {
  todos: ToDo[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onAdd: (e: React.FormEvent) => void;
  newTodoText: string;
  setNewTodoText: (text: string) => void;
  newTodoColor: string;
  setNewTodoColor: (color: string) => void;
}

export const ToDoManager: React.FC<CategoryManagerProps> = ({
  todos,
  onRemove,
  onToggle,
  onAdd,
  newTodoText,
  setNewTodoText,
  newTodoColor,
  setNewTodoColor,
}) => {
  return (
    <div className="mt-3 bg-white/40 backdrop-blur-md rounded-2xl px-5 p-3 border border-slate-200/60 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tasks</h3>
      <ToDoForm
        onAdd={onAdd}
        newTodoText={newTodoText}
        setNewTodoText={setNewTodoText}
        newTodoColor={newTodoColor}
        setNewTodoColor={setNewTodoColor}
      />
      <ToDoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </div>
  );
};
