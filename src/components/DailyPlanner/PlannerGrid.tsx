import React from "react";
// Removed invalid Category import. Using local definition or could import from types.

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PlannerGridProps {
  grid: Record<number, string | null>;
  categories: Category[];
  activeCell: number | null;
  currentMinutes: number;
  onCellClick: (index: number) => void;
  onCategorySelect: (categoryId: string) => void;
  onClosePopover: () => void;
}

export const PlannerGrid: React.FC<PlannerGridProps> = ({
  grid,
  categories,
  activeCell,
  currentMinutes,
  onCellClick,
  onCategorySelect,
  onClosePopover,
}) => {
  const getCategoryById = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <div className="relative group">
      {/* Main Grid Container */}
      <div className="grid grid-cols-48 h-24 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner ring-1 ring-black/5">
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
              `}
              style={{
                backgroundColor: category?.color || "transparent",
              }}
              onClick={() => onCellClick(index)}
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/80 backdrop-blur-xl border border-white/20 p-3 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider px-1">
                      Select Activity for {timeString}
                    </div>

                    {categories.length === 0 && (
                      <div className="text-slate-400 text-sm p-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        No categories yet.
                        <br />
                        Add one below!
                      </div>
                    )}

                    <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1 thin-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          className="flex items-center gap-3 w-full p-2 text-left rounded-lg hover:bg-slate-100/80 transition-colors group/item"
                          onClick={() => onCategorySelect(cat.id)}
                        >
                          <span
                            className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-sm font-medium text-slate-700 group-hover/item:text-slate-900 truncate">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Arrow for popover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] border-l-8 border-r-8 border-b-8 border-transparent border-b-white z-50 drop-shadow-sm pointer-events-none"></div>
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
