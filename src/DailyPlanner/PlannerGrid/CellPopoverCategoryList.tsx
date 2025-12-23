import React from "react";
import { Category } from "../../../types";

interface PopoverCategoryListProps {
  categories: Category[];
  currentCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

export const PopoverCategoryList: React.FC<PopoverCategoryListProps> = ({
  categories,
  currentCategoryId,
  onSelect,
}) => {
  return (
    <div className="max-h-[200px] overflow-y-auto pr-1 thin-scrollbar flex flex-col gap-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`
            flex items-center gap-3 w-full p-2 text-left rounded-lg transition-all group/item
            ${currentCategoryId === cat.id ? "bg-blue-50 ring-1 ring-blue-500/20" : "hover:bg-slate-50"}
          `}
          onClick={() => onSelect(cat.id)}
        >
          <div
            className="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/5 transition-transform group-hover/item:scale-110"
            style={{ backgroundColor: cat.color }}
          />
          <span
            className={`text-sm font-medium truncate ${
              currentCategoryId === cat.id ? "text-blue-700" : "text-slate-700"
            }`}
          >
            {cat.name}
          </span>
          {currentCategoryId === cat.id && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
        </button>
      ))}
    </div>
  );
};
