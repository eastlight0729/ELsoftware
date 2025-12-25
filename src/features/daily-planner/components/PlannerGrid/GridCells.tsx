import React from "react";
import { GridCell } from "./GridCell";

/**
 * Props for the GridCells component.
 */
interface GridCellsProps {
  /** The grid data for the current date. */
  grid: Record<number, string | null>;
  /** The currently selected range {start, end}. */
  selectedRange: { start: number; end: number } | null;
  /** Callback to notify parent of a completed range selection. */
  onRangeSelect: (start: number, end: number) => void;
  /** Callback triggered when a color is selected for the current range. */
  onColorSelect: (color: string) => void;
  /** Callback triggered to clear the current range. */
  onClearSelection: () => void;
  /** Callback to close the active selection popover. */
  onClosePopover: () => void;
}

/**
 * GridCells Component
 * Manages the collection of 48 time-block cells (30-minute intervals).
 * Implements the drag-to-select logic including mouse event handling and visual feedback.
 */
export const GridCells: React.FC<GridCellsProps> = ({
  grid,
  selectedRange,
  onRangeSelect,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  // --- Dragging State ---
  /** The index where the user started dragging. */
  const [dragStart, setDragStart] = React.useState<number | null>(null);
  /** The current index the user is hovering over while dragging. */
  const [dragCurrent, setDragCurrent] = React.useState<number | null>(null);

  /**
   * Effect to handle global mouseup events.
   * Ensures that selection is finalized even if the user releases the mouse outside the grid.
   */
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragStart !== null && dragCurrent !== null) {
        onRangeSelect(dragStart, dragCurrent);
        setDragStart(null);
        setDragCurrent(null);
      }
    };

    if (dragStart !== null) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragStart, dragCurrent, onRangeSelect]);

  // --- Handlers ---

  /**
   * Initializes the drag selection process.
   */
  const handleMouseDown = (index: number) => {
    setDragStart(index);
    setDragCurrent(index);
    onClosePopover(); // Close existing popover if starting a new selection
  };

  /**
   * Updates the ongoing selection as the mouse moves across cells.
   */
  const handleMouseEnter = (index: number) => {
    if (dragStart !== null) {
      setDragCurrent(index);
    }
  };

  /**
   * Utility to check if a specific index falls within a provided range.
   */
  const isIndexInRange = (index: number, start: number | null, end: number | null) => {
    if (start === null || end === null) return false;
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    return index >= min && index <= max;
  };

  return (
    <div className="grid grid-cols-48 h-5 w-[960px] bg-slate-50 border border-slate-200 rounded-xl shadow-inner ring-1 ring-black/5">
      {/* Create 48 cells representing 30-minute blocks in a 24-hour day. */}
      {Array.from({ length: 48 }, (_, index) => {
        const color = grid[index];
        /** Cell is visually 'dragging' if active drag state includes it. */
        const isDragging = isIndexInRange(index, dragStart, dragCurrent);
        /** Cell is 'selected' if the parent's finalized range includes it. */
        const isSelected = isIndexInRange(index, selectedRange?.start ?? null, selectedRange?.end ?? null);

        // Time calculation (Index 0 = 00:00, Index 1 = 00:30, Index 2 = 01:00, etc.)
        const hour = Math.floor(index / 2);
        const minute = index % 2 === 0 ? "00" : "30";
        const timeString = `${hour}:${minute}`;

        /**
         * Logic to show the popover:
         * We show it on the cell with the highest index in the selected range,
         * but ONLY if dragging has stopped.
         */
        const showPopover = selectedRange && index === Math.max(selectedRange.start, selectedRange.end) && !dragStart;

        return (
          <GridCell
            key={index}
            color={color || undefined}
            isSelected={isSelected || isDragging}
            showPopover={!!showPopover}
            timeString={timeString}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onColorSelect={onColorSelect}
            onClearSelection={onClearSelection}
            onClosePopover={onClosePopover}
          />
        );
      })}
    </div>
  );
};
