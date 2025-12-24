// src/components/PomodoroTimer.tsx
import { Play, Square, RotateCcw, SkipForward } from "lucide-react";
import { usePomodoroTimer } from "./usePomodoroTimer";

/**
 * The main UI component for the Pomodoro Timer.
 * Displays the current time, mode (Focus/Rest), and controls (Start/Stop, Reset, Skip).
 * Logic is handled by `usePomodoroTimer`.
 */
export function PomodoroTimer() {
  const { mode, timeLeft, isRunning, toggleTimer, resetTimer, switchMode } = usePomodoroTimer();

  /** Helper: Formats raw seconds into "MM:SS" */
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const bgColor = mode === "focus" ? "bg-red-300 dark:bg-red-400" : "bg-sky-300 dark:bg-sky-400";

  const buttonColor =
    mode === "focus" ? "hover:bg-red-400/50 dark:hover:bg-red-500/50" : "hover:bg-sky-400/50 dark:hover:bg-sky-500/50";

  return (
    <div className={`${bgColor} rounded-3xl px-5 py-1 shadow-lg transition-colors duration-300 w-fit`}>
      <div className="flex items-center gap-5">
        <div className="text-2xl font-bold text-neutral-900 tabular-nums">{formatTime(timeLeft)}</div>
        <h2 className="text-xs font-medium tracking-wider text-neutral-900">{mode === "focus" ? "FOCUS" : "REST"}</h2>
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`p-1 rounded-full aspect-square ${buttonColor} transition-colors`}
            aria-label={isRunning ? "Stop" : "Start"}
          >
            {isRunning ? (
              <Square className="w-4 h-4 text-neutral-900" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 text-neutral-900" fill="currentColor" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className={`p-1 rounded-full aspect-square ${buttonColor} transition-colors`}
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4 text-neutral-900" />
          </button>
          <button
            onClick={switchMode}
            className={`p-1 rounded-full aspect-square ${buttonColor} transition-colors`}
            aria-label="Next"
          >
            <SkipForward className="w-4 h-4 text-neutral-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
