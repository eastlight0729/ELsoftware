import React from "react";

/**
 * TimeLabels Component
 * Renders the horizontal time markers (0-23 hours) above the planner grid.
 * Helps users identify the time slots corresponding to grid columns.
 */
export const TimeLabels: React.FC = () => {
  /** Create an array of 24 markers representing each hour of the day. */
  const markers = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="grid grid-cols-24 w-[960px] mb-2 text-xs font-medium text-slate-400 select-none">
      {markers.map((hour) => (
        <div key={hour} className="text-left border-l border-slate-200 pl-1">
          {hour}
        </div>
      ))}
    </div>
  );
};
