/* This component will generate the dates for the current year and handle the visual toggle state locally (until we connect the backend later). */

import { useCalendar } from '../hooks/useCalendar';
import styles from './Calendar.module.css'; // Import as a module

export function Calendar() {
    // Facade Pattern: Retrieve logic and state from custom hook
    const { dates, selectedDates, todayStr, toggleDate, months } = useCalendar();

    return (
        <div className={styles['calendar-wrapper']}>
            {/* Row Labels (Mon, Wed, Fri for minimal look) */}
            <div className={styles['day-labels']} style={{ marginTop: '24px' }}>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
            </div>

            <div className={styles['scroll-container']}>
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

                            // Construct dynamic class string carefully
                            const boxClass = `
                                ${styles['date-box']} 
                                ${isSelected ? styles['active'] : ''} 
                                ${isToday ? styles['today'] : ''}
                            `;

                            return (
                                <button
                                    key={dateStr}
                                    title={isToday ? `${dateStr} (Today)` : dateStr}
                                    className={boxClass}
                                    onClick={() => toggleDate(dateStr)}
                                    style={index === 0 ? { gridRowStart: date.getDay() + 1 } : undefined}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}