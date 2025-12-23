import React from "react";
import { CellPopover } from "./CellPopover";
import { Category } from "../../../types";

interface GridCellProps {
  index: number;
  category: Category | null | undefined;
  isActive: boolean;
  timeString: string;
  categories: Category[];
  categoryId: string | null;
  onCellClick: (index: number) => void;
  onCategorySelect: (categoryId: string) => void;
  onClearCell: (index: number) => void;
  onClosePopover: () => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  index,
  category,
  isActive,
  timeString,
  categories,
  categoryId,
  onCellClick,
  onCategorySelect,
  onClearCell,
  onClosePopover,
}) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${!category ? "hover:bg-slate-100" : "hover:brightness-95"}
        border-r border-slate-100 last:border-r-0
        first:rounded-l-xl last:rounded-r-xl
        ${isActive ? "ring-2 ring-blue-500 z-10" : ""}
      `}
      style={{
        backgroundColor: category?.color || "transparent",
      }}
      onClick={() => onCellClick(index)} // Trigger
      title={category ? `${category.name} (${timeString})` : `Empty (${timeString})`}
    >
      {isActive && (
        <CellPopover
          index={index}
          timeString={timeString}
          category={category}
          categories={categories}
          categoryId={categoryId}
          onClearCell={onClearCell}
          onClosePopover={onClosePopover}
          onCategorySelect={onCategorySelect}
        />
      )}
    </div>
  );
};
