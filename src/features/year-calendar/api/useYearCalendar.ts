import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export const calendarKeys = {
  all: ["year-calendar"] as const,
  marks: () => [...calendarKeys.all, "marks"] as const,
};

export function useYearCalendarMarks() {
  return useQuery({
    queryKey: calendarKeys.marks(),
    queryFn: async () => {
      const { data, error } = await supabase.from("year_calendar_marks").select("date");
      if (error) throw error;

      const marks: Record<string, boolean> = {};
      data?.forEach((row) => {
        marks[row.date] = true;
      });
      return marks;
    },
  });
}

export function useToggleYearCalendarMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      // Check if it exists
      const { data: existing } = await supabase.from("year_calendar_marks").select("id").eq("date", date).maybeSingle();

      if (existing) {
        const { error } = await supabase.from("year_calendar_marks").delete().eq("id", existing.id);
        if (error) throw error;
        return { date, active: false };
      } else {
        // Fetch the user's integer ID from profiles
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Not authenticated");

        const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();

        if (!profile || !profile.user_int_id) {
          throw new Error("User profile not found or missing integer ID");
        }

        const { error } = await supabase.from("year_calendar_marks").insert({ date, user_id: profile.user_int_id });
        if (error) throw error;
        return { date, active: true };
      }
    },
    onMutate: async (date) => {
      await queryClient.cancelQueries({ queryKey: calendarKeys.marks() });
      const previousMarks = queryClient.getQueryData<Record<string, boolean>>(calendarKeys.marks());

      queryClient.setQueryData<Record<string, boolean>>(calendarKeys.marks(), (old) => {
        const newMarks = { ...(old || {}) };
        if (newMarks[date]) {
          delete newMarks[date];
        } else {
          newMarks[date] = true;
        }
        return newMarks;
      });

      return { previousMarks };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousMarks) {
        queryClient.setQueryData(calendarKeys.marks(), context.previousMarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.marks() });
    },
  });
}

export async function migrateLegacyMarks(legacyMarks: Record<string, boolean>) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return; // Cannot migrate if not logged in

  const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();

  if (!profile || !profile.user_int_id) return; // Cannot migrate without profile ID

  const dates = Object.keys(legacyMarks);
  if (dates.length === 0) return;

  // Batch insert
  const { data: currentMarks } = await supabase.from("year_calendar_marks").select("date");

  const existingDates = new Set(currentMarks?.map((m) => m.date) || []);
  const toInsert = dates
    .filter((d) => !existingDates.has(d))
    .map((date) => ({
      date,
      user_id: profile.user_int_id,
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("year_calendar_marks").insert(toInsert);
    if (error) {
      console.error("Migration partial failure", error);
      throw error;
    }
  }
}
