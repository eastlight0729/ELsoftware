import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ToDo, PlannerData } from "../types";

/**
 * Custom hook to manage Daily Planner state and logic.
 * Handles loading/saving data, date navigation, and operations on Todos and the Grid.
 *
 * @returns An object containing state and functions to interact with the daily planner.
 */
export const useDailyPlanner = () => {
  // --- State ---
  /** Stores all todos across all dates. */
  const [allTodos, setAllTodos] = useState<ToDo[]>([]);
  /** Stores grid data (plans) mapped by date string (YYYY-MM-DD). */
  const [plans, setPlans] = useState<Record<string, Record<number, string | null>>>({});
  /** The currently selected date in the planner. */
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // --- Date Helpers ---
  /**
   * Converts a Date object to a YYYY-MM-DD string in local time.
   * @param date The date to convert.
   * @returns A string representation of the date.
   */
  const getDateKey = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  /** The YYYY-MM-DD key for the currently selected date. */
  const currentDateKey = useMemo(() => getDateKey(currentDate), [currentDate]);

  // --- Derived State ---
  /** The grid data for the currently selected date. */
  const grid = useMemo(() => {
    return plans[currentDateKey] || {};
  }, [plans, currentDateKey]);

  /** The todos filtered for the currently selected date. */
  const todos = useMemo(() => {
    return allTodos.filter((todo) => todo.date === currentDateKey);
  }, [allTodos, currentDateKey]);

  // --- Data Persistence ---
  /**
   * Initial load of data from the persistence layer (via window.electron.planner).
   */
  useEffect(() => {
    const load = async () => {
      if (window.electron?.planner) {
        try {
          const data = await window.electron.planner.loadData();
          if (data) {
            setAllTodos(data.todos || []);
            setPlans(data.plans || {});
          }
        } catch (error) {
          console.error("Failed to load planner data:", error);
        }
      }
    };
    load();
  }, []);

  /** Ref to track if the initial load has completed to prevent saving empty state over existing data. */
  const isLoaded = useRef(false);

  /**
   * Autosave effect: triggers whenever todos or plans change.
   */
  useEffect(() => {
    // Skip the first run to allow loading to complete
    if (isLoaded.current) {
      const saveData = async () => {
        const data: PlannerData = {
          todos: allTodos,
          plans: plans,
        };
        if (window.electron?.planner) {
          try {
            await window.electron.planner.saveData(data);
          } catch (error) {
            console.error("Failed to save planner data:", error);
          }
        }
      };
      saveData();
    } else {
      isLoaded.current = true;
    }
  }, [allTodos, plans]);

  // --- Todo Actions ---
  /**
   * Adds a new todo item to the current date.
   * @param text The description of the task.
   * @param color The color associated with the task.
   */
  const addToDo = useCallback(
    (text: string, color: string) => {
      const newToDo: ToDo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        color,
        date: currentDateKey,
      };
      setAllTodos((prev) => [...prev, newToDo]);
    },
    [currentDateKey]
  );

  /**
   * Toggles the completion status of a todo item.
   * @param id The unique ID of the todo.
   */
  const toggleToDo = useCallback((id: string) => {
    setAllTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  /**
   * Removes a todo item.
   * @param id The unique ID of the todo.
   */
  const removeToDo = useCallback((id: string) => {
    setAllTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Grid Actions ---
  /**
   * Assigns a color to a single cell in the grid.
   * @param index The cell index (0-95 for 15-min intervals).
   * @param color The color to assign.
   */
  const assignCell = useCallback(
    (index: number, color: string) => {
      setPlans((prev) => {
        const currentGrid = prev[currentDateKey] || {};
        return {
          ...prev,
          [currentDateKey]: { ...currentGrid, [index]: color },
        };
      });
    },
    [currentDateKey]
  );

  /**
   * Assigns a color to a range of cells in the grid.
   * @param startIndex Starting cell index.
   * @param endIndex Ending cell index.
   * @param color The color to assign.
   */
  const assignCellRange = useCallback(
    (startIndex: number, endIndex: number, color: string) => {
      setPlans((prev) => {
        const currentGrid = { ...(prev[currentDateKey] || {}) };
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);

        for (let i = start; i <= end; i++) {
          currentGrid[i] = color;
        }
        return { ...prev, [currentDateKey]: currentGrid };
      });
    },
    [currentDateKey]
  );

  /**
   * Clears the color from a single cell.
   * @param index The cell index.
   */
  const clearCell = useCallback(
    (index: number) => {
      setPlans((prev) => {
        const currentGrid = { ...(prev[currentDateKey] || {}) };
        delete currentGrid[index];
        return { ...prev, [currentDateKey]: currentGrid };
      });
    },
    [currentDateKey]
  );

  /**
   * Clears colors from a range of cells.
   * @param startIndex Starting cell index.
   * @param endIndex Ending cell index.
   */
  const clearCellRange = useCallback(
    (startIndex: number, endIndex: number) => {
      setPlans((prev) => {
        const currentGrid = { ...(prev[currentDateKey] || {}) };
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);

        for (let i = start; i <= end; i++) {
          delete currentGrid[i];
        }
        return { ...prev, [currentDateKey]: currentGrid };
      });
    },
    [currentDateKey]
  );

  // --- Navigation Actions ---
  /**
   * Changes the current date by a specified number of days.
   * @param days Number of days to add (negative to subtract).
   */
  const changeDate = useCallback(
    (days: number) => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + days);
      setCurrentDate(newDate);
    },
    [currentDate]
  );

  /**
   * Resets the current date to today's date.
   */
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    todos,
    grid,
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
