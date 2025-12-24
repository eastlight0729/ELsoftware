/**
 * Component to render the Y-axis day labels (Mon, Wed, Fri) for the contribution graph.
 * These labels help users visually orient the days of the week.
 *
 * @returns {JSX.Element} The rendered labels column.
 */
export function CalendarDayLabels() {
  return (
    <div
      className="flex flex-col justify-between h-[100px] pt-[15px] text-xs text-[#656d76] shrink-0 dark:text-[#8b949e]"
      style={{ marginTop: "24px" }}
    >
      <span>Mon</span>
      <span>Wed</span>
      <span>Fri</span>
    </div>
  );
}
