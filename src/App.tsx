import { useState, useEffect } from "react";
import { AppCategory } from "./components/sidebar/types";
import { Sidebar } from "./components/sidebar/Sidebar";
import { sidebarConfig } from "./components/sidebar/config";
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
  const { session, loading, signOut } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Sidebar: Cmd + b
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }

      // Menu Navigation: Cmd + Up/Down
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const currentIndex = sidebarConfig.findIndex((item) => item.id === activeCategory);

          let nextIndex;
          if (currentIndex === -1) {
            // Currently in Settings or unknown
            if (e.key === "ArrowUp") nextIndex = sidebarConfig.length - 1;
            else nextIndex = 0;
          } else {
            if (e.key === "ArrowUp") {
              // Wrap around to the last item if at the beginning
              nextIndex = (currentIndex - 1 + sidebarConfig.length) % sidebarConfig.length;
            } else {
              // Wrap around to the first item if at the end
              nextIndex = (currentIndex + 1) % sidebarConfig.length;
            }
          }

          setActiveCategory(sidebarConfig[nextIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCategory]);

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
    <div
      className={`min-h-screen w-full transition-all duration-500 ${
        activeCategory === "inbox"
          ? "bg-gradient-to-br from-sky-500 to-red-400"
          : "bg-neutral-100 dark:bg-neutral-800"
      } text-neutral-800 dark:text-neutral-100`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        userEmail={session.user.email}
        onLogout={signOut}
      />

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
          pl-12
          min-h-screen
        `}
      >
        {activeCategory === "task" ? (
          <div className="h-screen w-full p-1 overflow-hidden">
            <AppContent activeCategory={activeCategory} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-5 pt-24 flex flex-col items-center gap-12">
            <AppContent activeCategory={activeCategory} />
          </div>
        )}
      </main>
    </div>
  );
}
