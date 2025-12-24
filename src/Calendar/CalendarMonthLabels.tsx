import { MonthLabel } from "./types";

interface CalendarMonthLabelsProps {
  months: MonthLabel[];
}

/**
 * Component to render the X-axis month labels (Jan, Feb, etc.).
 * Labels are positioned absolutely based on the week index to align with the grid columns.
 *
 * @param {CalendarMonthLabelsProps} props
 * @param {MonthLabel[]} props.months - Array of month data containing label text and week index.
 * @returns {JSX.Element} The rendered month labels row.
 */
export function CalendarMonthLabels({ months }: CalendarMonthLabelsProps) {
  return (
    <div className="relative h-5 mb-1">
      {months.map((m, i) => (
        <span
          key={i}
          className="absolute top-0 text-xs text-[#656d76] whitespace-nowrap"
          style={{
            // 18px = width of one week column (14px box + 4px gap)
            left: `${m.index * 18}px`,
          }}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}
