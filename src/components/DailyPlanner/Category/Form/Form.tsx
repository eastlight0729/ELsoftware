import React from "react";
import { CategoryInput } from "./Input";
import { CategoryColorPicker } from "./ColorPicker/ColorPicker";

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
    <form onSubmit={onAdd} className="flex mb-3 gap-3 items-center w-full max-w-2xl p-2 pr-3 rounded-xl">
      <CategoryColorPicker color={newCategoryColor} onChange={setNewCategoryColor} />
      <CategoryInput value={newCategoryName} onChange={setNewCategoryName} />
    </form>
  );
};
