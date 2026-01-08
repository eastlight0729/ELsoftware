import { useEffect } from "react";
import { AppCategory } from "./types";
import { navigationConfig } from "./config";

interface UseKeyboardNavigationProps {
  activeCategory: AppCategory;
  onNavigate: (category: AppCategory, direction: number) => void;
}

/**
 * Hook to handle global keyboard navigation (Cmd/Ctrl + Arrow Keys).
 * Calculates the next category and direction based on the current active category.
 */
export function useKeyboardNavigation({
  activeCategory,
  onNavigate,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Menu Navigation: Cmd + Left/Right
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();

          const currentIndex = navigationConfig.findIndex(
            (item) => item.id === activeCategory
          );

          // If currently in Settings or unknown, allow navigating back to main list
          if (currentIndex === -1) {
            const nextIndex =
              e.key === "ArrowLeft" ? navigationConfig.length - 1 : 0;
            const nextCategory = navigationConfig[nextIndex].id;
            // Direction purely conceptual here, generally entering from outside
            onNavigate(nextCategory, 0); 
            return;
          }

          let nextIndex: number;
          let direction: number;

          if (e.key === "ArrowLeft") {
            // Wrap around to the last item if at the beginning
            nextIndex =
              (currentIndex - 1 + navigationConfig.length) %
              navigationConfig.length;
            direction = -1;
          } else {
            // Wrap around to the first item if at the end
            nextIndex = (currentIndex + 1) % navigationConfig.length;
            direction = 1;
          }

          onNavigate(navigationConfig[nextIndex].id, direction);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCategory, onNavigate]);
}
