// src/hooks/usePomodoroTimer.ts
import { useState, useEffect, useRef } from "react";

type TimerMode = "focus" | "rest";

export function usePomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
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

  const handleTimerComplete = () => {
    playNotificationSound();
    setIsRunning(false);
    const nextMode = mode === "focus" ? "rest" : "focus";
    setMode(nextMode);
    setTimeLeft(nextMode === "focus" ? 25 * 60 : 5 * 60);
    endTimeRef.current = null;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
    endTimeRef.current = null;
  };

  const switchMode = () => {
    const nextMode = mode === "focus" ? "rest" : "focus";
    setMode(nextMode);
    setTimeLeft(nextMode === "focus" ? 25 * 60 : 5 * 60);
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

// Helper: Extracted sound logic for cleanliness
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  } catch (error) {
    console.error("Audio playback failed", error);
  }
}
