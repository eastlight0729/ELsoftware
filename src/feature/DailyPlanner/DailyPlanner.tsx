import React, { useState } from "react";
import { useDailyPlanner } from "./useDailyPlanner";
import { PlannerHeader } from "./PlannerHeader/PlannerHeader";
import { TimeLabels } from "./TimeLabels/Timelabels";
import { PlannerGrid } from "./PlannerGrid/PlannerGrid";
import { CategoryManager } from "./Category/Category";

export const DailyPlanner: React.FC = () => {
  const {
    categories,
    grid,
    currentDate,
    addCategory,
    // assignCell, // removed
    assignCellRange,
    // clearCell, // removed
    clearCellRange,
    removeCategory,
    changeDate,
    goToToday,
  } = useDailyPlanner();

  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3498db");
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

  const handleCategorySelect = (categoryId: string) => {
    if (selectedRange) {
      assignCellRange(selectedRange.start, selectedRange.end, categoryId);
      setSelectedRange(null);
    }
  };

  const handleClearSelection = () => {
    if (selectedRange) {
      clearCellRange(selectedRange.start, selectedRange.end);
      setSelectedRange(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName, newCategoryColor);
      setNewCategoryName("");
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
        categories={categories}
        selectedRange={selectedRange}
        currentMinutes={currentMinutes}
        onRangeSelect={handleRangeSelect}
        onCategorySelect={handleCategorySelect}
        onClearSelection={handleClearSelection}
        onClosePopover={() => setSelectedRange(null)}
      />

      {/* 4. Footer Section */}
      <CategoryManager
        categories={categories}
        onRemove={removeCategory}
        onAdd={handleAddCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
      />
    </div>
  );
};
