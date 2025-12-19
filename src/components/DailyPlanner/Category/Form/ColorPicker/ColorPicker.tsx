import React from "react";
import { CategoryColorTrigger } from "./ColorTrigger";
import { CategoryColorPopover } from "./Popover/Popover";

interface CategoryColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const CategoryColorPicker: React.FC<CategoryColorPickerProps> = ({ color, onChange }) => {
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

  return (
    <div className="relative" ref={colorPickerRef}>
      <CategoryColorTrigger color={color} onClick={() => setShowColorPicker(!showColorPicker)} />
      {showColorPicker && (
        <CategoryColorPopover color={color} onChange={onChange} onClose={() => setShowColorPicker(false)} />
      )}
    </div>
  );
};
