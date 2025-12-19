import React, { useState } from "react";
import { useDailyPlanner } from "../hooks/useDailyPlanner";

export const DailyPlanner: React.FC = () => {
  // Facade Pattern: The component does not manage the domain state (the grid data).
  // It delegates data management to the 'useDailyPlanner' hook.
  // This separates the UI (View) from the Logic (Controller).
  const {
    categories,
    grid, // Array of 48 strings (or nulls), representing 30-minute blocks.
    currentDate,
    addCategory,
    assignCell,
    clearCell,
    removeCategory,
    changeDate,
    goToToday,
  } = useDailyPlanner();

  // UI State: These states control the visual interface only (Popovers, Inputs).
  // They are not part of the business logic, so they remain in the component.
  const [activeCell, setActiveCell] = useState<number | null>(null); // Index of the currently clicked 30-min slot
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3498db");

  // Animation State: Tracks the current time in minutes (0 - 1440) to position the red indicator.
  const [currentMinutes, setCurrentMinutes] = useState(0);

  // Effect: Synchronize the Red Indicator with real time.
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Convert current time to total minutes from midnight.
      // Example: 1:30 AM = 60 + 30 = 90 minutes.
      const minutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(minutes);
    };

    updateTime(); // Run immediately on mount
    const interval = setInterval(updateTime, 60000); // Update every 60 seconds

    // Cleanup: Clear interval when component unmounts to prevent memory leaks.
    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (index: number) => {
    if (grid[index]) {
      // Logic: If the user clicks a filled slot, remove the assignment.
      clearCell(index);
    } else {
      // Logic: If the user clicks an empty slot, set it as "active" to show the selection popover.
      setActiveCell(index);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (activeCell !== null) {
      assignCell(activeCell, categoryId);
      setActiveCell(null); // Close the popover
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (newCategoryName.trim()) {
      addCategory(newCategoryName, newCategoryColor);
      setNewCategoryName("");
    }
  };

  // Helper to link the grid ID string to the full category object (name, color).
  const getCategoryById = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  // Data for Header: Create an array [0, 1, ... 23] for the time labels.
  const markers = Array.from({ length: 24 }, (_, i) => i);

  // Date Formatter: Determines if the date is Today/Yesterday/Tomorrow relative to system time.
  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    if (isTomorrow) return "Tomorrow";
    return date.toLocaleDateString();
  };

  return (
    <div className="p-5 max-w-[1200px] mx-auto">
      {/* Header: Date Navigation Controls */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold m-0">Daily Planner</h2>
        <div className="flex gap-2.5 items-center">
          <button
            className="bg-transparent border border-[#ccc] rounded px-2.5 py-1.5 cursor-pointer text-base transition-colors duration-200 hover:bg-[#f0f0f0]"
            onClick={() => changeDate(-1)}
            title="Previous Day"
          >
            &lt;
          </button>
          <span
            className="font-medium min-w-[100px] text-center cursor-pointer"
            onClick={goToToday}
            title="Go to Today"
          >
            {formatDate(currentDate)}
          </span>
          <button
            className="bg-transparent border border-[#ccc] rounded px-2.5 py-1.5 cursor-pointer text-base transition-colors duration-200 hover:bg-[#f0f0f0]"
            onClick={() => changeDate(1)}
            title="Next Day"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Time Labels (0 - 23) */}
      {/* grid-cols-24: Divides the width into 24 equal columns for hour markers. */}
      <div className="grid grid-cols-24 mb-1.5 text-xs text-[#666]">
        {markers.map((hour) => (
          <div key={hour} className="text-left border-l border-[#ddd] pl-0.5">
            {hour}
          </div>
        ))}
      </div>

      {/* Main Interactive Grid */}
      {/* grid-cols-48: Divides the width into 48 columns (30-minute slots). 
                Note: This is double the resolution of the labels above. */}
      <div className="grid grid-cols-48 gap-px h-20 bg-[#e0e0e0] border border-[#ccc] rounded relative">
        {Array.from({ length: 48 }, (_, index) => {
          const categoryId = grid[index];
          const category = categoryId ? getCategoryById(categoryId) : null;

          return (
            <div
              key={index}
              className="bg-white cursor-pointer relative transition-colors duration-200 hover:brightness-95"
              style={{ backgroundColor: category?.color || "transparent" }}
              onClick={() => handleCellClick(index)}
              // Title Logic: Calculates time based on index.
              // Index 0 -> 0:00, Index 1 -> 0:30, Index 2 -> 1:00.
              title={
                category
                  ? `${category.name} (${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"})`
                  : `Empty (${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"})`
              }
            >
              {/* Popover Menu: Only renders if this specific cell is active */}
              {activeCell === index && (
                <>
                  {/* Backdrop: Invisible layer to detect clicks outside the menu */}
                  <div
                    className="fixed inset-0 z-99"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent this click from triggering grid interactions
                      setActiveCell(null); // Close menu
                    }}
                  />
                  {/* The Menu List */}
                  <div
                    className="absolute top-full left-0 mt-1.5 bg-white border border-[#ccc] p-2.5 z-100 shadow-[0_4px_15px_rgba(0,0,0,0.15)] rounded-lg min-w-[200px] flex flex-col gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-[0.85rem] text-[#888] mb-1.5">Select Activity</div>
                    {categories.length === 0 && (
                      <div style={{ padding: "5px", fontSize: "0.8rem", color: "#999" }}>
                        No categories. Add one below!
                      </div>
                    )}
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center gap-2 p-1.5 cursor-pointer rounded hover:bg-[#f5f5f5]"
                        onClick={() => handleCategorySelect(cat.id)}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Current Time Indicator (Red Triangle) */}
        <div
          className="absolute bottom-[-8px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-8 border-b-red-500 z-50 transition-[left] duration-500 ease-in-out"
          // Mathematical Positioning:
          // (currentMinutes / 1440) calculates the percentage of the day passed.
          // 1440 = 24 hours * 60 minutes.
          style={{ left: `${(currentMinutes / 1440) * 100}%` }}
          title={`Current Time: ${Math.floor(currentMinutes / 60)
            .toString()
            .padStart(2, "0")}:${(currentMinutes % 60).toString().padStart(2, "0")}`}
        />
      </div>

      {/* Footer: Category Management */}
      <div className="mt-[30px] border-t border-[#eee] pt-5">
        <h3>Categories</h3>
        <div className="flex gap-4 flex-wrap mb-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f8f8f8] rounded-[20px] border border-[#eee]"
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
              <button
                className="bg-transparent border-0 text-[#999] cursor-pointer text-xl leading-none ml-1.5 p-0 hover:text-[#ff4444]"
                onClick={() => removeCategory(cat.id)}
                title="Remove category"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Form: Create new category */}
        <form onSubmit={handleAddCategory} className="flex gap-2.5 items-center">
          <input
            type="text"
            className="px-3 py-2 border border-[#ccc] rounded-md"
            placeholder="New category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <input
            type="color"
            className="h-[35px] w-[50px] p-0 border-0 bg-transparent cursor-pointer"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#007bff] text-white border-0 rounded-md cursor-pointer font-medium hover:bg-[#0056b3]"
          >
            Add new things to do
          </button>
        </form>
      </div>
    </div>
  );
};
