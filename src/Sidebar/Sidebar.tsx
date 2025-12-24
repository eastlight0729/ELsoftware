import { AppCategory } from "./types";
import { SidebarItem } from "./SidebarItem";
import { sidebarConfig, settingsConfig } from "./config";

interface SidebarProps {
  isOpen: boolean;
  activeCategory: AppCategory;
  onSelectCategory: (category: AppCategory) => void;
}

export function Sidebar({ isOpen, activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        ${isOpen ? "w-64" : "w-16"}
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
        border-r border-neutral-200 dark:border-neutral-800
        transition-all duration-300 ease-in-out
        pt-20 shadow-2xl pb-4
      `}
    >
      <div className={`px-4 mb-6 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">Menu</h2>
      </div>

      <nav className="flex flex-col gap-2 p-2 flex-1">
        {sidebarConfig.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeCategory === item.id}
            onClick={() => onSelectCategory(item.id)}
            showLabel={isOpen}
          />
        ))}
      </nav>

      {/* Settings Category at the bottom */}
      <div className="p-2 z-10">
        <SidebarItem
          icon={settingsConfig.icon}
          label={settingsConfig.label}
          isActive={activeCategory === settingsConfig.id}
          onClick={() => onSelectCategory(settingsConfig.id)}
          showLabel={isOpen}
        />
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-neutral-100/50 dark:from-neutral-800/50 to-transparent pointer-events-none" />
    </aside>
  );
}
