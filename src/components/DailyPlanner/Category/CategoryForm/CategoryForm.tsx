import React from "react";
import { CategoryInput } from "./CategoryInput";
import { CategoryColorPicker } from "./CategoryColorPicker/CategoryColorPicker";
import { CategoryAddButton } from "./CategoryAddButton";

interface CategoryFormProps {
  onAdd: (e: React.FormEvent) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newCategoryColor: string;
  setNewCategoryColor: (color: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onAdd,
  newCategoryName,
  setNewCategoryName,
  newCategoryColor,
  setNewCategoryColor,
}) => {
  return (
    <form onSubmit={onAdd} className="flex gap-3 items-center w-full max-w-2xl bg-white p-2 pr-3 rounded-xl">
      <CategoryInput value={newCategoryName} onChange={setNewCategoryName} />
      <CategoryColorPicker color={newCategoryColor} onChange={setNewCategoryColor} />
      <CategoryAddButton />
    </form>
  );
};
