import React from "react";
import { GridCells } from "./GridCells";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";

/**
 * Props for the PlannerGrid component.
 */
interface PlannerGridProps {
  /** The planning data for the current date (index -> color). */
  grid: Record<number, string | null>;
  /** The range of cells currently being selected or modified. */
  selectedRange: { start: number; end: number } | null;
  /** The current time in minutes from the start of the day. */
  currentMinutes: number;
  /** Callback triggered when a new range selection is finalized. */
  onRangeSelect: (start: number, end: number) => void;
  /** Callback triggered when a color is chosen from the picker. */
  onColorSelect: (color: string) => void;
  /** Callback triggered to clear the selected range. */
  onClearSelection: () => void;
  /** Callback triggered to close any open UI menus (popovers). */
  onClosePopover: () => void;
}

/**
 * PlannerGrid Component
 * The main container for the interactive part of the planner.
 * Bundles the GridCells (for interaction) and the CurrentTimeIndicator (for visual feedback).
 */
export const PlannerGrid: React.FC<PlannerGridProps> = ({
  grid,
  selectedRange,
  currentMinutes,
  onRangeSelect,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  return (
    <div className="relative group">
      {/* The array of interactive time blocks */}
      <GridCells
        grid={grid}
        selectedRange={selectedRange}
        onRangeSelect={onRangeSelect}
        onColorSelect={onColorSelect}
        onClearSelection={onClearSelection}
        onClosePopover={onClosePopover}
      />

      {/* The vertical red line indicating the current real-world time */}
      <CurrentTimeIndicator currentMinutes={currentMinutes} />
    </div>
  );
};
