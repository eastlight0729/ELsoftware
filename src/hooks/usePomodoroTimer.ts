import { useState, useEffect, useRef } from 'react';

export type TimerMode = 'task' | 'rest';

const TASK_TIME = 25 * 60;
const REST_TIME = 5 * 60;

export const usePomodoroTimer = () => {
    const [mode, setMode] = useState<TimerMode>('task');
    const [timeLeft, setTimeLeft] = useState(TASK_TIME);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            // Auto-switch logic
            const nextMode = mode === 'task' ? 'rest' : 'task';
            setMode(nextMode);
            setTimeLeft(nextMode === 'task' ? TASK_TIME : REST_TIME);
            // Optional: Play a sound or notification here
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, timeLeft, mode]);

    const handleStart = () => {
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(mode === 'task' ? TASK_TIME : REST_TIME);
    };

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'task' ? TASK_TIME : REST_TIME);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        mode,
        timeLeft,
        isActive,
        handleStart,
        handleStop,
        handleReset,
        switchMode,
        formatTime,
    };
};