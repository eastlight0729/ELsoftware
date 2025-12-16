import { useEffect, useRef, useState } from 'react';
/* This component will generate the dates for the current year and handle the visual toggle state locally (until we connect the backend later). */

import { useCalendar } from '../hooks/useCalendar';

export function Calendar() {
    // Facade Pattern: Retrieve logic and state from custom hook
    const { dates, selectedDates, todayStr, toggleDate, months, holidaysMap } = useCalendar();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Tooltip State
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Clear any existing timeout to avoid race conditions
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        // Set 100ms delay
        hoverTimeoutRef.current = setTimeout(() => {
            setTooltip({
                text,
                x: rect.left + rect.width / 2, // Center horizontally
                y: rect.top // Top of the element
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

    useEffect(() => {
        // Scroll to "today" column on mount/update
        if (scrollRef.current && dates.length > 0) {
            const todayIndex = dates.findIndex(d => d.toISOString().split('T')[0] === todayStr);
            if (todayIndex !== -1) {
                // Calculate column index
                // Grid fills columns (7 rows). 
                // We must account for the start day of the very first date in the list.
                const startDay = dates[0].getDay();
                const columnIndex = Math.floor((todayIndex + startDay) / 7);

                // Target: make this column the 5th visible column (index 4)
                // 1 column = 14px width + 4px gap = 18px
                const targetColumn = Math.max(0, columnIndex - 4);
                scrollRef.current.scrollLeft = targetColumn * 18;
            }
        }
    }, [dates, todayStr]);

    return (
        <div className="flex items-start gap-3 p-5 bg-white text-[#1f2328] font-sans w-full box-border overflow-hidden dark:bg-[#0d1117]">
            {/* Row Labels (Mon, Wed, Fri for minimal look) */}
            <div className="flex flex-col justify-between h-[100px] pt-[15px] text-xs text-[#656d76] shrink-0 dark:text-[#8b949e]" style={{ marginTop: '24px' }}>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
            </div>

            <div className="overflow-x-auto overflow-y-hidden grow pb-[5px] min-w-0" ref={scrollRef}>
                <div className="flex flex-col w-max">
                    {/* Month Labels Header */}
                    <div className="relative h-5 mb-1">
                        {months.map((m, i) => (
                            <span
                                key={i}
                                className="absolute top-0 text-xs text-[#656d76] whitespace-nowrap"
                                style={{
                                    left: `${m.index * 18}px` // 14px width + 4px gap = 18px stride
                                }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {dates.map((date, index) => {
                            // Format date as YYYY-MM-DD for ID
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = selectedDates.has(dateStr);

                            // 3. Check if this specific block is today
                            const isToday = dateStr === todayStr;

                            // 4. Check if holiday
                            const holidayName = holidaysMap.get(dateStr);
                            const isHoliday = !!holidayName;

                            // Construct dynamic class string carefully
                            const boxClass = `
                                w-[14px] h-[14px] bg-[#ebedf0] border border-[#1b1f23]/6 rounded-[3px] cursor-pointer transition-all duration-100 ease-in-out appearance-none p-0 hover:border-[#1b1f23]/30 hover:scale-110 dark:bg-[#161b22] dark:border-[#f0f6fc]/10
                                ${isSelected ? 'bg-[#40c463] border-[#3aa655] dark:bg-[#2ea043] dark:border-[#3fb950]' : ''} 
                                ${isToday ? 'border-2 border-[#0969da] dark:border-[#58a6ff]' : ''}
                                ${isHoliday ? 'border-2 border-[#ff4d4f] z-10 dark:border-[#ff7875]' : ''}
                            `;

                            // Tooltip Text
                            let tooltipText = dateStr;
                            if (isToday) tooltipText += ' (Today)';
                            if (isHoliday) tooltipText += ` - ${holidayName}`;

                            return (
                                <button
                                    key={dateStr}
                                    // Removed native title to use custom tooltip
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
            {tooltip && (
                <div
                    className="fixed bg-[#24292f] text-white px-2 py-1 rounded text-xs pointer-events-none z-[1000] whitespace-nowrap opacity-90 shadow-lg -translate-x-1/2 -translate-y-full mt-[-8px]"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}