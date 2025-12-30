-- Add deleted_at column to kanban_columns
ALTER TABLE public.kanban_columns 
ADD COLUMN deleted_at timestamp with time zone default null;

-- Add deleted_at column to kanban_cards
ALTER TABLE public.kanban_cards 
ADD COLUMN deleted_at timestamp with time zone default null;

-- Create indexes for active items
CREATE INDEX idx_kanban_columns_active ON public.kanban_columns(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_kanban_cards_active ON public.kanban_cards(column_id) WHERE deleted_at IS NULL;

-- Create indexes for archived items (optional but good for performance)
CREATE INDEX idx_kanban_columns_archived ON public.kanban_columns(user_id) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_kanban_cards_archived ON public.kanban_cards(column_id) WHERE deleted_at IS NOT NULL;
