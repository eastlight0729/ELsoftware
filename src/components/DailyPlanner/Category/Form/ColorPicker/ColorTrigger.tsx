import React from "react";

interface CategoryColorTriggerProps {
  color: string;
  onClick: () => void;
}

export const CategoryColorTrigger: React.FC<CategoryColorTriggerProps> = ({ color, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      style={{ backgroundColor: color }}
      title="Pick color"
    >
      <div className="w-3 h-3 bg-white/30 rounded-full shadow-inner ring-1 ring-black/5" />
    </button>
  );
};
