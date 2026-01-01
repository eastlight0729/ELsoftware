import { supabase } from "@/lib/supabase";

export const getMemo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase.from("memos").select("*").eq("user_id", user.id).maybeSingle();

  if (error) throw error;
  return data;
};

export const saveMemo = async (content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if memo exists
  const existingMemo = await getMemo();

  if (existingMemo) {
    const { data, error } = await supabase
      .from("memos")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", existingMemo.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from("memos").insert({ user_id: user.id, content }).select().single();

    if (error) throw error;
    return data;
  }
};

export const memoService = {
  getMemo,
  saveMemo,
};
