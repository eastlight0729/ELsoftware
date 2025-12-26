import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type InboxItem = Database["public"]["Tables"]["inbox_items"]["Row"];
export type CreateInboxItemDTO = Pick<Database["public"]["Tables"]["inbox_items"]["Insert"], "content">;

export const getInboxItems = async () => {
  const { data, error } = await supabase
    .from("inbox_items")
    .select("id, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createInboxItem = async ({ content, userId }: { content: string; userId: string }) => {
  if (!content || content.trim().length === 0) {
    throw new Error("Content is required");
  }
  if (content.length > 500) {
    throw new Error("Content exceeds maximum length of 500 characters");
  }

  const { data, error } = await supabase.from("inbox_items").insert({ content, user_id: userId }).select().single();

  if (error) throw error;
  return data;
};

export const deleteInboxItem = async (id: string) => {
  const { error } = await supabase.from("inbox_items").delete().eq("id", id);
  if (error) throw error;
};
