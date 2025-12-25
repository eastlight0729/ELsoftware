import React from "react";

/**
 * Props for the CurrentTimeIndicator component.
 */
interface CurrentTimeIndicatorProps {
  /** The current time expressed in minutes from the start of the day (0-1439). */
  currentMinutes: number;
}

/**
 * CurrentTimeIndicator Component
 * Renders a vertical red line that moves horizontally across the grid to indicate the current time.
 */
export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentMinutes }) => {
  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(239,68,68,0.6)]"
      /**
       * Calculate horizontal position as a percentage of the total day (1440 minutes).
       */
      style={{ left: `${(currentMinutes / 1440) * 100}%` }}
    ></div>
  );
};
