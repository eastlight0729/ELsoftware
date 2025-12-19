import React from "react";

interface ColorGridProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Gray", value: "#6b7280" },
];

export const ColorGrid: React.FC<ColorGridProps> = ({ color, onChange, onClose }) => {
  return (
    <div className="flex gap-1.5 justify-between">
      {COLORS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          aria-label={`Select ${label}`}
          title={label}
          className={`w-5 h-5 rounded-full transition-all focus:outline-none ring-offset-1 ${
            color === value ? "ring-2 ring-slate-400 scale-110" : "ring-transparent hover:scale-110"
          }`}
          style={{ backgroundColor: value }}
          onClick={() => {
            onChange(value);
            onClose();
          }}
        />
      ))}
    </div>
  );
};
