import { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, SkipForward } from 'lucide-react';

type TimerState = 'focus' | 'rest';

export default function Pomodoro() {
    const [state, setState] = useState<TimerState>('focus');
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: number | undefined;

        if (isRunning && seconds > 0) {
            interval = window.setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsRunning(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, seconds]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSeconds(state === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchState = () => {
        const newState = state === 'focus' ? 'rest' : 'focus';
        setState(newState);
        setSeconds(newState === 'focus' ? 25 * 60 : 5 * 60);
        setIsRunning(false);
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const bgColor = state === 'focus'
        ? 'bg-red-200'
        : 'bg-emerald-200';

    const buttonColor = state === 'focus'
        ? 'hover:bg-red-300/50'
        : 'hover:bg-emerald-300/50';

    return (
        <div className={`${bgColor} rounded-3xl p-6 shadow-lg transition-colors duration-300 w-64`}>
            <div className="text-center space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-gray-700">
                    {state === 'focus' ? 'FOCUS' : 'REST'}
                </h2>

                <div className="text-5xl font-light text-gray-800 tabular-nums">
                    {formatTime(seconds)}
                </div>

                <div className="flex justify-center gap-2 pt-2">
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