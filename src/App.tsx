import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useAuth, Login } from "./features/auth";
import { useBackground } from "./features/settings";
import { AppContent } from "./AppContent";
import { Navigation } from "./components/navigation/Navigation";
import { navigationConfig } from "./components/navigation/config";
import { AppCategory } from "./components/navigation/types";
import { useKeyboardNavigation } from "./components/navigation/useKeyboardNavigation";

/**
 * Root Application Component.
 *
 * Serving as the main layout container, it orchestrates:
 * - The navigation logic via `activeCategory`.
 * - The main content rendering via `AppContent`.
 * - Global background management.
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<AppCategory>("inbox");
  const [direction, setDirection] = useState<number>(0);
  const { session, loading, signOut } = useAuth();
  const { backgroundPath } = useBackground();

  /**
   * Calculate the navigation direction and update the active category.
   */
  const handleCategoryChange = (newCategory: AppCategory, manualDirection?: number) => {
    // Helper to get index including settings
    const getCategoryIndex = (category: AppCategory) => {
      // Treat "setting" as if it's at the end of the list
      if (category === "setting") return navigationConfig.length;
      return navigationConfig.findIndex((item) => item.id === category);
    };

    if (manualDirection !== undefined) {
      setDirection(manualDirection);
    } else {
      const currentIndex = getCategoryIndex(activeCategory);
      const newIndex = getCategoryIndex(newCategory);

      if (newIndex > currentIndex) {
        setDirection(1);
      } else if (newIndex < currentIndex) {
        setDirection(-1);
      } else {
        setDirection(0);
      }
    }

    setActiveCategory(newCategory);
  };

  // Enable keyboard navigation
  useKeyboardNavigation({
    activeCategory,
    onNavigate: (cat, dir) => handleCategoryChange(cat, dir),
  });

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

  // Animation variants
  const variants: Variants = {
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
      {/* Background Layer */}
      <div
        className={`fixed inset-0 min-h-screen w-full -z-10 transition-colors duration-500 ${
          backgroundPath
            ? "bg-cover bg-fixed bg-center bg-no-repeat"
            : activeCategory === "inbox" || activeCategory === "lists" || activeCategory === "setting"
            ? "bg-linear-to-br from-sky-500 to-red-400"
            : "bg-neutral-100 dark:bg-neutral-800"
        }`}
        style={backgroundPath ? { backgroundImage: `url("${backgroundPath}")` } : undefined}
      />

      <div className="min-h-screen w-full text-neutral-800 dark:text-neutral-100 relative overflow-x-hidden">
        {/* Main Content Area */}
        {/* 
            Added pb-32 to accomodate the floating dock at the bottom.
            Removed pl-12 since navigation is now a dock.
        */}
        <main
          className={`
            transition-[padding] duration-300 ease-in-out
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
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
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
                <div className="h-screen w-full pt-4 px-4 pb-32 overflow-hidden">
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


        <Navigation activeCategory={activeCategory} onSelectCategory={(cat) => handleCategoryChange(cat)} />
      </div>
    </>
  );
}
