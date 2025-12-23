import { useState, useEffect, useCallback, useMemo } from "react";
import { Category, PlannerData } from "../../types";

export const useDailyPlanner = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      const data = await window.plannerAPI.loadData();
      if (data) {
        setCategories(data.categories || []);
        setPlans(data.plans || {});
      }
    };
    load();
  }, []);

  const saveData = useCallback(
    async (newCategories: Category[], newPlans: Record<string, Record<number, string | null>>) => {
      const data: PlannerData = {
        categories: newCategories,
        plans: newPlans,
      };
      await window.plannerAPI.saveData(data);
    },
    []
  );

  const addCategory = useCallback(
    (name: string, color: string) => {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        color,
      };
      const newCategories = [...categories, newCategory];
      setCategories(newCategories);
      saveData(newCategories, plans);
    },
    [categories, plans, saveData]
  );

  const assignCell = useCallback(
    (index: number, categoryId: string) => {
      const newGrid = { ...grid, [index]: categoryId };
      const newPlans = { ...plans, [currentDateKey]: newGrid };

      setPlans(newPlans);
      saveData(categories, newPlans);
    },
    [grid, plans, currentDateKey, categories, saveData]
  );

  const clearCell = useCallback(
    (index: number) => {
      const newGrid = { ...grid };
      delete newGrid[index];

      const newPlans = { ...plans, [currentDateKey]: newGrid };
      setPlans(newPlans);
      saveData(categories, newPlans);
    },
    [grid, plans, currentDateKey, categories, saveData]
  );

  // Remove category and clear from ALL grids?
  // Requirement says "category does not reseted if daily planner move another day" (implies categories are global)
  // "removeCategory" usually implies global removal.
  // We should probably keep legacy assignments or clear them.
  // For now, let's clear them from ALL plans to be consistent with previous logic ("Remove category and clear from grid").
  const removeCategory = useCallback(
    (categoryId: string) => {
      const newCategories = categories.filter((c) => c.id !== categoryId);

      const newPlans: Record<string, Record<number, string | null>> = {};

      // Deep copy and clean all plans
      Object.keys(plans).forEach((dateKey) => {
        const currentGrid = { ...plans[dateKey] };
        Object.keys(currentGrid).forEach((cellIndex) => {
          if (currentGrid[Number(cellIndex)] === categoryId) {
            delete currentGrid[Number(cellIndex)];
          }
        });
        newPlans[dateKey] = currentGrid;
      });

      setCategories(newCategories);
      setPlans(newPlans);
      saveData(newCategories, newPlans);
    },
    [categories, plans, saveData]
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
    categories,
    grid, // Returns grid for current date
    currentDate,
    addCategory,
    assignCell,
    clearCell,
    removeCategory,
    changeDate,
    goToToday,
  };
};
