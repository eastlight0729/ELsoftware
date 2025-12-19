import React from "react";
import { ColorGrid } from "./ColorGrid";

interface CategoryColorPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const CategoryColorPopover: React.FC<CategoryColorPopoverProps> = ({ color, onChange, onClose }) => {
  // Preset colors moved to ColorGrid

  return (
    <div className="absolute bottom-full left-0 mb-3 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-spread overflow-hidden">
      <div className="w-48 p-3">
        <ColorGrid color={color} onChange={onChange} onClose={onClose} />
      </div>
    </div>
  );
};
