import React from "react";

import { ToDoList } from "./ToDoList";
import { ToDoForm } from "./ToDoForm";
import { ToDo } from "../types";

/**
 * Props for the ToDoListManager component.
 */
interface ToDoListManagerProps {
  /** The collection of tasks to display. */
  todos: ToDo[];
  /** Handler to remove a task. */
  onRemove: (id: string) => void;
  /** Handler to toggle task completion. */
  onToggle: (id: string) => void;
  /** Handler to submit a new task. */
  onAdd: (e: React.FormEvent) => void;
  /** Current input text for new task. */
  newTodoText: string;
  /** Update current input text. */
  setNewTodoText: (text: string) => void;
  /** Current color selected for new task. */
  newTodoColor: string;
  /** Update current color for new task. */
  setNewTodoColor: (color: string) => void;
}

/**
 * ToDoListManager Component
 * Acts as a container for task-related functionality within the Daily Planner.
 * Combines the entry form (ToDoForm) and the display list (ToDoList).
 */
export const ToDoListManager: React.FC<ToDoListManagerProps> = ({
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
      {/* Section Title */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tasks</h3>

      {/* Input area for creating new tasks */}
      <ToDoForm
        onAdd={onAdd}
        newTodoText={newTodoText}
        setNewTodoText={setNewTodoText}
        newTodoColor={newTodoColor}
        setNewTodoColor={setNewTodoColor}
      />

      {/* Scrollable list of existing tasks */}
      <ToDoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </div>
  );
};
