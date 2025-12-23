import { ClipboardList, LayoutDashboard } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  activeCategory: "task" | "schedule";
  onSelectCategory: (category: "task" | "schedule") => void;
}

export function Sidebar({ isOpen, activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40
        ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"}
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
        border-r border-neutral-200 dark:border-neutral-800
        transition-transform duration-300 ease-in-out
        pt-20 shadow-2xl
      `}
    >
      <div className="px-4 mb-6">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">Menu</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4 pt-0">
        <SidebarItem
          icon={<ClipboardList size={20} />}
          label="Task"
          isActive={activeCategory === "task"}
          onClick={() => onSelectCategory("task")}
        />
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Schedule"
          isActive={activeCategory === "schedule"}
          onClick={() => onSelectCategory("schedule")}
        />
      </nav>

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
}

function SidebarItem({ icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        text-sm font-medium w-full text-left relative overflow-hidden
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
      <span className="relative z-10">{label}</span>

      {/* Active Indicator */}
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />}
    </button>
  );
}
