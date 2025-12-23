import React from "react";
import { PopoverHeader } from "./CellPopoverHeader";
import { ColorGrid } from "./PopoverColorGrid";

interface CellPopoverProps {
  timeString: string;
  color: string;
  onClear: () => void;
  onClosePopover: () => void;
  onColorSelect: (color: string) => void;
}

export const CellPopover: React.FC<CellPopoverProps> = ({
  timeString,
  color,
  onClear,
  onClosePopover,
  onColorSelect,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClosePopover();
        }}
      />
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 p-3 z-50 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3 ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <PopoverHeader
          timeString={timeString}
          showClear={!!color}
          onClear={() => {
            onClear();
            onClosePopover();
          }}
        />
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
