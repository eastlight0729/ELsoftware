import { useState, useEffect, useCallback } from 'react';
import { Category, PlannerData } from '../types';

export const useDailyPlanner = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    // grid is an object where key is index (0-47) and value is categoryId
    const [grid, setGrid] = useState<Record<number, string | null>>({});

    // Load data on mount
    useEffect(() => {
        const load = async () => {
            const data = await window.plannerAPI.loadData();
            if (data) {
                setCategories(data.categories || []);
                setGrid(data.grid || {});
            }
        };
        load();
    }, []);

    const saveData = useCallback(async (newCategories: Category[], newGrid: Record<number, string | null>) => {
        const data: PlannerData = {
            categories: newCategories,
            grid: newGrid
        };
        await window.plannerAPI.saveData(data);
    }, []);

    const addCategory = useCallback((name: string, color: string) => {
        const newCategory: Category = {
            id: crypto.randomUUID(),
            name,
            color
        };
        const newCategories = [...categories, newCategory];
        setCategories(newCategories);
        saveData(newCategories, grid);
    }, [categories, grid, saveData]);

    const assignCell = useCallback((index: number, categoryId: string) => {
        const newGrid = { ...grid, [index]: categoryId };
        setGrid(newGrid);
        saveData(categories, newGrid);
    }, [categories, grid, saveData]);

    const clearCell = useCallback((index: number) => {
        const newGrid = { ...grid };
        delete newGrid[index]; // or set to null, but delete is cleaner for sparse
        setGrid(newGrid);
        saveData(categories, newGrid);
    }, [categories, grid, saveData]);

    // Remove category and clear from grid
    const removeCategory = useCallback((categoryId: string) => {
        const newCategories = categories.filter(c => c.id !== categoryId);
        const newGrid = { ...grid };
        // Remove assignments
        Object.keys(newGrid).forEach(key => {
            if (newGrid[Number(key)] === categoryId) {
                delete newGrid[Number(key)];
            }
        });
        setCategories(newCategories);
        setGrid(newGrid);
        saveData(newCategories, newGrid);
    }, [categories, grid, saveData]);

    return {
        categories,
        grid,
        addCategory,
        assignCell,
        clearCell,
        removeCategory
    };
};
