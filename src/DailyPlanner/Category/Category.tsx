import React from "react";

import { CategoryList, Category } from "./List";
import { CategoryForm } from "./Form";

interface CategoryManagerProps {
  categories: Category[];
  onRemove: (id: string) => void;
  onAdd: (e: React.FormEvent) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newCategoryColor: string;
  setNewCategoryColor: (color: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onRemove,
  onAdd,
  newCategoryName,
  setNewCategoryName,
  newCategoryColor,
  setNewCategoryColor,
}) => {
  return (
    <div className="mt-3 bg-white/40 backdrop-blur-md rounded-2xl px-5 p-3 border border-slate-200/60 shadow-sm">
      <CategoryForm
        onAdd={onAdd}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
      />
      <CategoryList categories={categories} onRemove={onRemove} />
    </div>
  );
};
