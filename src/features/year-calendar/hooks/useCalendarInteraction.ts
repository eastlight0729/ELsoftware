import { useState, useMemo, useCallback, useEffect } from "react";
import { getDatesInRange } from "../utils";
import { CalendarRange } from "../api/useYearCalendar";

export function useCalendarInteraction(
  upsertRange: (vars: { id?: string; startDate: string; endDate: string; task?: string }) => void,
  deleteRange: (id: string) => void
) {
  // Selection / Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);

  // Selected Range for Modal
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string; id?: string; task?: string } | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Prepare to open modal provided valid range
      const start = new Date(dragStart);
      const end = new Date(dragCurrent);
      const s = start < end ? dragStart : dragCurrent;
      const e = start < end ? dragCurrent : dragStart;

      setSelectedRange({ start: s, end: e });
      setIsModalOpen(true);
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
    setIsModalOpen(true);
  }, []);

  const handleSaveTask = (task: string) => {
    if (selectedRange) {
      upsertRange({
        id: selectedRange.id,
        startDate: selectedRange.start,
        endDate: selectedRange.end,
        task,
      });
      setIsModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleRemoveTask = () => {
    if (selectedRange?.id) {
      deleteRange(selectedRange.id);
      setIsModalOpen(false);
      setSelectedRange(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRange(null);
  };

  return {
    isDragging,
    dragSelection,
    selectedRange,
    isModalOpen,
    modalDates: selectedRange ? getDatesInRange(selectedRange.start, selectedRange.end) : [],
    handlers: {
      handleMouseDown,
      handleMouseEnter,
      handleRangeClick,
      handleSaveTask,
      handleRemoveTask,
      handleCloseModal,
    },
  };
}
