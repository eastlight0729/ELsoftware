-- Create kanban_columns table
create table public.kanban_columns (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null default auth.uid(),
    title text not null,
    position double precision not null default 0,
    created_at timestamp with time zone not null default now(),
    
    constraint kanban_columns_pkey primary key (id),
    constraint kanban_columns_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

-- Create kanban_cards table
create table public.kanban_cards (
    id uuid not null default gen_random_uuid(),
    column_id uuid not null,
    user_id uuid not null default auth.uid(),
    content text not null,
    position double precision not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    
    constraint kanban_cards_pkey primary key (id),
    constraint kanban_cards_column_id_fkey foreign key (column_id) references public.kanban_columns(id) on delete cascade,
    constraint kanban_cards_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.kanban_columns enable row level security;
alter table public.kanban_cards enable row level security;

-- Policies for kanban_columns
create policy "Users can view their own columns" 
on public.kanban_columns for select 
using (auth.uid() = user_id);

create policy "Users can insert their own columns" 
on public.kanban_columns for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own columns" 
on public.kanban_columns for update 
using (auth.uid() = user_id);

create policy "Users can delete their own columns" 
on public.kanban_columns for delete 
using (auth.uid() = user_id);

-- Policies for kanban_cards
create policy "Users can view their own cards" 
on public.kanban_cards for select 
using (auth.uid() = user_id);

create policy "Users can insert their own cards" 
on public.kanban_cards for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own cards" 
on public.kanban_cards for update 
using (auth.uid() = user_id);

create policy "Users can delete their own cards" 
on public.kanban_cards for delete 
using (auth.uid() = user_id);

-- Function to handle updated_at
create or replace function public.handle_kanban_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger handle_kanban_cards_updated_at
    before update on public.kanban_cards
    for each row
    execute procedure public.handle_kanban_updated_at();
