import { ClipboardList, LayoutDashboard, Settings, StickyNote } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  activeCategory: "memo" | "task" | "schedule" | "setting";
  onSelectCategory: (category: "memo" | "task" | "schedule" | "setting") => void;
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
        <SidebarItem
          icon={<StickyNote size={20} />}
          label="Memo"
          isActive={activeCategory === "memo"}
          onClick={() => onSelectCategory("memo")}
          showLabel={isOpen}
        />
        <SidebarItem
          icon={<ClipboardList size={20} />}
          label="Task"
          isActive={activeCategory === "task"}
          onClick={() => onSelectCategory("task")}
          showLabel={isOpen}
        />
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Schedule"
          isActive={activeCategory === "schedule"}
          onClick={() => onSelectCategory("schedule")}
          showLabel={isOpen}
        />
      </nav>

      {/* Settings Category at the bottom */}
      <div className="p-2 z-10">
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          isActive={activeCategory === "setting"}
          onClick={() => onSelectCategory("setting")}
          showLabel={isOpen}
        />
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-neutral-100/50 dark:from-neutral-800/50 to-transparent pointer-events-none" />
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  showLabel: boolean;
}

function SidebarItem({ icon, label, isActive, onClick, showLabel }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={!showLabel ? label : undefined}
      className={`
        group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
        ${showLabel ? "w-full text-left" : "w-full justify-center"}
        relative overflow-hidden
        ${
          isActive
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-700 dark:hover:text-neutral-200"
        }
      `}
    >
      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive ? "text-emerald-500" : "group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
        }`}
      >
        {icon}
      </span>

      {showLabel && (
        <span className="relative z-10 whitespace-nowrap overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-left-2">
          {label}
        </span>
      )}
    </button>
  );
}
