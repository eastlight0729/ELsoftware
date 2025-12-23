import React, { useState } from "react";
import { useDailyPlanner } from "./useDailyPlanner";
import { PlannerHeader } from "./PlannerHeader/PlannerHeader";
import { TimeLabels } from "./PlannerGrid/Timelabels";
import { PlannerGrid } from "./PlannerGrid/PlannerGrid";
import { ToDoManager } from "./Category/Category";

export const DailyPlanner: React.FC = () => {
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

  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoColor, setNewTodoColor] = useState("#3b82f6"); // Default blue
  const [currentMinutes, setCurrentMinutes] = useState(0);

  // Time Sync Effect
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(minutes);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRangeSelect = (start: number, end: number) => {
    setSelectedRange({ start, end });
  };

  const handleColorSelect = (color: string) => {
    if (selectedRange) {
      assignCellRange(selectedRange.start, selectedRange.end, color);
      setSelectedRange(null);
    }
  };

  const handleClearSelection = () => {
    if (selectedRange) {
      clearCellRange(selectedRange.start, selectedRange.end);
      setSelectedRange(null);
    }
  };

  const handleAddToDo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addToDo(newTodoText, newTodoColor);
      setNewTodoText("");
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen font-sans text-slate-800">
      {/* 1. Header Section */}
      <PlannerHeader
        currentDate={currentDate}
        onPrev={() => changeDate(-1)}
        onNext={() => changeDate(1)}
        onToday={goToToday}
      />

      {/* 2. Time Labels */}
      <TimeLabels />

      {/* 3. The Interactive Grid */}
      <PlannerGrid
        grid={grid}
        selectedRange={selectedRange}
        currentMinutes={currentMinutes}
        onRangeSelect={handleRangeSelect}
        onColorSelect={handleColorSelect}
        onClearSelection={handleClearSelection}
        onClosePopover={() => setSelectedRange(null)}
      />

      {/* 4. Footer Section Checks */}
      <ToDoManager
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
