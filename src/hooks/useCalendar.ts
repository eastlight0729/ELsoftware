import { useState, useEffect } from 'react';

export function useCalendar() {
    // Helper: Get local date string 'YYYY-MM-DD'
    // (Fixes the issue where toISOString() uses UTC and might show yesterday)
    const toLocalISOString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    };

    // 1. Generate dates for a range of years
    const getDatesRange = (startYear: number, endYear: number) => {
        const dates = [];
        const date = new Date(startYear, 0, 1); // Jan 1st of start year

        // Loop until we reach Jan 1st of the year AFTER endYear
        while (date.getFullYear() <= endYear) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    // 2. Local state to simulate On/Off logic for UI testing
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    // 1. Get Today's string to compare
    const todayStr = toLocalISOString(new Date());

    // Compute dates once: Current Year to Current Year + 4 (5 years total)
    const currentYear = new Date().getFullYear();
    const dates = getDatesRange(currentYear, currentYear + 4);

    // 3. Calculate Month Positions
    // We need to know which column index each month starts at.
    // The grid fills columns. Column Index = Math.floor((Index + StartOffset) / 7)
    const months: { label: string; index: number }[] = [];
    let lastMonth = -1;

    if (dates.length > 0) {
        const startDay = dates[0].getDay(); // 0=Sun, ... 6=Sat

        dates.forEach((date, i) => {
            const currentMonth = date.getMonth();
            if (currentMonth !== lastMonth) {
                lastMonth = currentMonth;

                // Calculate Column Index
                const colIndex = Math.floor((i + startDay) / 7);

                // Label (e.g., "Jan")
                const label = date.toLocaleString('default', { month: 'short' });

                // Only add if not duplicate (start of year logic handles it naturally)
                months.push({ label, index: colIndex });
            }
        });
    }

    // --- EFFECT: Load Data on Startup ---
    useEffect(() => {
        async function fetchData() {
            // Call the backend to get real data from file
            if (window.api) {
                const savedDates = await window.api.getSchedule();
                setSelectedDates(new Set(savedDates));
            }
        }
        fetchData();
    }, []);

    // --- HANDLER: Toggle Data via Backend ---
    const toggleDate = async (dateStr: string) => {
        // 1. Send command to backend
        // The backend saves to file and returns the updated list
        if (window.api) {
            const updatedList = await window.api.toggleDate(dateStr);
            // 2. Update UI with the confirmed data from backend
            setSelectedDates(new Set(updatedList));
        }
    };

    return {
        dates,
        selectedDates,
        todayStr,
        toggleDate,
        months
    };
}