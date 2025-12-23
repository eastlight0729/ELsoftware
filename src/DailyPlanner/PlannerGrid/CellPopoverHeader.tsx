import React from "react";
import { Trash2 } from "lucide-react";

interface PopoverHeaderProps {
  timeString: string;
  showClear: boolean;
  onClear: () => void;
}

export const PopoverHeader: React.FC<PopoverHeaderProps> = ({ timeString, showClear, onClear }) => {
  return (
    <div className="px-2 py-1.5 border-b border-slate-100 flex justify-between items-center">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{timeString}</span>
      {showClear && (
        <button
          onClick={onClear}
          className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      )}
    </div>
  );
};
