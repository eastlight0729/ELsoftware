import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export interface CalendarMark {
  task: string | null;
}

export type CalendarMarks = Record<string, CalendarMark>;

export const calendarKeys = {
  all: ["year-calendar"] as const,
  marks: () => [...calendarKeys.all, "marks"] as const,
};

export function useYearCalendarMarks() {
  return useQuery({
    queryKey: calendarKeys.marks(),
    queryFn: async () => {
      const { data, error } = await supabase.from("year_calendar_marks").select("date, task");
      if (error) throw error;

      const marks: CalendarMarks = {};
      data?.forEach((row) => {
        marks[row.date] = { task: row.task };
      });
      return marks;
    },
  });
}

export function useSaveYearCalendarTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dates, task }: { dates: string[]; task: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();
      if (!profile || !profile.user_int_id) throw new Error("User profile not found");

      // 1. Delete existing for these dates to avoid conflicts or duplicates
      // (This serves as a crude upsert strategy without relying on unique key constraints)
      const { error: deleteError } = await supabase
        .from("year_calendar_marks")
        .delete()
        .eq("user_id", profile.user_int_id)
        .in("date", dates);

      if (deleteError) throw deleteError;

      // 2. Insert new
      const toInsert = dates.map((date) => ({
        date,
        task,
        user_id: profile.user_int_id!,
      }));

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from("year_calendar_marks").insert(toInsert);
        if (insertError) throw insertError;
      }

      return { dates, task };
    },
    onMutate: async ({ dates, task }) => {
      await queryClient.cancelQueries({ queryKey: calendarKeys.marks() });
      const previousMarks = queryClient.getQueryData<CalendarMarks>(calendarKeys.marks());

      queryClient.setQueryData<CalendarMarks>(calendarKeys.marks(), (old) => {
        const newMarks = { ...(old || {}) };
        dates.forEach((date) => {
          newMarks[date] = { task };
        });
        return newMarks;
      });

      return { previousMarks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMarks) {
        queryClient.setQueryData(calendarKeys.marks(), context.previousMarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.marks() });
    },
  });
}

export function useDeleteYearCalendarMarks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dates: string[]) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();
      if (!profile || !profile.user_int_id) throw new Error("Profile not found");

      const { error } = await supabase
        .from("year_calendar_marks")
        .delete()
        .eq("user_id", profile.user_int_id)
        .in("date", dates);

      if (error) throw error;
      return dates;
    },
    onMutate: async (dates) => {
      await queryClient.cancelQueries({ queryKey: calendarKeys.marks() });
      const previousMarks = queryClient.getQueryData<CalendarMarks>(calendarKeys.marks());

      queryClient.setQueryData<CalendarMarks>(calendarKeys.marks(), (old) => {
        const newMarks = { ...(old || {}) };
        dates.forEach((date) => {
          delete newMarks[date];
        });
        return newMarks;
      });

      return { previousMarks };
    },
    onError: (_err, _date, context) => {
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
  if (!user.user) return;

  const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();

  if (!profile || !profile.user_int_id) return;

  const dates = Object.keys(legacyMarks);
  if (dates.length === 0) return;

  const { data: currentMarks } = await supabase.from("year_calendar_marks").select("date");

  const existingDates = new Set(currentMarks?.map((m) => m.date) || []);
  const toInsert = dates
    .filter((d) => !existingDates.has(d))
    .map((date) => ({
      date,
      task: "", // Default empty task for migration
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
