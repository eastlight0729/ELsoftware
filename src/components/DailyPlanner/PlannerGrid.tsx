import React from "react";
// Removed invalid Category import. Using local definition or could import from types.

interface Category {
  id: string;
  name: string;
  color: string;
}

import { Trash2 } from "lucide-react";

interface PlannerGridProps {
  grid: Record<number, string | null>;
  categories: Category[];
  activeCell: number | null;
  currentMinutes: number;
  onCellClick: (index: number) => void;
  onCategorySelect: (categoryId: string) => void;
  onClearCell: (index: number) => void;
  onClosePopover: () => void;
}

export const PlannerGrid: React.FC<PlannerGridProps> = ({
  grid,
  categories,
  activeCell,
  currentMinutes,
  onCellClick,
  onCategorySelect,
  onClearCell,
  onClosePopover,
}) => {
  const getCategoryById = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <div className="relative group">
      {/* Main Grid Container */}
      <div className="grid grid-cols-48 h-24 bg-slate-50 border border-slate-200 rounded-xl shadow-inner ring-1 ring-black/5">
        {Array.from({ length: 48 }, (_, index) => {
          const categoryId = grid[index];
          const category = categoryId ? getCategoryById(categoryId) : null;
          const isActive = activeCell === index;

          // Time calculation for tooltip
          const hour = Math.floor(index / 2);
          const minute = index % 2 === 0 ? "00" : "30";
          const timeString = `${hour}:${minute}`;

          return (
            <div
              key={index}
              className={`
                relative cursor-pointer transition-all duration-200
                ${!category ? "hover:bg-slate-100" : "hover:brightness-95"}
                border-r border-slate-100 last:border-r-0
                first:rounded-l-xl last:rounded-r-xl
                ${isActive ? "ring-2 ring-blue-500 z-10" : ""}
              `}
              style={{
                backgroundColor: category?.color || "transparent",
              }}
              onClick={() => onCellClick(index)} // Trigger
              title={category ? `${category.name} (${timeString})` : `Empty (${timeString})`}
            >
              {/* Popover Menu */}
              {isActive && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClosePopover();
                    }}
                  />
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 p-2 z-50 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2 ring-1 ring-black/5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-2 py-1.5 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{timeString}</span>
                      {category && (
                        <button
                          onClick={() => {
                            onClearCell(index);
                            onClosePopover();
                          }}
                          className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                        >
                          <Trash2 size={12} />
                          Clear
                        </button>
                      )}
                    </div>

                    {categories.length === 0 && (
                      <div className="text-slate-400 text-sm p-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 mx-1">
                        No categories yet.
                        <br />
                        Add one below!
                      </div>
                    )}

                    <div className="max-h-[200px] overflow-y-auto pr-1 thin-scrollbar flex flex-col gap-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          className={`
                            flex items-center gap-3 w-full p-2 text-left rounded-lg transition-all group/item
                            ${categoryId === cat.id ? "bg-blue-50 ring-1 ring-blue-500/20" : "hover:bg-slate-50"}
                          `}
                          onClick={() => onCategorySelect(cat.id)}
                        >
                          <div
                            className="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5 transition-transform group-hover/item:scale-110"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span
                            className={`text-sm font-medium truncate ${
                              categoryId === cat.id ? "text-blue-700" : "text-slate-700"
                            }`}
                          >
                            {cat.name}
                          </span>
                          {categoryId === cat.id && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Arrow for popover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] translate-y-3 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45 z-50 pointer-events-none"></div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Time Indicator */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        style={{ left: `${(currentMinutes / 1440) * 100}%` }}
      >
        <div className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
      </div>
    </div>
  );
};
