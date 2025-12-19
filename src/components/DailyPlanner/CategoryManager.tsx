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
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const colorPickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const presetColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#64748b",
  ];

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

        {/* Color Picker Trigger */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-10 h-10 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ backgroundColor: newCategoryColor }}
            title="Pick color"
          >
            <div className="w-3 h-3 bg-white/30 rounded-full shadow-inner ring-1 ring-black/5" />
          </button>

          {/* Color Picker Popover */}
          {showColorPicker && (
            <div className="absolute bottom-full right-0 mb-3 p-3 bg-white rounded-xl shadow-xl border border-slate-100 w-48 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-1 ${
                      newCategoryColor === color ? "ring-slate-400 scale-105" : "ring-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setNewCategoryColor(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <div className="relative pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-1 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-lg border border-slate-200 bg-linear-to-br from-red-500 via-green-500 to-blue-500 shadow-sm flex items-center justify-center">
                    <Plus size={14} className="text-white drop-shadow-sm" />
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">Custom</span>
                  <input
                    type="color"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
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
