import { useEffect, useRef, useState } from 'react';
/* Calendar Component
  
  Goal: Renders a "GitHub-style" contribution graph.
  - X-axis: Weeks
  - Y-axis: Days of the week (7 rows)
  - Color: Indicates activity or selection.
*/

import { useCalendar } from '../hooks/useCalendar';

export function Calendar() {
    // Facade Pattern: We do not write complex logic (like date calculation) here.
    // Instead, we call a custom hook to get the data and functions we need.
    // This satisfies the frontend development requirement.
    const { dates, selectedDates, todayStr, toggleDate, months, holidaysMap } = useCalendar();

    // useRef allows us to access a DOM element directly. 
    // We need this to auto-scroll the calendar to the current date.
    const scrollRef = useRef<HTMLDivElement>(null);

    // Tooltip State
    // We store the tooltip text and X/Y coordinates to position the floating box.
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

    // We use a "ref" for the timeout ID so we can clear it across renders without triggering a re-render itself.
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handler: When mouse enters a date box
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        // Get the position (x, y, width, height) of the hovered button relative to the viewport
        const rect = e.currentTarget.getBoundingClientRect();

        // Clear any existing timer. This prevents "flickering" if the user moves the mouse quickly between boxes.
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        // Set a small delay (100ms). The tooltip only appears if the user hovers for a moment.
        // This improves UX by not showing tooltips during accidental swipes.
        hoverTimeoutRef.current = setTimeout(() => {
            setTooltip({
                text,
                x: rect.left + rect.width / 2, // Calculate center X
                y: rect.top // Position at the top edge of the button
            });
        }, 100);
    };

    // Handler: When mouse leaves a date box
    const handleMouseLeave = () => {
        // Cancel the timer so the tooltip doesn't appear after the mouse has already left
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        // Hide the tooltip immediately
        setTooltip(null);
    };

    // Effect: Auto-scroll to "Today" when the component loads
    useEffect(() => {
        // Only run if the ref is attached to the div and we have dates to render
        if (scrollRef.current && dates.length > 0) {
            // 1. Find the index of today's date in our array
            const todayIndex = dates.findIndex(d => d.toISOString().split('T')[0] === todayStr);

            if (todayIndex !== -1) {
                // 2. Calculate which vertical column "Today" is in.
                // Since the grid fills top-to-bottom (7 days), we divide the index by 7.
                // We add 'startDay' to account for empty spaces at the very beginning of the year.
                const startDay = dates[0].getDay();
                const columnIndex = Math.floor((todayIndex + startDay) / 7);

                // 3. Determine scroll position.
                // We want to show a few columns *before* today for context (columnIndex - 4).
                // 18 represents the pixel width of one column (14px box + 4px gap).
                const targetColumn = Math.max(0, columnIndex - 4);

                // 4. Apply the scroll
                scrollRef.current.scrollLeft = targetColumn * 18;
            }
        }
    }, [dates, todayStr]); // Re-run if dates or today changes

    return (
        <div className="flex items-start gap-3 p-5 bg-white text-[#1f2328] font-sans w-full box-border overflow-hidden dark:bg-[#0d1117]">
            {/* Left Column: Row Labels (Mon, Wed, Fri) */}
            {/* These are purely visual labels to help users identify weekdays. */}
            <div className="flex flex-col justify-between h-[100px] pt-[15px] text-xs text-[#656d76] shrink-0 dark:text-[#8b949e]" style={{ marginTop: '24px' }}>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
            </div>

            {/* Main Calendar Scrollable Area */}
            <div className="overflow-x-auto overflow-y-hidden grow pb-[5px] min-w-0" ref={scrollRef}>
                <div className="flex flex-col w-max">
                    {/* Month Labels (Jan, Feb, etc.) */}
                    <div className="relative h-5 mb-1">
                        {months.map((m, i) => (
                            <span
                                key={i}
                                className="absolute top-0 text-xs text-[#656d76] whitespace-nowrap"
                                style={{
                                    // Position the label horizontally based on the week index.
                                    // 18px = width of one week column.
                                    left: `${m.index * 18}px`
                                }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    {/* The Grid: 
                        grid-rows-7: Forces 7 rows (one for each day of the week).
                        grid-flow-col: Fills the grid vertically first (Mon->Sun), then moves to the next column.
                    */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {dates.map((date, index) => {
                            // Convert date object to "YYYY-MM-DD" string for easy comparison
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = selectedDates.has(dateStr);
                            const isToday = dateStr === todayStr;

                            // Check our Map to see if this date is a holiday
                            const holidayName = holidaysMap.get(dateStr);
                            const isHoliday = !!holidayName; // Convert string to boolean (true if exists)

                            // Dynamic Styling Logic:
                            // We use a template string to combine static classes with conditional classes.
                            // Base styles: size (14px), background colors, borders, hover effects.
                            const boxClass = `
                                w-[14px] h-[14px] bg-[#ebedf0] border border-[#1b1f23]/6 rounded-[3px] cursor-pointer transition-all duration-100 ease-in-out appearance-none p-0 hover:border-[#1b1f23]/30 hover:scale-110 dark:bg-[#161b22] dark:border-[#f0f6fc]/10
                                ${isSelected ? 'bg-[#40c463] border-[#3aa655] dark:bg-[#2ea043] dark:border-[#3fb950]' : ''} 
                                ${isToday ? 'border-2 border-[#0969da] dark:border-[#58a6ff]' : ''}
                                ${isHoliday ? 'border-2 border-[#ff4d4f] z-10 dark:border-[#ff7875]' : ''}
                            `;

                            // Construct Tooltip Text
                            let tooltipText = dateStr;
                            if (isToday) tooltipText += ' (Today)';
                            if (isHoliday) tooltipText += ` - ${holidayName}`;

                            return (
                                <button
                                    key={dateStr}
                                    className={boxClass}
                                    onClick={() => toggleDate(dateStr)}
                                    // Pass the calculated text to our handler
                                    onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
                                    onMouseLeave={handleMouseLeave}
                                    // If this is the very first date (index 0), we must tell CSS which row to start on.
                                    // Example: If Jan 1st is Wednesday (getDay() returns 3), gridRowStart = 3 + 1.
                                    style={index === 0 ? { gridRowStart: date.getDay() + 1 } : undefined}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tooltip Portal */}
            {/* Renders conditionally only when 'tooltip' state is not null */}
            {tooltip && (
                <div
                    className="fixed bg-[#24292f] text-white px-2 py-1 rounded text-xs pointer-events-none z-1000 whitespace-nowrap opacity-90 shadow-lg -translate-x-1/2 -translate-y-full mt-[-8px]"
                    // Apply the coordinates calculated in handleMouseEnter
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}