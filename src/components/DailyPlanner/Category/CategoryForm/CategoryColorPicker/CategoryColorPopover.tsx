import React from "react";
import { Plus } from "lucide-react";

interface CategoryColorPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const CategoryColorPopover: React.FC<CategoryColorPopoverProps> = ({ color, onChange, onClose }) => {
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
    <div className="absolute bottom-full right-0 mb-3 p-3 bg-white rounded-xl shadow-xl border border-slate-100 w-48 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
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
      <div className="relative pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-linear-to-br from-red-500 via-green-500 to-blue-500 shadow-sm flex items-center justify-center">
            <Plus size={14} className="text-white drop-shadow-sm" />
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">Custom</span>
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};
