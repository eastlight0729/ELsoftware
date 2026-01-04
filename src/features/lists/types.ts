export interface ListColumn {
  id: string;
  user_id: string;
  title: string;
  position: number;
  created_at: string;
  deleted_at?: string | null;
}

export interface ListCard {
  id: string;
  column_id: string;
  user_id: string;
  content: string;
  description?: string;
  size?: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ArchivedListCard = ListCard & {
  kanban_columns: {
    title: string;
    deleted_at: string | null;
  } | null;
};

export interface NewListColumn {
  title: string;
  position: number;
}

export interface NewListCard {
  column_id: string;
  content: string;
  position: number;
}
