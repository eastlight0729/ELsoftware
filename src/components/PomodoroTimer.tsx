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

    // Tailwind Class Mappings
    const containerClasses = `
        flex flex-col items-center justify-center p-8 rounded-xl 
        w-full max-w-[400px] mx-auto shadow-md transition-colors duration-300 border-2
        ${mode === 'task' ? 'bg-red-100 border-red-500' : 'bg-blue-100 border-sky-400'}
    `;

    const timeDisplayClasses = `
        text-6xl font-bold mb-5 font-mono
        ${mode === 'task' ? 'text-red-700' : 'text-blue-700'}
    `;

    const buttonBaseClasses = `
        px-5 py-2.5 text-base rounded-md cursor-pointer 
        transition-transform duration-100 active:scale-95 hover:opacity-90 font-semibold text-white
    `;

    const actionButtonClasses = `
        ${buttonBaseClasses}
        ${mode === 'task' ? 'bg-red-500' : 'bg-sky-500'}
    `;

    const modeBtnBaseClasses = `
        bg-transparent border-b-2 border-transparent cursor-pointer 
        text-base px-2.5 py-1.5 opacity-60 hover:opacity-100
    `;

    const getModeBtnActiveClasses = (targetMode: 'task' | 'rest') => {
        if (mode !== targetMode) return '';
        const colorClass = targetMode === 'task' ? 'border-red-700 text-red-700' : 'border-blue-700 text-blue-700';
        return `opacity-100 font-bold ${colorClass}`;
    };

    return (
        <div className={containerClasses}>
            <div className="flex gap-2.5 mb-5">
                <button
                    className={`${modeBtnBaseClasses} ${getModeBtnActiveClasses('task')}`}
                    onClick={() => switchMode('task')}
                >
                    Task
                </button>
                <button
                    className={`${modeBtnBaseClasses} ${getModeBtnActiveClasses('rest')}`}
                    onClick={() => switchMode('rest')}
                >
                    Rest
                </button>
            </div>

            <div className={timeDisplayClasses}>
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-2.5 mb-5">
                {!isActive ? (
                    <button className={actionButtonClasses} onClick={handleStart}>
                        Play
                    </button>
                ) : (
                    <button className={actionButtonClasses} onClick={handleStop}>
                        Stop
                    </button>
                )}
                <button className={actionButtonClasses} onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};