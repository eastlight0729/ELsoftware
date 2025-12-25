import { supabase } from "@/lib/supabase";
import { KanbanCard, KanbanColumn, NewKanbanCard, NewKanbanColumn } from "../types";

// Columns
export async function getColumns() {
  const { data, error } = await (supabase as any)
    .from("kanban_columns")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data as KanbanColumn[];
}

export async function createColumn(column: NewKanbanColumn) {
  const { data, error } = await (supabase as any).from("kanban_columns").insert(column).select().single();

  if (error) throw error;
  return data as KanbanColumn;
}

export async function updateColumn(id: string, updates: Partial<KanbanColumn>) {
  const { data, error } = await (supabase as any).from("kanban_columns").update(updates).eq("id", id).select().single();

  if (error) throw error;
  return data as KanbanColumn;
}

export async function deleteColumn(id: string) {
  const { error } = await (supabase as any).from("kanban_columns").delete().eq("id", id);
  if (error) throw error;
}

// Cards
export async function getCards() {
  const { data, error } = await (supabase as any)
    .from("kanban_cards")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data as KanbanCard[];
}

export async function createCard(card: NewKanbanCard) {
  const { data, error } = await (supabase as any).from("kanban_cards").insert(card).select().single();

  if (error) throw error;
  return data as KanbanCard;
}

export async function updateCard(id: string, updates: Partial<KanbanCard>) {
  const { data, error } = await (supabase as any).from("kanban_cards").update(updates).eq("id", id).select().single();

  if (error) throw error;
  return data as KanbanCard;
}

export async function deleteCard(id: string) {
  const { error } = await (supabase as any).from("kanban_cards").delete().eq("id", id);
  if (error) throw error;
}
