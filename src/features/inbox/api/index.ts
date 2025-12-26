import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type InboxItem = Database["public"]["Tables"]["inbox_items"]["Row"];
export type CreateInboxItemDTO = Pick<Database["public"]["Tables"]["inbox_items"]["Insert"], "content">;

export const getInboxItems = async () => {
  const { data, error } = await supabase.from("inbox_items").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createInboxItem = async ({ content, userId }: { content: string; userId: string }) => {
  const { data, error } = await supabase.from("inbox_items").insert({ content, user_id: userId }).select().single();

  if (error) throw error;
  return data;
};

export const deleteInboxItem = async (id: string) => {
  const { error } = await supabase.from("inbox_items").delete().eq("id", id);
  if (error) throw error;
};
