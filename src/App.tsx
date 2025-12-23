import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Calendar } from "./Calendar/Calendar";
import { DailyPlanner } from "./DailyPlanner/DailyPlanner";
import { PomodoroTimer } from "./PomodoroTimer/PomodoroTimer";
import { Memo } from "./Memo/Memo";
import { Sidebar } from "./Sidebar/Sidebar";

/* Root Application Component. This component serves as the main layout container. It orchestrates the rendering of core productivity features in a centralized, vertical layout. */
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"memo" | "task" | "schedule" | "setting">("schedule");

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors duration-200">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* Sidebar Toggle Button */}
      {/* Placed fixed at top-left to be always accessible */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-5 left-3 z-50 p-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-all duration-200 text-neutral-600 dark:text-neutral-200"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for Overlay Mode */}
      {/* Covers the main content when sidebar is open, effectively dimming and blurring it */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      {/* 
          Padding is always pl-16 (mini-sidebar width).
          When sidebar opens to w-64, it overlays the content instead of pushing it.
      */}
      <main
        className={`
          transition-[padding] duration-300 ease-in-out
          pl-16
          min-h-screen
        `}
      >
        <div className="max-w-7xl mx-auto p-5 pt-24 flex flex-col items-center gap-12">
          {activeCategory === "schedule" ? (
            <>
              <Calendar />
              <PomodoroTimer />
              <DailyPlanner />
            </>
          ) : activeCategory === "task" ? (
            /* Task View - Empty for now */
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl">
              <span className="text-xl font-medium">Tasks</span>
              <span className="text-sm mt-2">No features yet. Just empty space.</span>
            </div>
          ) : activeCategory === "memo" ? (
            <Memo />
          ) : (
            /* Settings View - Empty for now */
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl">
              <span className="text-xl font-medium">Settings</span>
              <span className="text-sm mt-2">No features yet. Just empty space.</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
