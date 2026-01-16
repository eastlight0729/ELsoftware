import { isSameMonth, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { GlassPanel, GlassPanelContent, GlassPanelHeader } from "@/components/ui/GlassPanel";

import { WEEKDAYS } from "../constants";
import { MonthCardProps } from "../types";

export function MonthCard({ date, name, days, onDateClick }: MonthCardProps) {
  return (
    <GlassPanel>
      <GlassPanelHeader className="justify-center py-2 min-h-[40px]">
        <span className="text-sm font-bold tracking-wide text-white/80">{name}</span>
      </GlassPanelHeader>

      <GlassPanelContent>
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
          {WEEKDAYS.map((day, i) => (
            <div key={`${name}-d-${i}`} className="text-[10px] font-medium uppercase text-white/40">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, date);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={`${name}-day-${i}`}
                onClick={() => isCurrentMonth && onDateClick?.(day)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-sm text-[10px] sm:text-xs transition-colors",
                  !isCurrentMonth && "opacity-0 cursor-default",
                  isCurrentMonth && "text-white/70 cursor-pointer hover:bg-white/10",
                  isCurrentMonth && isWeekend && "text-red-400/80",
                  isToday(day) && "bg-sky-500 font-bold text-white shadow-sm rounded-md hover:bg-sky-600"
                )}
              >
                {isCurrentMonth ? day.getDate() : ""}
              </div>
            );
          })}
        </div>
      </GlassPanelContent>
    </GlassPanel>
  );
}
