import { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, SkipForward } from 'lucide-react';

// Type Definition: Limits the state variable to exactly these two string values.
// This prevents typos and invalid states (e.g., 'break' vs 'rest').
type TimerState = 'focus' | 'rest';

export function PomodoroTimer() {
    // State Management
    // 1. state: Tracks the current mode (Focus vs Rest).
    // 2. seconds: We store time as total seconds (integer) rather than separate minutes/seconds objects.
    //    This makes math (subtraction) much easier. 25 * 60 = 1500 seconds.
    // 3. isRunning: Boolean flag to start/stop the countdown.
    const [state, setState] = useState<TimerState>('focus');
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    // Effect: Handles the Timer Logic
    // This hook runs whenever 'isRunning' or 'seconds' changes.
    useEffect(() => {
        let interval: number | undefined;

        // Condition: Only start the interval if the timer is active and time remains.
        if (isRunning && seconds > 0) {
            // We use 'window.setInterval' to explicitly use the Browser API (returns a number ID),
            // distinguishing it from Node.js timers in TypeScript.
            interval = window.setInterval(() => {
                setSeconds(s => s - 1); // Functional update ensures we use the most recent value of 's'
            }, 1000);
        } else if (seconds === 0) {
            // When timer hits zero:
            // 1. Play a notification sound (bell ring)
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    // Bell sound settings
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                    osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 1.5); // Drop to C4

                    gain.gain.setValueAtTime(0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

                    osc.start();
                    osc.stop(ctx.currentTime + 1.0);
                }
            } catch (error) {
                console.error("Audio playback failed", error);
            }

            // 2. Stop the timer
            setIsRunning(false);

            // 3. Switch to the other state (Focus <-> Rest)
            const newState = state === 'focus' ? 'rest' : 'focus';
            setState(newState);

            // 4. Reset the timer to the new state's duration
            setSeconds(newState === 'focus' ? 25 * 60 : 5 * 60);
        }

        // Cleanup Function
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, seconds, state]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        // Reset time based on the current mode (25min for focus, 5min for rest).
        setSeconds(state === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchState = () => {
        // Toggle between 'focus' and 'rest'
        const newState = state === 'focus' ? 'rest' : 'focus';
        setState(newState);
        // Set the appropriate duration for the new state
        setSeconds(newState === 'focus' ? 25 * 60 : 5 * 60);
        setIsRunning(false); // Always pause when switching modes
    };

    // Helper: Formats raw seconds into "MM:SS" string
    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60); // Get whole minutes
        const remainingSecs = secs % 60;    // Get remainder seconds
        // padStart(2, '0') ensures "5" becomes "05" for consistent layout
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    // Dynamic Styling Variables
    // We determine colors here to keep the JSX return statement clean.
    const bgColor = state === 'focus'
        ? 'bg-red-300 dark:bg-red-400'
        : 'bg-sky-300 dark:bg-sky-400';

    const buttonColor = state === 'focus'
        ? 'hover:bg-red-400/50 dark:hover:bg-red-500/50'
        : 'hover:bg-sky-400/50 dark:hover:bg-sky-500/50';

    return (
        <div className={`${bgColor} rounded-3xl px-5 py-1 shadow-lg transition-colors duration-300 w-fit`}>
            <div className="flex items-center gap-5">
                {/* tabular-nums: Ensures all numbers have the same width, preventing jitter as digits change */}
                <div className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {formatTime(seconds)}
                </div>
                <h2 className="text-xs font-medium tracking-wider text-neutral-900">
                    {state === 'focus' ? 'FOCUS' : 'REST'}
                </h2>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`p-1 rounded-full aspect-square ${buttonColor} transition-colors`}
                        aria-label={isRunning ? 'Stop' : 'Start'}
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
                        onClick={switchState}
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