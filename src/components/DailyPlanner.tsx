import React, { useState } from 'react';
import { useDailyPlanner } from '../hooks/useDailyPlanner';

export const DailyPlanner: React.FC = () => {
    const {
        categories,
        grid,
        currentDate,
        addCategory,
        assignCell,
        clearCell,
        removeCategory,
        changeDate,
        goToToday
    } = useDailyPlanner();

    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#3498db');
    const [currentMinutes, setCurrentMinutes] = useState(0);

    // Update time every minute
    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const minutes = now.getHours() * 60 + now.getMinutes();
            setCurrentMinutes(minutes);
        };

        updateTime(); // Initial call
        const interval = setInterval(updateTime, 60000); // 60s
        return () => clearInterval(interval);
    }, []);

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

    const formatDate = (date: Date) => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';
        if (isTomorrow) return 'Tomorrow';
        return date.toLocaleDateString();
    };

    return (
        <div className="p-5 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold m-0">Daily Planner</h2>
                <div className="flex gap-2.5 items-center">
                    <button className="bg-transparent border border-[#ccc] rounded px-2.5 py-1.5 cursor-pointer text-base transition-colors duration-200 hover:bg-[#f0f0f0]" onClick={() => changeDate(-1)} title="Previous Day">
                        &lt;
                    </button>
                    <span className="font-medium min-w-[100px] text-center cursor-pointer" onClick={goToToday} title="Go to Today">
                        {formatDate(currentDate)}
                    </span>
                    <button className="bg-transparent border border-[#ccc] rounded px-2.5 py-1.5 cursor-pointer text-base transition-colors duration-200 hover:bg-[#f0f0f0]" onClick={() => changeDate(1)} title="Next Day">
                        &gt;
                    </button>
                </div>
            </div>

            {/* Time Markers */}
            <div className="grid grid-cols-24 mb-1.5 text-xs text-[#666]">
                {markers.map(hour => (
                    <div key={hour} className="text-left border-l border-[#ddd] pl-0.5">
                        {hour}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-48 gap-px h-20 bg-[#e0e0e0] border border-[#ccc] rounded relative">
                {Array.from({ length: 48 }, (_, index) => {
                    const categoryId = grid[index];
                    const category = categoryId ? getCategoryById(categoryId) : null;

                    return (
                        <div
                            key={index}
                            className="bg-white cursor-pointer relative transition-colors duration-200 hover:brightness-95"
                            style={{ backgroundColor: category?.color || 'transparent' }}
                            onClick={() => handleCellClick(index)}
                            title={category ? `${category.name} (${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'})` : `Empty (${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'})`}
                        >
                            {/* Render Popover if this is the active cell */}
                            {activeCell === index && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[99]"
                                        onClick={(e) => { e.stopPropagation(); setActiveCell(null); }}
                                    />
                                    <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#ccc] p-2.5 z-100 shadow-[0_4px_15px_rgba(0,0,0,0.15)] rounded-lg min-w-[200px] flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                                        <div className="text-[0.85rem] text-[#888] mb-1.5">Select Activity</div>
                                        {categories.length === 0 && (
                                            <div style={{ padding: '5px', fontSize: '0.8rem', color: '#999' }}>
                                                No categories. Add one below!
                                            </div>
                                        )}
                                        {categories.map(cat => (
                                            <div
                                                key={cat.id}
                                                className="flex items-center gap-2 p-1.5 cursor-pointer rounded hover:bg-[#f5f5f5]"
                                                onClick={() => handleCategorySelect(cat.id)}
                                            >
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                                <span>{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Current Time Indicator */}
                <div
                    className="absolute bottom-[-8px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-red-500 z-50 transition-[left] duration-500 ease-in-out"
                    style={{ left: `${(currentMinutes / 1440) * 100}%` }}
                    title={`Current Time: ${Math.floor(currentMinutes / 60).toString().padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`}
                />
            </div>

            {/* Controls / Legend */}
            <div className="mt-[30px] border-t border-[#eee] pt-5">
                <h3>Categories</h3>
                <div className="flex gap-4 flex-wrap mb-5">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f8f8f8] rounded-[20px] border border-[#eee]">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span>{cat.name}</span>
                            <button
                                className="bg-transparent border-0 text-[#999] cursor-pointer text-xl leading-none ml-1.5 p-0 hover:text-[#ff4444]"
                                onClick={() => removeCategory(cat.id)}
                                title="Remove category"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2.5 items-center">
                    <input
                        type="text"
                        className="px-3 py-2 border border-[#ccc] rounded-md"
                        placeholder="New category..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                    />
                    <input
                        type="color"
                        className="h-[35px] w-[50px] p-0 border-0 bg-transparent cursor-pointer"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-[#007bff] text-white border-0 rounded-md cursor-pointer font-medium hover:bg-[#0056b3]">Add new things to do</button>
                </form>
            </div>
        </div>
    );
};
