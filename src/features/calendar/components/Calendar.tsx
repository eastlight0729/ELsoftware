import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import { HeaderIconButton } from "../../../components/ui/HeaderIconButton";

import { CALENDAR_VARIANTS, SPRING_TRANSITION } from "../constants";
import { useCalendar } from "../hooks/useCalendar";
import { MonthCard } from "./MonthCard";
import { ScheduleModal } from "./ScheduleModal";

export function Calendar() {
  const { year, direction, months, handleDragEnd } = useCalendar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden md:p-8">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={year}
          custom={direction}
          variants={CALENDAR_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SPRING_TRANSITION}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          className="w-full h-full overflow-y-auto touch-pan-y [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex flex-col h-full max-w-7xl mx-auto p-4">
            <div className="flex flex-col w-full h-full transition-all border shadow-lg bg-white/10 rounded-xl shrink-0 border-white/20">
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="flex items-center min-h-6 px-1 -ml-1 transition-colors rounded cursor-text truncate hover:bg-white/5">
                    {year}
                  </span>
                </div>
                <HeaderIconButton className="p-2">
                  <MoreHorizontal className="w-5 h-5" />
                </HeaderIconButton>
              </div>

              <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {months.map((month) => (
                    <MonthCard
                      key={month.name}
                      date={month.date}
                      name={month.name}
                      days={month.days}
                      onDateClick={handleDateClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialDate={selectedDate}
      />
    </div>
  );
}
