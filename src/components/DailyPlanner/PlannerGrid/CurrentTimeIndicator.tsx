import React from "react";

interface CurrentTimeIndicatorProps {
  currentMinutes: number;
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentMinutes }) => {
  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(239,68,68,0.6)]"
      style={{ left: `${(currentMinutes / 1440) * 100}%` }}
    >
      <div className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
    </div>
  );
};
