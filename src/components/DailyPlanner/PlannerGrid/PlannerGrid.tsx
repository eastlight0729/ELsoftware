import React from "react";
import { Category } from "../../../types";
import { GridCells } from "./GridCells";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";

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
  return (
    <div className="relative group">
      <GridCells
        grid={grid}
        categories={categories}
        activeCell={activeCell}
        onCellClick={onCellClick}
        onCategorySelect={onCategorySelect}
        onClearCell={onClearCell}
        onClosePopover={onClosePopover}
      />
      <CurrentTimeIndicator currentMinutes={currentMinutes} />
    </div>
  );
};
