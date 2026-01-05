import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  const [direction, setDirection] = useState(0);

  const handleCategoryChange = (newCategory: AppCategory) => {
    // Helper to get index including settings
    const getCategoryIndex = (category: AppCategory) => {
      if (category === "setting") return navigationConfig.length;
      return navigationConfig.findIndex((item) => item.id === category);
    };

    const currentIndex = getCategoryIndex(activeCategory);
    const newIndex = getCategoryIndex(newCategory);
    
    if (newIndex > currentIndex) {
      setDirection(1);
    } else if (newIndex < currentIndex) {
      setDirection(-1);
    } else {
        setDirection(0);
    }
    
    setActiveCategory(newCategory);
  };

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
              setDirection(-1);
            } else {
              // Wrap around to the first item if at the end
              nextIndex = (currentIndex + 1) % navigationConfig.length;
              setDirection(1);
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <>
      <div 
        className={`fixed inset-0 min-h-screen w-full -z-10 transition-colors duration-500 ${
          backgroundPath 
            ? "bg-cover bg-fixed bg-center bg-no-repeat"
            : activeCategory === "inbox" || activeCategory === "lists"
              ? "bg-linear-to-br from-sky-500 to-red-400"
              : "bg-neutral-100 dark:bg-neutral-800"
        }`}
        style={backgroundPath ? backgroundStyle : {}}
      />
      
      <div className="min-h-screen w-full text-neutral-800 dark:text-neutral-100 relative overflow-x-hidden">
        {/* Main Content Area */}
        {/* 
            Added pb-32 to accomodate the floating dock at the bottom.
            Removed pl-12 since navigation is now a dock.
        */}
        <main
          className={`
            transition-[padding] duration-300 ease-in-out}
            min-h-screen
          `}
        >
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={activeCategory}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full h-full"
            >
              {activeCategory === "lists" ? (
                <div className="h-screen w-full pt-4 px-4 pb-[100px] overflow-hidden">
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
              ) : activeCategory === "calendar" ? (
                <div className="h-screen w-full pt-4 px-4 pb-20 overflow-hidden">
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
            </motion.div>
          </AnimatePresence>
        </main>

        <Navigation
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>
    </>
  );
}
