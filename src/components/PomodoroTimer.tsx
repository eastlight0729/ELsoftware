import React from 'react';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';

export const PomodoroTimer: React.FC = () => {
    const {
        mode,
        timeLeft,
        isActive,
        handleStart,
        handleStop,
        handleReset,
        switchMode,
        formatTime
    } = usePomodoroTimer();

    // Helper to toggle modes for the "Skip" button
    const handleSkip = () => {
        switchMode(mode === 'task' ? 'rest' : 'task');
    };

    return (
        // Main container acting as the page background
        <div className="min-h-screen w-full bg-timer-bg flex items-center justify-center p-4 font-sans">

            {/* Card Container */}
            <div className="bg-card-bg rounded-3xl py-6 px-10 shadow-xl flex flex-row items-center justify-between gap-10 w-full max-w-4xl mx-auto">

                {/* Left Side: Time Display */}
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-white text-7xl font-bold tracking-wide leading-none select-none">
                        {formatTime(timeLeft)}
                    </h1>
                    <span className="text-white text-sm font-bold tracking-[0.2em] mt-1 uppercase select-none">
                        {mode}
                    </span>
                </div>

                {/* Right Side: Controls */}
                <div className="flex space-x-6">

                    {/* Play / Stop Button */}
                    {!isActive ? (
                        <button
                            onClick={handleStart}
                            aria-label="Start Timer"
                            className="bg-white rounded-full w-20 h-20 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95 duration-200 cursor-pointer"
                        >
                            <i className="fa-solid fa-play text-icon-color text-3xl ml-1"></i>
                        </button>
                    ) : (
                        <button
                            onClick={handleStop}
                            aria-label="Stop Timer"
                            className="bg-white rounded-full w-20 h-20 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95 duration-200 cursor-pointer"
                        >
                            <i className="fa-solid fa-pause text-icon-color text-3xl"></i>
                        </button>
                    )}

                    {/* Refresh (Reset) Button */}
                    <button
                        onClick={handleReset}
                        aria-label="Restart Timer"
                        className="bg-white rounded-full w-20 h-20 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95 duration-200 cursor-pointer"
                    >
                        <i className="fa-solid fa-arrow-rotate-right text-icon-color text-3xl"></i>
                    </button>

                    {/* Skip Button */}
                    <button
                        onClick={handleSkip}
                        aria-label="Skip Stage"
                        className="bg-white rounded-full w-20 h-20 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95 duration-200 cursor-pointer"
                    >
                        <i className="fa-solid fa-forward text-icon-color text-3xl"></i>
                    </button>

                </div>
            </div>
        </div>
    );
};