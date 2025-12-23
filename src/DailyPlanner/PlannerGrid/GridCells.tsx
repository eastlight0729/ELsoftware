import React from "react";
import { GridCell } from "./GridCell";
import { Category } from "../../types";

interface GridCellsProps {
  grid: Record<number, string | null>;
  categories: Category[];
  selectedRange: { start: number; end: number } | null;
  onRangeSelect: (start: number, end: number) => void;
  onColorSelect: (color: string) => void;
  onClearSelection: () => void;
  onClosePopover: () => void;
}

export const GridCells: React.FC<GridCellsProps> = ({
  grid,
  categories,
  selectedRange,
  onRangeSelect,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  const [dragStart, setDragStart] = React.useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = React.useState<number | null>(null);

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

  const handleMouseDown = (index: number) => {
    setDragStart(index);
    setDragCurrent(index);
    onClosePopover(); // Close existing popover on new start
  };

  const handleMouseEnter = (index: number) => {
    if (dragStart !== null) {
      setDragCurrent(index);
    }
  };

  const isIndexInRange = (index: number, start: number | null, end: number | null) => {
    if (start === null || end === null) return false;
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    return index >= min && index <= max;
  };
  const getCategoryById = (id: string | null) => {
    return categories.find((c) => c.id === id);
  };

  return (
    <div className="grid grid-cols-48 h-5 w-[960px] bg-slate-50 border border-slate-200 rounded-xl shadow-inner ring-1 ring-black/5">
      {Array.from({ length: 48 }, (_, index) => {
        const categoryId = grid[index];
        const category = categoryId ? getCategoryById(categoryId) : null;
        const isDragging = isIndexInRange(index, dragStart, dragCurrent);
        const isSelected = isIndexInRange(index, selectedRange?.start ?? null, selectedRange?.end ?? null);

        // Time calculation for tooltip
        const hour = Math.floor(index / 2);
        const minute = index % 2 === 0 ? "00" : "30";
        const timeString = `${hour}:${minute}`;

        // Show popover on the last cell of the selection
        const showPopover = selectedRange && index === Math.max(selectedRange.start, selectedRange.end) && !dragStart; // Don't show while dragging

        return (
          <GridCell
            key={index}
            color={category ? category.color : categoryId || undefined}
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
