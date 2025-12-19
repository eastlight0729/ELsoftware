import React from "react";

interface ColorGridProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const ColorGrid: React.FC<ColorGridProps> = ({ color, onChange, onClose }) => {
  const presetColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#64748b",
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {presetColors.map((presetColor) => (
        <button
          key={presetColor}
          type="button"
          className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-1 ${
            color === presetColor ? "ring-slate-400 scale-105" : "ring-transparent"
          }`}
          style={{ backgroundColor: presetColor }}
          onClick={() => {
            onChange(presetColor);
            onClose();
          }}
        />
      ))}
    </div>
  );
};
