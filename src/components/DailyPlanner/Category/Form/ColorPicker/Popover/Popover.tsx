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
    <div className="absolute bottom-full right-0 mb-3 p-3 bg-white rounded-xl shadow-xl border border-slate-100 w-48 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <ColorGrid color={color} onChange={onChange} onClose={onClose} />
    </div>
  );
};
