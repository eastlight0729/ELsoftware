import React, { useState } from "react";
import { useDailyPlanner } from "./useDailyPlanner";
import { PlannerHeader } from "./PlannerHeader/PlannerHeader";
import { TimeLabels } from "./PlannerGrid/Timelabels";
import { PlannerGrid } from "./PlannerGrid/PlannerGrid";
import { ToDoListManager } from "./ToDoList/ToDoListManager";

/**
 * DailyPlanner Component
 * The main container for the daily planning application.
 * Orchestrates the header, time-based grid, and todo list manager.
 */
export const DailyPlanner: React.FC = () => {
  // --- Data & Logic from useDailyPlanner hook ---
  const {
    todos,
    grid,
    currentDate,
    addToDo,
    assignCellRange,
    clearCellRange,
    removeToDo,
    toggleToDo,
    changeDate,
    goToToday,
  } = useDailyPlanner();

  // --- Local UI State ---
  /** Tracks the current drag-to-select range in the grid. */
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  /** Stores the text for a new todo item. */
  const [newTodoText, setNewTodoText] = useState("");
  /** Stores the color for a new todo item. */
  const [newTodoColor, setNewTodoColor] = useState("#3b82f6"); // Default blue
  /** Stores the current time in minutes from the start of the day (0-1439). */
  const [currentMinutes, setCurrentMinutes] = useState(0);

  // --- Time Synchronization ---
  /**
   * Effect to update the current minutes every minute to keep the 'Current Time Indicator' accurate.
   */
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(minutes);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // --- Event Handlers ---

  /**
   * Called when a range of cells is selected via drag interaction.
   */
  const handleRangeSelect = (start: number, end: number) => {
    setSelectedRange({ start, end });
  };

  /**
   * Called when a color is selected from the cell popover to fill a range.
   */
  const handleColorSelect = (color: string) => {
    if (selectedRange) {
      assignCellRange(selectedRange.start, selectedRange.end, color);
      setSelectedRange(null);
    }
  };

  /**
   * Called when the 'clear' button is pressed in the cell popover.
   */
  const handleClearSelection = () => {
    if (selectedRange) {
      clearCellRange(selectedRange.start, selectedRange.end);
      setSelectedRange(null);
    }
  };

  /**
   * Handles the submission of the new todo form.
   */
  const handleAddToDo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addToDo(newTodoText, newTodoColor);
      setNewTodoText("");
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen font-sans text-slate-800">
      {/* 1. Header Section: Date display and navigation controls */}
      <PlannerHeader
        currentDate={currentDate}
        onPrev={() => changeDate(-1)}
        onNext={() => changeDate(1)}
        onToday={goToToday}
      />

      {/* 2. Time Labels: The vertical axis/legend for the grid */}
      <TimeLabels />

      {/* 3. The Interactive Grid: Core planning area with drag selection */}
      <PlannerGrid
        grid={grid}
        selectedRange={selectedRange}
        currentMinutes={currentMinutes}
        onRangeSelect={handleRangeSelect}
        onColorSelect={handleColorSelect}
        onClearSelection={handleClearSelection}
        onClosePopover={() => setSelectedRange(null)}
      />

      {/* 4. Todo List Manager: Task management section at the bottom */}
      <ToDoListManager
        todos={todos}
        onRemove={removeToDo}
        onToggle={toggleToDo}
        onAdd={handleAddToDo}
        newTodoText={newTodoText}
        setNewTodoText={setNewTodoText}
        newTodoColor={newTodoColor}
        setNewTodoColor={setNewTodoColor}
      />
    </div>
  );
};
