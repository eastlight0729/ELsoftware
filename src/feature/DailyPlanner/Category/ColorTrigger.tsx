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
      className="w-6 h-6 rounded-lg shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      style={{ backgroundColor: color }}
      title="Pick color"
    />
  );
};
