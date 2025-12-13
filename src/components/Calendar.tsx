import { useEffect, useRef, useState } from 'react';
/* This component will generate the dates for the current year and handle the visual toggle state locally (until we connect the backend later). */

import { useCalendar } from '../hooks/useCalendar';
import styles from './Calendar.module.css'; // Import as a module

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
        <div className={styles['calendar-wrapper']}>
            {/* Row Labels (Mon, Wed, Fri for minimal look) */}
            <div className={styles['day-labels']} style={{ marginTop: '24px' }}>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
            </div>

            <div className={styles['scroll-container']} ref={scrollRef}>
                <div className={styles['inner-content']}>
                    {/* Month Labels Header */}
                    <div className={styles['month-row']}>
                        {months.map((m, i) => (
                            <span
                                key={i}
                                style={{
                                    left: `${m.index * 18}px` // 14px width + 4px gap = 18px stride
                                }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    <div className={styles['calendar-grid']}>
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
                                ${styles['date-box']} 
                                ${isSelected ? styles['active'] : ''} 
                                ${isToday ? styles['today'] : ''}
                                ${isHoliday ? styles['holiday'] : ''}
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
                    className={styles['tooltip']}
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}