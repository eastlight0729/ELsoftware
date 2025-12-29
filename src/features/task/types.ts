export interface KanbanColumn {
  id: string;
  user_id: string;
  title: string;
  position: number;
  created_at: string;
}

export interface KanbanCard {
  id: string;
  column_id: string;
  user_id: string;
  content: string;
  description?: string;
  size?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface NewKanbanColumn {
  title: string;
  position: number;
}

export interface NewKanbanCard {
  column_id: string;
  content: string;
  position: number;
}
