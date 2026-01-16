import { Variants } from "framer-motion";

export const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
export const SWIPE_THRESHOLD = 50;
export const VELOCITY_THRESHOLD = 200;
export const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

export const CALENDAR_VARIANTS: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
};
