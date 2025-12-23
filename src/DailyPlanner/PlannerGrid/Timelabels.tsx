import React from "react";

export const TimeLabels: React.FC = () => {
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
