import { useState, useEffect } from "react";
import { AppCategory } from "./components/navigation/types";
import { Navigation } from "./components/navigation/Navigation";
import { navigationConfig } from "./components/navigation/config";
import { AppContent } from "./AppContent";

import { useAuth, Login } from "./features/auth";
import { Loader2 } from "lucide-react";

/**
 * Root Application Component.
 *
 * Serving as the main layout container, it orchestrates:
 * - The navigation logic via `activeCategory`.
 * - The main content rendering via `AppContent`.
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<AppCategory>("memo");
  const { session, loading, signOut } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Menu Navigation: Cmd + Left/Right (Changed from Up/Down for Dock)
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const currentIndex = navigationConfig.findIndex((item) => item.id === activeCategory);

          let nextIndex;
          if (currentIndex === -1) {
            // Currently in Settings or unknown
            if (e.key === "ArrowLeft") nextIndex = navigationConfig.length - 1;
            else nextIndex = 0;
          } else {
            if (e.key === "ArrowLeft") {
              // Wrap around to the last item if at the beginning
              nextIndex = (currentIndex - 1 + navigationConfig.length) % navigationConfig.length;
            } else {
              // Wrap around to the first item if at the end
              nextIndex = (currentIndex + 1) % navigationConfig.length;
            }
          }

          setActiveCategory(navigationConfig[nextIndex].id);
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
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors duration-200">
      
      {/* Main Content Area */}
      {/* 
          Added pb-32 to accomodate the floating dock at the bottom.
          Removed pl-12 since navigation is now a dock.
      */}
      <main
        className={`
          transition-[padding] duration-300 ease-in-out
          pb-32
          min-h-screen
        `}
      >
        {activeCategory === "task" ? (
          <div className="h-screen w-full p-1 overflow-hidden">
            <AppContent
              activeCategory={activeCategory}
              userEmail={session.user.email}
              onLogout={signOut}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-5 pt-24 flex flex-col items-center gap-12">
            <AppContent
              activeCategory={activeCategory}
              userEmail={session.user.email}
              onLogout={signOut}
            />
          </div>
        )}
      </main>

      <Navigation
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
    </div>
  );
}

