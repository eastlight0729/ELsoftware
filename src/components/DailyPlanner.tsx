import React, { useState } from 'react';
import { useDailyPlanner } from '../hooks/useDailyPlanner';
import styles from './DailyPlanner.module.css';

export const DailyPlanner: React.FC = () => {
    const {
        categories,
        grid,
        addCategory,
        assignCell,
        clearCell,
        removeCategory
    } = useDailyPlanner();

    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#3498db');

    const handleCellClick = (index: number) => {
        if (grid[index]) {
            // If already filled, clear it
            clearCell(index);
        } else {
            // If empty, open popover
            setActiveCell(index);
        }
    };

    const handleCategorySelect = (categoryId: string) => {
        if (activeCell !== null) {
            assignCell(activeCell, categoryId);
            setActiveCell(null);
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName, newCategoryColor);
            setNewCategoryName('');
        }
    };

    const getCategoryById = (id: string | null) => {
        return categories.find(c => c.id === id);
    };

    // Generate markers for hours (0, 1, 2... 23)
    const markers = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Daily Planner (24h)</h2>

            {/* Time Markers */}
            <div className={styles.markers}>
                {markers.map(hour => (
                    <div key={hour} className={styles.marker}>
                        {hour}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {Array.from({ length: 48 }, (_, index) => {
                    const categoryId = grid[index];
                    const category = categoryId ? getCategoryById(categoryId) : null;

                    return (
                        <div
                            key={index}
                            className={styles.cell}
                            style={{ backgroundColor: category?.color || 'transparent' }}
                            onClick={() => handleCellClick(index)}
                            title={category ? `${category.name} (${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'})` : `Empty (${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'})`}
                        >
                            {/* Render Popover if this is the active cell */}
                            {activeCell === index && (
                                <>
                                    <div
                                        className={styles.popoverOverlay}
                                        onClick={(e) => { e.stopPropagation(); setActiveCell(null); }}
                                    />
                                    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.popoverTitle}>Select Activity</div>
                                        {categories.length === 0 && (
                                            <div style={{ padding: '5px', fontSize: '0.8rem', color: '#999' }}>
                                                No categories. Add one below!
                                            </div>
                                        )}
                                        {categories.map(cat => (
                                            <div
                                                key={cat.id}
                                                className={styles.categoryOption}
                                                onClick={() => handleCategorySelect(cat.id)}
                                            >
                                                <div className={styles.colorBox} style={{ backgroundColor: cat.color }} />
                                                <span>{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Controls / Legend */}
            <div className={styles.controls}>
                <h3>Categories</h3>
                <div className={styles.categoryList}>
                    {categories.map(cat => (
                        <div key={cat.id} className={styles.categoryItem}>
                            <div className={styles.colorBox} style={{ backgroundColor: cat.color }} />
                            <span>{cat.name}</span>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => removeCategory(cat.id)}
                                title="Remove category"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddCategory} className={styles.addForm}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="New category..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                    />
                    <input
                        type="color"
                        className={styles.colorInput}
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                    />
                    <button type="submit" className={styles.addButton}>Add new things to do</button>
                </form>
            </div>
        </div>
    );
};
