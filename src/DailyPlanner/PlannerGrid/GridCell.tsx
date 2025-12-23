import React from "react";
import { CellPopover } from "./CellPopover";

interface GridCellProps {
  color: string | undefined | null;
  isSelected: boolean;
  showPopover: boolean;
  timeString: string;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onColorSelect: (color: string) => void;
  onClearSelection: () => void;
  onClosePopover: () => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  color,
  isSelected,
  showPopover,
  timeString,
  onMouseDown,
  onMouseEnter,
  onColorSelect,
  onClearSelection,
  onClosePopover,
}) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${!color ? "hover:bg-slate-100" : "hover:brightness-95"}
        border-r border-slate-100 last:border-r-0
        first:rounded-l-xl last:rounded-r-xl
        ${isSelected ? "ring-2 ring-blue-500 z-10" : ""}
      `}
      style={{
        backgroundColor: color || "transparent",
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      title={color ? `Color: ${color} (${timeString})` : `Empty (${timeString})`}
    >
      {showPopover && (
        <CellPopover
          timeString={timeString}
          color={color || ""}
          onClear={onClearSelection}
          onClosePopover={onClosePopover}
          onColorSelect={onColorSelect}
        />
      )}
    </div>
  );
};
