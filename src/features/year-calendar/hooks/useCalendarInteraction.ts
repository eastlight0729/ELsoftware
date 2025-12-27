import { useState, useMemo, useCallback, useEffect } from "react";
import { getDatesInRange } from "../utils";
import { CalendarRange, CalendarMark } from "../api/useYearCalendar";

export function useCalendarInteraction(
  upsertRange: (vars: { id?: string; startDate: string; endDate: string; task?: string }) => void,
  deleteRange: (id: string) => void,
  marks: CalendarMark[],
  upsertMark: (vars: { id?: number; date: string; task: string }) => void,
  deleteMark: (id: number) => void
) {
  // Selection / Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);

  // States for different modals
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Selection Data
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string; id?: string; task?: string } | null>(
    null
  );

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

  const finishDrag = useCallback(() => {
    if (dragStart && dragCurrent) {
      // Check if it's a click (single day selection) or a drag (multi day)
      // If single day, open choice modal. If multi-day, go straight to schedule modal.
      if (dragStart === dragCurrent) {
        // It's a click
        setSelectedDate(dragStart);
        setIsChoiceModalOpen(true);
      } else {
        // It's a drag range
        const start = new Date(dragStart);
        const end = new Date(dragCurrent);
        const s = start < end ? dragStart : dragCurrent;
        const e = start < end ? dragCurrent : dragStart;

        setSelectedRange({ start: s, end: e });
        setIsScheduleModalOpen(true);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  }, [dragStart, dragCurrent]);

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
      const start = new Date(dragStart);
      const end = new Date(dragCurrent);
      return start < end ? { start: dragStart, end: dragCurrent } : { start: dragCurrent, end: dragStart };
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
    });
    setIsScheduleModalOpen(true);
  }, []);

  // --- Choice Handlers ---
  const handleSelectSchedule = () => {
    setIsChoiceModalOpen(false);
    if (selectedDate) {
      // Open Schedule modal for this single date
      setSelectedRange({ start: selectedDate, end: selectedDate });
      setIsScheduleModalOpen(true);
    }
  };

  const handleSelectAction = () => {
    setIsChoiceModalOpen(false);
    if (selectedDate) {
      setIsActionModalOpen(true);
    }
  };

  const handleCloseChoice = () => {
    setIsChoiceModalOpen(false);
    setSelectedDate(null);
  };

  // --- Schedule/Task Handlers ---
  const handleSaveTask = (task: string) => {
    if (selectedRange) {
      upsertRange({
        id: selectedRange.id,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
        task,
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

  return {
    isDragging,
    dragSelection,
    selectedRange,
    selectedDate,

    // Modals Open State
    isChoiceModalOpen,
    isScheduleModalOpen,
    isActionModalOpen,

    // Modal Data
    modalDates: selectedRange ? getDatesInRange(selectedRange.start, selectedRange.end) : [],
    actionInitialTask: currentActionTask,

    handlers: {
      handleMouseDown,
      handleMouseEnter,
      handleRangeClick,

      // Choice
      handleSelectSchedule,
      handleSelectAction,
      handleCloseChoice,

      // Schedule
      handleSaveTask,
      handleRemoveTask,
      handleCloseScheduleModal,

      // Action
      handleSaveAction,
      handleRemoveAction,
      handleCloseActionModal,
    },
  };
}
