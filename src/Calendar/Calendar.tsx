import { useEffect, useRef, useState } from "react";
import { useCalendar } from "./useCalendar";
import { TooltipData } from "./types";
import { CalendarTooltip } from "./CalendarTooltip";
import { CalendarDayLabels } from "./CalendarDayLabels";
import { CalendarMonthLabels } from "./CalendarMonthLabels";

/**
 * The main Calendar component.
 * Renders a GitHub-style contribution graph with interactive dates, holidays, and tooltips.
 *
 * Features:
 * - Visualizes activity over a multi-year range.
 * - Supports keyboard and mouse interaction.
 * - Displays tooltips with date and holiday information.
 * - Auto-scrolls to the current date on mount.
 */
export function Calendar() {
  const { dates, selectedDates, todayStr, toggleDate, months, holidaysMap } = useCalendar();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setTooltip({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setTooltip(null);
  };

  // Auto-scroll to "Today"
  useEffect(() => {
    if (scrollRef.current && dates.length > 0) {
      const todayIndex = dates.findIndex((d) => d.toISOString().split("T")[0] === todayStr);

      if (todayIndex !== -1) {
        const startDay = dates[0].getDay();
        const columnIndex = Math.floor((todayIndex + startDay) / 7);
        const targetColumn = Math.max(0, columnIndex - 4);
        scrollRef.current.scrollLeft = targetColumn * 18;
      }
    }
  }, [dates, todayStr]);

  return (
    <div className="flex items-start gap-3 p-5 bg-white text-[#1f2328] font-sans w-full box-border overflow-hidden dark:bg-[#0d1117]">
      <CalendarDayLabels />

      <div className="overflow-x-auto overflow-y-hidden grow pb-[5px] min-w-0" ref={scrollRef}>
        <div className="flex flex-col w-max">
          <CalendarMonthLabels months={months} />

          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {dates.map((date, index) => {
              const dateStr = date.toISOString().split("T")[0];
              const isSelected = selectedDates.has(dateStr);
              const isToday = dateStr === todayStr;
              const holidayName = holidaysMap.get(dateStr);
              const isHoliday = !!holidayName;

              let bgColor = "bg-[#ebedf0] dark:bg-[#161b22]";
              let borderColor = "border-[#1b1f23]/6 dark:border-[#f0f6fc]/10";
              let borderWidth = "border";

              if (isSelected) {
                bgColor = "bg-[#40c463] dark:bg-[#2ea043]";
                borderColor = "border-[#3aa655] dark:border-[#3fb950]";
              }

              if (isToday) {
                borderWidth = "border-2";
                borderColor = "border-[#0969da] dark:border-[#58a6ff]";
              }

              if (isHoliday) {
                borderWidth = "border-2";
                borderColor = "border-[#ff4d4f] dark:border-[#ff7875]";
              }

              const boxClass = `
                                w-[14px] h-[14px] rounded-[3px] cursor-pointer transition-all duration-100 ease-in-out appearance-none p-0 
                                hover:border-[#1b1f23]/30 hover:scale-110
                                ${bgColor} ${borderWidth} ${borderColor} ${isHoliday ? "z-10" : ""}
                            `.trim();

              let tooltipText = dateStr;
              if (isToday) tooltipText += " (Today)";
              if (isHoliday) tooltipText += ` - ${holidayName}`;

              return (
                <button
                  key={dateStr}
                  className={boxClass}
                  onClick={() => toggleDate(dateStr)}
                  onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
                  onMouseLeave={handleMouseLeave}
                  style={index === 0 ? { gridRowStart: date.getDay() + 1 } : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>

      {tooltip && <CalendarTooltip data={tooltip} />}
    </div>
  );
}
