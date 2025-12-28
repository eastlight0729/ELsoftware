import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TaskModal } from "./TaskModal";
import { ChoiceModal } from "./ChoiceModal";
import { ActionModal } from "./ActionModal";
import { CalendarHelpModal } from "./CalendarHelpModal";
import { MonthGrid } from "./MonthGrid";
import { YearCalendarHeader } from "./YearCalendarHeader";
import { WEEKDAY_LABELS, TOTAL_COLUMNS } from "../utils";
import { cn } from "@/lib/utils";
import { useYearCalendarState } from "../hooks/useYearCalendarState";
import { useCalendarInteraction } from "../hooks/useCalendarInteraction";

export function YearCalendar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const {
    monthsToRender,
    yearDisplay,
    isTodayVisible,
    holidays,
    ranges,
    marks,
    actions: stateActions,
  } = useYearCalendarState();

  const {
    dragSelection,
    selectedRange,
    selectedDate,

    // Modals
    isChoiceModalOpen,
    isScheduleModalOpen,
    isActionModalOpen,
    isCautionModalOpen,
    dropdownPosition,

    modalDates,
    actionInitialTask,

    handlers: interactionHandlers,
  } = useCalendarInteraction(
    ranges,
    stateActions.upsertRange,
    stateActions.deleteRange,
    marks,
    stateActions.upsertMark,
    stateActions.deleteMark
  );

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500 select-none">
      <YearCalendarHeader
        yearDisplay={yearDisplay}
        isTodayVisible={isTodayVisible}
        onPrevMonth={stateActions.handlePrevMonth}
        onNextMonth={stateActions.handleNextMonth}
        onGoToToday={stateActions.handleGoToToday}
        onShowHelp={() => setIsHelpOpen(true)}
      />

      {/* Calendar Grid Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2">
          <div>
            {/* Grid Header (Weekdays) */}
            <div className="flex mb-2 gap-6">
              <div className="w-8 shrink-0" /> {/* Spacer for Month Numbers column */}
              <div className="flex-1 grid grid-cols-37 gap-1 mr-2 min-w-0">
                {Array.from({ length: TOTAL_COLUMNS }).map((_, i) => {
                  const isWeekend = i % 7 === 5 || i % 7 === 6;
                  return (
                    <div key={i} className="text-center">
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          isWeekend ? "text-red-400 dark:text-red-400/80" : "text-neutral-400 dark:text-neutral-500"
                        )}
                      >
                        {WEEKDAY_LABELS[i % 7]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Months Rows */}
            <div className="flex flex-col gap-3">
              {monthsToRender.map((month) => (
                <MonthGrid
                  key={month.key}
                  monthName={month.name}
                  monthIndex={month.monthIndex}
                  year={month.year}
                  holidays={holidays}
                  ranges={ranges}
                  marks={marks}
                  dragSelection={dragSelection}
                  onMouseDown={interactionHandlers.handleMouseDown}
                  onMouseEnter={interactionHandlers.handleMouseEnter}
                  onRangeClick={interactionHandlers.handleRangeClick}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-300 dark:border-neutral-700" />
      </div>

      <div className="flex justify-end gap-4 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-1.5 bg-green-700 dark:bg-green-600"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
          <span>Action</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-green-500/50" />
          <span>Schedule Range</span>
        </div>
      </div>

      {isChoiceModalOpen && (
        <ChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={interactionHandlers.handleCloseChoice}
          onSelectSchedule={interactionHandlers.handleSelectSchedule}
          onSelectAction={interactionHandlers.handleSelectAction}
          position={dropdownPosition}
        />
      )}

      {isScheduleModalOpen && selectedRange && (
        <TaskModal
          isOpen={isScheduleModalOpen}
          dates={modalDates}
          initialTask={selectedRange.task || null}
          initialSize={selectedRange.size}
          onSave={interactionHandlers.handleSaveTask}
          onRemove={interactionHandlers.handleRemoveTask}
          onClose={interactionHandlers.handleCloseScheduleModal}
          onSwitchAction={interactionHandlers.handleSwitchToAction}
        />
      )}

      {isActionModalOpen && selectedDate && (
        <ActionModal
          isOpen={isActionModalOpen}
          date={selectedDate}
          initialTask={actionInitialTask || null}
          onSave={interactionHandlers.handleSaveAction}
          onRemove={interactionHandlers.handleRemoveAction}
          onClose={interactionHandlers.handleCloseActionModal}
          onSwitchTask={interactionHandlers.handleSwitchToTask}
        />
      )}

      <ConfirmModal
        isOpen={isCautionModalOpen}
        onClose={interactionHandlers.handleCloseCautionModal}
        onConfirm={interactionHandlers.handleCloseCautionModal}
        title="Duplicated Schedule"
        message="You cannot create a schedule that overlaps with an existing one."
        confirmLabel="OK"
        cancelLabel="Close"
        variant="primary"
      />

      <CalendarHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
