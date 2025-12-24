// src/hooks/usePomodoroTimer.ts
import { useState, useEffect, useRef } from "react";
import { TimerMode } from "./types";
import { TIMER_DURATIONS } from "./config";
import { playNotificationSound } from "./sound";

/**
 * Custom hook to manage the Pomodoro Timer logic.
 * Handles timer state, interval counting, mode switching, and sound notifications.
 *
 * @returns {Object} Timer state and control functions.
 */
export function usePomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);

  // endTimeRef stores the exact timestamp when the timer should finish.
  // We use useRef because we don't need to re-render when this changes, only when calculating math.
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && timeLeft > 0) {
      // If we just started (or resumed), calculate the target end time.
      if (endTimeRef.current === null) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      intervalId = window.setInterval(() => {
        if (endTimeRef.current) {
          const now = Date.now();
          // Calculate remaining seconds based on system time difference
          const remaining = Math.ceil((endTimeRef.current - now) / 1000);

          if (remaining <= 0) {
            handleTimerComplete();
          } else {
            setTimeLeft(remaining);
          }
        }
      }, 100); // Check every 100ms to keep UI responsive. Accuracy comes from Math, not interval speed.
    } else {
      // When paused, clear the target time so we can calculate a new one on resume.
      endTimeRef.current = null;
    }

    return () => window.clearInterval(intervalId);
  }, [isRunning, timeLeft]); // Re-run if running state or time changes

  /**
   * Handles the completion of the countdown.
   * Plays sound, switches mode, and resets timer.
   */
  const handleTimerComplete = () => {
    playNotificationSound();
    setIsRunning(false);
    const nextMode: TimerMode = mode === "focus" ? "rest" : "focus";
    setMode(nextMode);
    setTimeLeft(TIMER_DURATIONS[nextMode]);
    endTimeRef.current = null;
  };

  /** Toggles the start/pause state of the timer. */
  const toggleTimer = () => setIsRunning(!isRunning);

  /** Stops the timer and resets the time for the current mode. */
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
    endTimeRef.current = null;
  };

  /** Skips the current session and switches to the next mode immediately. */
  const switchMode = () => {
    const nextMode: TimerMode = mode === "focus" ? "rest" : "focus";
    setMode(nextMode);
    setTimeLeft(TIMER_DURATIONS[nextMode]);
    setIsRunning(false);
    endTimeRef.current = null;
  };

  return {
    mode,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    switchMode,
  };
}
