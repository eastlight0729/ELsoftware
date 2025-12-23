import React from "react";
import { Category } from "../../types";
import { GridCells } from "./GridCells";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";

interface PlannerGridProps {
  grid: Record<number, string | null>;
  categories: Category[];
  selectedRange: { start: number; end: number } | null;
  currentMinutes: number;
  onRangeSelect: (start: number, end: number) => void;
  onColorSelect: (color: string) => void;
  onClearSelection: () => void;
  onClosePopover: () => void;
}

export const PlannerGrid: React.FC<PlannerGridProps> = ({
  grid,
  categories,
  selectedRange,
  currentMinutes,
  onRangeSelect,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  return (
    <div className="relative group">
      <GridCells
        grid={grid}
        categories={categories}
        selectedRange={selectedRange}
        onRangeSelect={onRangeSelect}
        onColorSelect={onColorSelect}
        onClearSelection={onClearSelection}
        onClosePopover={onClosePopover}
      />
      <CurrentTimeIndicator currentMinutes={currentMinutes} />
    </div>
  );
};
