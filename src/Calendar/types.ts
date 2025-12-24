/**
 * Represents a month label on the X-axis.
 */
export interface MonthLabel {
  /** The text to display (e.g., "Jan"). */
  label: string;
  /** The column index where this label should appear. */
  index: number;
}

/**
 * Data required to render the floating tooltip.
 */
export interface TooltipData {
  /** The content text to display inside the tooltip. */
  text: string;
  /** The X coordinate relative to the viewport. */
  x: number;
  /** The Y coordinate relative to the viewport. */
  y: number;
}

/**
 * The state object returned by the `useCalendar` hook.
 */
export interface CalendarState {
  /** Array of Date objects covering the full range to be rendered. */
  dates: Date[];
  /** Set of date strings (YYYY-MM-DD) that are currently selected/active. */
  selectedDates: Set<string>;
  /** Today's date string in YYYY-MM-DD format. */
  todayStr: string;
  /** Function to toggle the selection state of a date. Persists to backend. */
  toggleDate: (dateStr: string) => Promise<void>;
  /** Array of month labels to position above the grid. */
  months: MonthLabel[];
  /** Map of date strings to holiday names (for Korea). */
  holidaysMap: Map<string, string>;
}
