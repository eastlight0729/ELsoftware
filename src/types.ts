export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface PlannerData {
    categories: Category[];
    // date string (YYYY-MM-DD) -> grid
    plans: Record<string, Record<number, string | null>>;
}
