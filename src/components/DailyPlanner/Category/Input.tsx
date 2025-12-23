import React from "react";

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Allow extending styles if needed
}

export const CategoryInput: React.FC<CategoryInputProps> = ({
  value,
  onChange,
  placeholder = "New category name...",
  className = "",
}) => {
  return (
    <input
      type="text"
      className={`flex-1 px-3 py-2 bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-sm font-medium ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
};
