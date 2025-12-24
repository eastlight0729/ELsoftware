import { TooltipData } from "./types";

interface CalendarTooltipProps {
  data: TooltipData;
}

/**
 * Renders a floating tooltip displaying date information.
 * The tooltip is positioned relative to the viewport using fixed positioning.
 *
 * @param {CalendarTooltipProps} props
 * @param {TooltipData} props.data - Object containing tooltip text and screen coordinates (x, y).
 * @returns {JSX.Element} The rendered tooltip portal.
 */
export function CalendarTooltip({ data }: CalendarTooltipProps) {
  return (
    <div
      className="fixed bg-[#24292f] text-white px-2 py-1 rounded text-xs pointer-events-none z-1000 whitespace-nowrap opacity-90 shadow-lg -translate-x-1/2 -translate-y-full mt-[-8px]"
      style={{ left: data.x, top: data.y }}
    >
      {data.text}
    </div>
  );
}
