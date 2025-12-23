import { useState, useEffect, useCallback, useMemo } from "react";
import { ToDo, PlannerData } from "../types";

export const useDailyPlanner = () => {
  const [allTodos, setAllTodos] = useState<ToDo[]>([]);
  // date string (YYYY-MM-DD) -> grid
  const [plans, setPlans] = useState<Record<string, Record<number, string | null>>>({});

  // Date Management
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Helper to get YYYY-MM-DD string (local time)
  const getDateKey = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const currentDateKey = useMemo(() => getDateKey(currentDate), [currentDate]);

  // Derived grid for current date
  const grid = useMemo(() => {
    return plans[currentDateKey] || {};
  }, [plans, currentDateKey]);

  // Derived todos for current date
  const todos = useMemo(() => {
    return allTodos.filter((todo) => todo.date === currentDateKey);
  }, [allTodos, currentDateKey]);

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      const data = await window.plannerAPI.loadData();
      if (data) {
        setAllTodos(data.todos || []);
        setPlans(data.plans || {});
      }
    };
    load();
  }, []);

  const saveData = useCallback(async (newTodos: ToDo[], newPlans: Record<string, Record<number, string | null>>) => {
    const data: PlannerData = {
      todos: newTodos,
      plans: newPlans,
    };
    await window.plannerAPI.saveData(data);
  }, []);

  const addToDo = useCallback(
    (text: string, color: string) => {
      const newToDo: ToDo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        color,
        date: currentDateKey,
      };
      const newTodos = [...allTodos, newToDo];
      setAllTodos(newTodos);
      saveData(newTodos, plans);
    },
    [allTodos, plans, saveData, currentDateKey]
  );

  const toggleToDo = useCallback(
    (id: string) => {
      const newTodos = allTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      setAllTodos(newTodos);
      saveData(newTodos, plans);
    },
    [allTodos, plans, saveData]
  );

  const removeToDo = useCallback(
    (id: string) => {
      const newTodos = allTodos.filter((t) => t.id !== id);
      setAllTodos(newTodos);
      saveData(newTodos, plans);
    },
    [allTodos, plans, saveData]
  );

  // Grid Operations (Color based)
  const assignCell = useCallback(
    (index: number, color: string) => {
      const newGrid = { ...grid, [index]: color };
      const newPlans = { ...plans, [currentDateKey]: newGrid };

      setPlans(newPlans);
      saveData(allTodos, newPlans);
    },
    [grid, plans, currentDateKey, allTodos, saveData]
  );

  const assignCellRange = useCallback(
    (startIndex: number, endIndex: number, color: string) => {
      const newGrid = { ...grid };
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      for (let i = start; i <= end; i++) {
        newGrid[i] = color;
      }

      const newPlans = { ...plans, [currentDateKey]: newGrid };
      setPlans(newPlans);
      saveData(allTodos, newPlans);
    },
    [grid, plans, currentDateKey, allTodos, saveData]
  );

  const clearCell = useCallback(
    (index: number) => {
      const newGrid = { ...grid };
      delete newGrid[index];

      const newPlans = { ...plans, [currentDateKey]: newGrid };
      setPlans(newPlans);
      saveData(allTodos, newPlans);
    },
    [grid, plans, currentDateKey, allTodos, saveData]
  );

  const clearCellRange = useCallback(
    (startIndex: number, endIndex: number) => {
      const newGrid = { ...grid };
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      for (let i = start; i <= end; i++) {
        delete newGrid[i];
      }

      const newPlans = { ...plans, [currentDateKey]: newGrid };
      setPlans(newPlans);
      saveData(allTodos, newPlans);
    },
    [grid, plans, currentDateKey, allTodos, saveData]
  );

  // Navigation
  const changeDate = useCallback(
    (days: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + days);
      setCurrentDate(newDate);
    },
    [currentDate]
  );

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    todos, // Returns todos for current date
    grid, // Returns grid for current date
    currentDate,
    addToDo,
    removeToDo,
    toggleToDo,
    assignCell,
    assignCellRange,
    clearCell,
    clearCellRange,
    changeDate,
    goToToday,
  };
};
