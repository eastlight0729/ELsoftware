import React from "react";
import { PopoverHeader } from "./CellPopoverHeader";
import { ColorGrid } from "./PopoverColorGrid";

/**
 * Props for the CellPopover component.
 */
interface CellPopoverProps {
  /** The time range label to display in the header. */
  timeString: string;
  /** The current color of the selected cell(s). */
  color: string;
  /** Callback to clear the color from the selected cell(s). */
  onClear: () => void;
  /** Callback to dismiss the popover. */
  onClosePopover: () => void;
  /** Callback triggered when a color is picked. */
  onColorSelect: (color: string) => void;
}

/**
 * CellPopover Component
 * A floating menu that erscheint when a user clicks or drags on the planner grid.
 * Allows choosing a color for the selected time slot or clearing it.
 */
export const CellPopover: React.FC<CellPopoverProps> = ({
  timeString,
  color,
  onClear,
  onClosePopover,
  onColorSelect,
}) => {
  return (
    <>
      {/* 
        Full-screen transparent overlay to capture clicks outside the popover 
        and close it.
      */}
      <div
        className="fixed inset-0 z-40"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClosePopover();
        }}
      />

      {/* 
        The actual popover content box.
        Positioned relative to the selected grid cell.
      */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 p-3 z-50 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3 ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with time info and clear button */}
        <PopoverHeader
          timeString={timeString}
          showClear={!!color}
          onClear={() => {
            onClear();
            onClosePopover();
          }}
        />

        {/* Grid of colors for assignment */}
        <ColorGrid
          color={color}
          onChange={(newColor) => {
            onColorSelect(newColor);
            onClosePopover();
          }}
          onClose={onClosePopover}
        />
      </div>
    </>
  );
};
