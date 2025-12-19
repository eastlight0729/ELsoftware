import React from "react";
import { X } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryListProps {
  categories: Category[];
  onRemove: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onRemove }) => {
  return (
    /* Displays the list of existing categories as interactive tags with removal capability. */
    <div className="flex gap-3 flex-wrap mb-6">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all hover:border-blue-100"
        >
          <div className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: cat.color }} />
          <span className="text-sm font-medium text-slate-700">{cat.name}</span>
          <button
            className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-1 opacity-0 group-hover:opacity-100"
            onClick={() => onRemove(cat.id)}
            title="Remove category"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      ))}
      {categories.length === 0 && <div className="text-sm text-slate-400 italic">No categories added yet.</div>}
    </div>
  );
};
