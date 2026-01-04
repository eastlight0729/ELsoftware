import { useState, useEffect } from "react";
import { AppCategory } from "./components/navigation/types";
import { Navigation } from "./components/navigation/Navigation";
import { navigationConfig } from "./components/navigation/config";
import { AppContent } from "./AppContent";

import { useAuth, Login } from "./features/auth";
import { useBackground } from "./features/settings";
import { Loader2 } from "lucide-react";

/**
 * Root Application Component.
 *
 * Serving as the main layout container, it orchestrates:
 * - The navigation logic via `activeCategory`.
 * - The main content rendering via `AppContent`.
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<AppCategory>("inbox");
  const { session, loading, signOut } = useAuth();
  
  // Background Settings Logic
  // Background Settings Logic
  const { backgroundPath } = useBackground();
  
  // We don't need local state 'bgImage' anymore since we have direct access to backgroundPath 
  // via the hook which already handles sync via events.
  // Actually, wait, useBackground hook gives us the current state.
  // The 'backgroundPath' from useBackground is already a state variable in that hook.
  // So we can just use `backgroundPath` directly?
  // Yes, because useBackground listens to the event and updates its own state.
  // So we just need:
  
  // (No useEffect needed here for bgImage sync because the hook does it)

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

  // If a custom background image is set, use it.
  // Otherwise, use the category-specific background classes.
  // If a custom background image is set, use it.
  // Otherwise, use the category-specific background classes.
  const backgroundStyle = backgroundPath
    ? {
        backgroundImage: `url("${backgroundPath}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div
      style={backgroundStyle}
      className={`min-h-screen w-full transition-all duration-500 ${
        backgroundPath 
          ? "" // If image is set, we don't need background colors
          : activeCategory === "inbox"
            ? "bg-gradient-to-br from-sky-500 to-red-400"
            : "bg-neutral-100 dark:bg-neutral-800"
      } text-neutral-800 dark:text-neutral-100`}
    >
      {/* Main Content Area */}
      {/* 
          Added pb-32 to accomodate the floating dock at the bottom.
          Removed pl-12 since navigation is now a dock.
      */}
      <main
        className={`
          transition-[padding] duration-300 ease-in-out
          ${activeCategory === "task" || activeCategory === "inbox" ? "pb-0" : "pb-32"}
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
        ) : activeCategory === "inbox" ? (
          <div className="h-screen w-full pt-4 pb-32 px-4 overflow-hidden">
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

