import { useEffect, useState } from "react";
import { ListColumn } from "../types";

interface UseListCarouselProps {
  columns: ListColumn[];
  createColumn: (params: { title: string; position: number }) => void;
}

export function useListCarousel({ columns, createColumn }: UseListCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [columnsPerPage, setColumnsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumnsPerPage(1);
      } else if (window.innerWidth < 1280) {
        setColumnsPerPage(3);
      } else {
        setColumnsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure index is valid when columns change or resize
  useEffect(() => {
    if (columns.length > 0) {
      const maxStartingIndex = Math.max(0, columns.length - columnsPerPage);
      // Only adjust if we are way out of bounds, otherwise stay put or clamp
      if (currentIndex > maxStartingIndex) {
        setCurrentIndex(maxStartingIndex);
      }
    }
  }, [columns.length, columnsPerPage, currentIndex]);

  const createNewColumn = () => {
    const maxPos = columns.length > 0 ? Math.max(...columns.map((c) => c.position)) : 0;
    createColumn({
      title: "New Column",
      position: maxPos + 1000,
    });
    // Slide to the new column
    // We increment blindly here assuming optimistic update will add the column
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (allowCreate = true) => {
    if (currentIndex + columnsPerPage < columns.length) {
      setCurrentIndex((prev) => prev + 1);
    } else if (allowCreate) {
      createNewColumn();
    }
  };

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext(false);
    if (isRightSwipe) handlePrev();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseDownX(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseDownX === null) return;
    const distance = mouseDownX - e.clientX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext(false);
    if (isRightSwipe) handlePrev();
    setMouseDownX(null);
  };

  return {
    currentIndex,
    setCurrentIndex,
    columnsPerPage,
    handlePrev,
    handleNext,
    createNewColumn,
    swipeHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseUp,
      onMouseLeave: () => setMouseDownX(null),
    },
  };
}
