import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props for the PlannerHeader component.
 */
interface PlannerHeaderProps {
  /** The currently selected date to display. */
  currentDate: Date;
  /** Callback triggered when the 'Previous' button is clicked. */
  onPrev: () => void;
  /** Callback triggered when the 'Next' button is clicked. */
  onNext: () => void;
  /** Callback triggered when the date label is clicked to return to current date. */
  onToday: () => void;
}

/**
 * PlannerHeader Component
 * Displays the current date and provide navigation controls to change the date.
 */
export const PlannerHeader: React.FC<PlannerHeaderProps> = ({ currentDate, onPrev, onNext, onToday }) => {
  /**
   * Formats the date into a human-readable string.
   * Special labels like 'Today', 'Yesterday', and 'Tomorrow' are used when applicable.
   *
   * @param date The date to format.
   * @returns A string representation of the date.
   */
  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex justify-between items-center mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200/600">
      <h2 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Daily Planner
      </h2>
      <div className="flex gap-3 items-center">
        {/* Previous Day Button */}
        <button
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
          onClick={onPrev}
          title="Previous Day"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Date Display / Go to Today Trigger */}
        <span
          className="font-semibold min-w-[140px] text-center cursor-pointer select-none text-slate-700 hover:text-blue-600 transition-colors"
          onClick={onToday}
          title="Go to Today"
        >
          {formatDate(currentDate)}
        </span>

        {/* Next Day Button */}
        <button
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
          onClick={onNext}
          title="Next Day"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
