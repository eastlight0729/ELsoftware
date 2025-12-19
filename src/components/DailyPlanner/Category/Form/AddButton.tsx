import React from "react";
import { Plus } from "lucide-react";

interface CategoryAddButtonProps {
  // Allow extending button props if needed in future
  className?: string;
  onClick?: () => void; // Optional if button is just type="submit" in form
}

export const CategoryAddButton: React.FC<CategoryAddButtonProps> = ({ className = "", onClick }) => {
  return (
    <button
      type="submit"
      className={`ml-2 bg-slate-900 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center ${className}`}
      title="Add Category"
      onClick={onClick}
    >
      <Plus size={18} />
    </button>
  );
};
