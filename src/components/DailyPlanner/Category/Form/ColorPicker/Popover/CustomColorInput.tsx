import React from "react";
import { Plus } from "lucide-react";

interface CustomColorInputProps {
  color: string;
  onChange: (color: string) => void;
}

export const CustomColorInput: React.FC<CustomColorInputProps> = ({ color, onChange }) => {
  return (
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
  );
};
