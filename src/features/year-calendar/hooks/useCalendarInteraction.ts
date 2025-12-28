import { useState, useMemo, useCallback, useEffect } from "react";
import { getDatesInRange } from "../utils";
import { CalendarRange, CalendarMark } from "../api/useYearCalendar";

export function useCalendarInteraction(
  ranges: CalendarRange[],
  upsertRange: (vars: { id?: string; startDate: string; endDate: string; task?: string; size?: string }) => void,
  deleteRange: (id: string) => void,
  marks: CalendarMark[],
  upsertMark: (vars: { id?: string; date: string; task: string }) => void,
  deleteMark: (id: string) => void
) {
  // Selection / Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);

  // States for different modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isCautionModalOpen, setIsCautionModalOpen] = useState(false);

  // Selection Data
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    start: string;
    end: string;
    id?: string;
    task?: string;
    size?: string;
  } | null>(null);

  // Drag Handlers
  const handleMouseDown = useCallback((dateStr: string) => {
    setIsDragging(true);
    setDragStart(dateStr);
    setDragCurrent(dateStr);
  }, []);

  const handleMouseEnter = useCallback(
    (dateStr: string) => {
      if (isDragging) {
        setDragCurrent(dateStr);
      }
    },
    [isDragging]
  );

  const checkOverlap = useCallback(
    (start: string, end: string, excludeId?: string) => {
      return ranges.some((r) => {
        if (excludeId && r.id === excludeId) return false;
        // Overlap: A.start <= B.end && A.end >= B.start
        return start <= r.end_date && end >= r.start_date;
      });
    },
    [ranges]
  );

  const finishDrag = useCallback(() => {
    if (dragStart && dragCurrent) {
      const start = dragStart < dragCurrent ? dragStart : dragCurrent;
      const end = dragStart < dragCurrent ? dragCurrent : dragStart;

      if (checkOverlap(start, end)) {
        setIsCautionModalOpen(true);
      } else {
        setSelectedRange({ start, end });
        setIsScheduleModalOpen(true);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  }, [dragStart, dragCurrent, checkOverlap]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        finishDrag();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, finishDrag]);

  // Determine current effective drag selection for highlighting temporary overlay
  const dragSelection = useMemo(() => {
    if (isDragging && dragStart && dragCurrent) {
      const start = dragStart < dragCurrent ? dragStart : dragCurrent;
      const end = dragStart < dragCurrent ? dragCurrent : dragStart;
      return { start, end };
    }
    return null;
  }, [isDragging, dragStart, dragCurrent]);

  const handleRangeClick = useCallback((range: CalendarRange, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRange({
      start: range.start_date,
      end: range.end_date,
      id: range.id,
      task: range.task || "",
      size: range.size || "everyday",
    });
    setIsScheduleModalOpen(true);
  }, []);

  // --- Schedule/Task Handlers ---
  const handleSaveTask = (task: string, size: string) => {
    if (selectedRange) {
      // Double check overlap if it's a new range or bounds changed (though UI blocks interaction)
      const isNew = !selectedRange.id;
      if (isNew && checkOverlap(selectedRange.start, selectedRange.end)) {
        setIsCautionModalOpen(true);
        return;
      }
      // If editing, check overlap excluding self
      if (!isNew && checkOverlap(selectedRange.start, selectedRange.end, selectedRange.id)) {
        setIsCautionModalOpen(true);
        return;
      }

      upsertRange({
        id: selectedRange.id,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
        task,
        size,
      });
      setIsScheduleModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleRemoveTask = () => {
    if (selectedRange?.id) {
      deleteRange(selectedRange.id);
      setIsScheduleModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedRange(null);
  };

  // --- Action Handlers ---
  const currentActionTask = useMemo(() => {
    if (!selectedDate) return null;
    const mark = marks.find((m) => m.date === selectedDate);
    return mark ? mark.task : null;
  }, [selectedDate, marks]);

  const currentMarkId = useMemo(() => {
    if (!selectedDate) return undefined;
    const mark = marks.find((m) => m.date === selectedDate);
    return mark ? mark.id : undefined;
  }, [selectedDate, marks]);

  const handleSaveAction = (task: string) => {
    if (selectedDate) {
      upsertMark({
        id: currentMarkId,
        date: selectedDate,
        task,
      });
      setIsActionModalOpen(false);
      setSelectedDate(null);
    }
  };

  const handleRemoveAction = () => {
    if (currentMarkId) {
      deleteMark(currentMarkId);
    }
    setIsActionModalOpen(false);
    setSelectedDate(null);
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedDate(null);
  };

  // --- Switch Handlers ---
  const handleSwitchToAction = (date: string) => {
    setIsScheduleModalOpen(false);
    // Don't clear selectedRange immediately if we want to preserve state?
    // Actually, usually we clean up. But here maybe we just swap.
    // If we swap, we set the new state.

    // We need to set selectedDate for ActionModal
    setSelectedDate(date);
    setIsActionModalOpen(true);
    // We can keep selectedRange as null or keep it?
    // If we keep it, it might interfere if logic relies on "if selectedRange...".
    // But selectedRange is mostly for TaskModal.
    setSelectedRange(null);
  };

  const handleSwitchToTask = () => {
    if (!selectedDate) return;

    // Find overlapping range
    const overlapping = ranges.find((r) => r.start_date <= selectedDate && r.end_date >= selectedDate);

    setIsActionModalOpen(false);

    if (overlapping) {
      setSelectedRange({
        start: overlapping.start_date,
        end: overlapping.end_date,
        id: overlapping.id,
        task: overlapping.task || undefined,
        size: overlapping.size,
      });
    } else {
      // Fallback: Create new schedule for this day
      setSelectedRange({
        start: selectedDate,
        end: selectedDate,
      });
    }

    setIsScheduleModalOpen(true);
    setSelectedDate(null);
  };

  return {
    isDragging,
    dragSelection,
    selectedRange,
    selectedDate,

    // Modals Open State
    // Modals Open State
    isScheduleModalOpen,
    isActionModalOpen,
    isCautionModalOpen,

    // Modal Data
    modalDates: selectedRange ? getDatesInRange(selectedRange.start, selectedRange.end) : [],
    actionInitialTask: currentActionTask,

    handlers: {
      handleMouseDown,
      handleMouseEnter,
      handleRangeClick,

      // Schedule
      handleSaveTask,
      handleRemoveTask,
      handleCloseScheduleModal,
      handleCloseCautionModal: () => setIsCautionModalOpen(false),

      // Action
      handleSaveAction,
      handleRemoveAction,
      handleCloseActionModal,

      // Switching
      handleSwitchToAction,
      handleSwitchToTask,
    },
  };
}
