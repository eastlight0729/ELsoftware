import React from "react";
import { GridCell } from "./GridCell";
import { Category } from "../../../types";

interface GridCellsProps {
  grid: Record<number, string | null>;
  categories: Category[];
  activeCell: number | null;
  onCellClick: (index: number) => void;
  onCategorySelect: (categoryId: string) => void;
  onClearCell: (index: number) => void;
  onClosePopover: () => void;
}

export const GridCells: React.FC<GridCellsProps> = ({
  grid,
  categories,
  activeCell,
  onCellClick,
  onCategorySelect,
  onClearCell,
  onClosePopover,
}) => {
  const getCategoryById = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  return (
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
          <GridCell
            key={index}
            index={index}
            category={category}
            isActive={isActive}
            timeString={timeString}
            categories={categories}
            categoryId={categoryId}
            onCellClick={onCellClick}
            onCategorySelect={onCategorySelect}
            onClearCell={onClearCell}
            onClosePopover={onClosePopover}
          />
        );
      })}
    </div>
  );
};
