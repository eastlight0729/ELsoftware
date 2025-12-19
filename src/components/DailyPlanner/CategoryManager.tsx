import React from "react";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
}

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
    <div className="mt-8 bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        Categories
      </h3>

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

      <form
        onSubmit={onAdd}
        className="flex gap-3 items-center w-full max-w-2xl bg-white p-2 pr-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all shadow-sm"
      >
        <input
          type="text"
          className="flex-1 px-3 py-2 bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-sm font-medium"
          placeholder="New category name..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
        />
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        <div className="relative group/color cursor-pointer">
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            title="Pick color"
          />
          <div
            className="w-8 h-8 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center group-hover/color:scale-110 transition-transform"
            style={{ backgroundColor: newCategoryColor }}
          ></div>
        </div>
        <button
          type="submit"
          className="ml-2 bg-slate-900 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
          title="Add Category"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};
