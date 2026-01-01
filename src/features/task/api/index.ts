import { supabase } from "@/lib/supabase";
import { KanbanCard, KanbanColumn, NewKanbanCard, NewKanbanColumn } from "../types";

// Columns
// Columns
export async function getColumns() {
  const { data, error } = await (supabase as any)
    .from("kanban_columns")
    .select("*")
    .is("deleted_at", null)
    .order("position", { ascending: true });

  if (error) throw error;
  return data as KanbanColumn[];
}

export async function getArchivedColumns() {
  const { data, error } = await (supabase as any)
    .from("kanban_columns")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

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

export async function archiveColumn(id: string) {
  const { data, error } = await (supabase as any)
    .from("kanban_columns")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as KanbanColumn;
}

export async function restoreColumn(id: string) {
  const { data, error } = await (supabase as any)
    .from("kanban_columns")
    .update({ deleted_at: null })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as KanbanColumn;
}

export async function hardDeleteColumn(id: string) {
  const { error } = await (supabase as any).from("kanban_columns").delete().eq("id", id);
  if (error) throw error;
}

// Legacy support for existing hooks (will rely on archive by default for "delete" button in UI)
export const deleteColumn = archiveColumn;

// Cards
export async function getCards() {
  const { data, error } = await (supabase as any)
    .from("kanban_cards")
    .select("*")
    .is("deleted_at", null)
    .order("position", { ascending: true });

  if (error) throw error;
  return data as KanbanCard[];
}

export async function getArchivedCards() {
  // We also need column info to display "Original Column Name" and for logic
  const { data, error } = await (supabase as any)
    .from("kanban_cards")
    .select("*, kanban_columns(title, deleted_at)")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  if (error) throw error;
  // Flattener could be done here or in the component/hook.
  // For strict typing, we might strictly need to adjust the return type or mapped query data.
  // But given the constraints, I will let the hook handle the valid type or assume the join is handled.
  // However, `data` will be KanbanCard & { kanban_columns: { title: string, deleted_at: string | null } }
  return data;
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

export async function archiveCard(id: string) {
  const { data, error } = await (supabase as any)
    .from("kanban_cards")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as KanbanCard;
}

export async function restoreCard(id: string) {
  // Logic check: "Does the parent Column exist AND is it Active?"
  // We should probably check this in the mutation or component.
  // The API just performs the action.
  const { data, error } = await (supabase as any)
    .from("kanban_cards")
    .update({ deleted_at: null })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as KanbanCard;
}

export async function hardDeleteCard(id: string) {
  const { error } = await (supabase as any).from("kanban_cards").delete().eq("id", id);
  if (error) throw error;
}

// Legacy support
export const deleteCard = archiveCard;

// Helper to check column status (active/archived/deleted)
export async function getColumnStatus(id: string) {
  const { data, error } = await (supabase as any).from("kanban_columns").select("deleted_at").eq("id", id).single();

  if (error) return "deleted"; // Assuming error means not found -> deleted
  return data.deleted_at ? "archived" : "active";
}
