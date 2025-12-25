import { useState } from "react";
import { AppCategory } from "./components/sidebar/types";
import { Sidebar } from "./components/sidebar/Sidebar";
import { SidebarTrigger } from "./components/sidebar/SidebarTrigger";
import { SidebarBackdrop } from "./components/sidebar/SidebarBackdrop";
import { AppContent } from "./AppContent";

import { useAuth, Login } from "./features/auth";
import { Loader2 } from "lucide-react";

/**
 * Root Application Component.
 *
 * Serving as the main layout container, it orchestrates:
 * - The responsive Sidebar and its state.
 * - The navigation logic via `activeCategory`.
 * - The main content rendering via `AppContent`.
 */
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AppCategory>("memo");
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <SidebarTrigger isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <SidebarBackdrop isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
          <AppContent activeCategory={activeCategory} />
        </div>
      </main>
    </div>
  );
}
