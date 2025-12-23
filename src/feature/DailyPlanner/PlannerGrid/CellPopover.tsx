import React from "react";
import { PopoverHeader } from "./CellPopoverHeader";
import { NoCategoriesMessage } from "./CellPopoverNoCategoriesMessage";
import { PopoverCategoryList } from "./CellPopoverCategoryList";
import { Category } from "../../../types";

interface CellPopoverProps {
  index: number;
  timeString: string;
  category: Category | null | undefined;
  categories: Category[];
  categoryId: string | null;
  onClearCell: (index: number) => void;
  onClosePopover: () => void;
  onCategorySelect: (categoryId: string) => void;
}

export const CellPopover: React.FC<CellPopoverProps> = ({
  index,
  timeString,
  category,
  categories,
  categoryId,
  onClearCell,
  onClosePopover,
  onCategorySelect,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClosePopover();
        }}
      />
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 p-2 z-50 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <PopoverHeader
          timeString={timeString}
          category={category}
          onClear={() => {
            onClearCell(index);
            onClosePopover();
          }}
        />
        {categories.length === 0 && <NoCategoriesMessage />}
        <PopoverCategoryList categories={categories} currentCategoryId={categoryId} onSelect={onCategorySelect} />
      </div>
    </>
  );
};
