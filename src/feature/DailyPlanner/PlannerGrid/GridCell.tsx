import React from "react";
import { CellPopover } from "./CellPopover";
import { Category } from "../../../types";

interface GridCellProps {
  category: Category | null | undefined;
  isSelected: boolean;
  showPopover: boolean;
  timeString: string;
  categories: Category[];
  categoryId: string | null;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onCategorySelect: (categoryId: string) => void;
  onClearSelection: () => void;
  onClosePopover: () => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  category,
  isSelected,
  showPopover,
  timeString,
  categories,
  categoryId,
  onMouseDown,
  onMouseEnter,
  onCategorySelect,
  onClearSelection,
  onClosePopover,
}) => {
  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${!category ? "hover:bg-slate-100" : "hover:brightness-95"}
        border-r border-slate-100 last:border-r-0
        first:rounded-l-xl last:rounded-r-xl
        ${isSelected ? "ring-2 ring-blue-500 z-10" : ""}
      `}
      style={{
        backgroundColor: category?.color || "transparent",
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      title={category ? `${category.name} (${timeString})` : `Empty (${timeString})`}
    >
      {showPopover && (
        <CellPopover
          timeString={timeString}
          category={category}
          categories={categories}
          categoryId={categoryId}
          onClear={onClearSelection}
          onClosePopover={onClosePopover}
          onCategorySelect={onCategorySelect}
        />
      )}
    </div>
  );
};
