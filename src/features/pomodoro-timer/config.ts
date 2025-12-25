import { TimerMode } from "./types";

/**
 * Default durations for each timer mode in seconds.
 * - `focus`: 25 minutes
 * - `rest`: 5 minutes
 */
export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  rest: 5 * 60,
};
