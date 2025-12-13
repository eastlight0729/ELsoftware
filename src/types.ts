export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface PlannerData {
    categories: Category[];
    grid: Record<number, string | null>; // index -> categoryId
}
