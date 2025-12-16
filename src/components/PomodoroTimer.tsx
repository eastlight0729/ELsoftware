import { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, SkipForward } from 'lucide-react';

// Type Definition: Limits the state variable to exactly these two string values.
// This prevents typos and invalid states (e.g., 'break' vs 'rest').
type TimerState = 'focus' | 'rest';

export default function Pomodoro() {
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
            // Auto-stop when time hits zero.
            setIsRunning(false);
        }

        // Cleanup Function:
        // React runs this before re-running the effect or unmounting the component.
        // It clears the previous interval to ensure we don't have multiple timers running simultaneously.
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, seconds]);

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
        ? 'bg-red-200'    // Red for Focus
        : 'bg-emerald-200'; // Green for Rest

    const buttonColor = state === 'focus'
        ? 'hover:bg-red-300/50'
        : 'hover:bg-emerald-300/50';

    return (
        <div className={`${bgColor} rounded-2xl px-6 py-1! shadow-lg transition-colors duration-300 w-fit`}>
            <div className="flex items-center gap-6">
                <h2 className="text-xs font-medium tracking-wider text-gray-700">
                    {state === 'focus' ? 'FOCUS' : 'REST'}
                </h2>
                {/* tabular-nums: Ensures all numbers have the same width, preventing jitter as digits change */}
                <div className="text-2xl font-light text-gray-800 tabular-nums">
                    {formatTime(seconds)}
                </div>

                <div className="flex justify-center gap-3 pt-2">
                    <button
                        onClick={toggleTimer}
                        className={`p-3 rounded-full ${buttonColor} transition-colors`}
                        aria-label={isRunning ? 'Stop' : 'Start'}
                    >
                        {isRunning ? (
                            <Square className="w-5 h-5 text-gray-700" fill="currentColor" />
                        ) : (
                            <Play className="w-5 h-5 text-gray-700" fill="currentColor" />
                        )}
                    </button>

                    <button
                        onClick={resetTimer}
                        className={`p-3 rounded-full ${buttonColor} transition-colors`}
                        aria-label="Reset"
                    >
                        <RotateCcw className="w-5 h-5 text-gray-700" />
                    </button>

                    <button
                        onClick={switchState}
                        className={`p-3 rounded-full ${buttonColor} transition-colors`}
                        aria-label="Next"
                    >
                        <SkipForward className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
}