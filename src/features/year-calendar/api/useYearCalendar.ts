import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { Tables } from "../../../lib/database.types";

// Adjusting type to manually include size until database types are regenerated
export type CalendarRange = Pick<
  Tables<"year_calendar_ranges">,
  "id" | "start_date" | "end_date" | "task" | "color"
> & { size?: string };

export const calendarKeys = {
  all: ["year-calendar"] as const,
  ranges: () => [...calendarKeys.all, "ranges"] as const,
  holidays: (year: number) => [...calendarKeys.all, "holidays", year] as const,
};

export function useYearCalendarRanges() {
  return useQuery({
    queryKey: calendarKeys.ranges(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("year_calendar_ranges")
        .select("id, start_date, end_date, task, color, size")
        .order("start_date", { ascending: true });

      if (error) throw error;
      // Force cast because `size` column exists in DB but not in generated `database.types.ts` yet.
      return data as any as CalendarRange[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpsertYearCalendarRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      startDate,
      endDate,
      task,
      color,
      size,
    }: {
      id?: string;
      startDate: string;
      endDate: string;
      task?: string;
      color?: string;
      size?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();

      if (!profile || !profile.user_int_id) throw new Error("User profile not found");

      // Permitted colors only.
      const ALLOWED_COLORS = ["indigo", "green", "red", "blue", "yellow", "purple", "gray"];
      const cleanColor = ALLOWED_COLORS.includes(color || "") ? color : "indigo";

      const payload = {
        user_id: profile.user_int_id,
        start_date: startDate,
        end_date: endDate,
        task: task ? task.trim().slice(0, 500) : null, // Trim & Limit
        color: cleanColor,
        size: size || "everyday",
      };

      // Validate Date Format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw new Error("Invalid date format");
      }

      if (id) {
        const { data, error } = await supabase
          .from("year_calendar_ranges")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("year_calendar_ranges").insert(payload).select().single();
        if (error) throw error;
        return data;
      }
    },
    onMutate: async (newRange) => {
      await queryClient.cancelQueries({ queryKey: calendarKeys.ranges() });
      const previousRanges = queryClient.getQueryData<CalendarRange[]>(calendarKeys.ranges());

      queryClient.setQueryData<CalendarRange[]>(calendarKeys.ranges(), (old) => {
        const list = old ? [...old] : [];
        if (newRange.id) {
          const index = list.findIndex((r) => r.id === newRange.id);
          if (index !== -1) {
            // Optimistically update existing
            list[index] = {
              ...list[index],
              start_date: newRange.startDate,
              end_date: newRange.endDate,
              task: newRange.task ?? null,
              color: newRange.color || list[index].color,
              size: newRange.size || list[index].size || "everyday",
            };
          }
        } else {
          // Optimistically add new
          list.push({
            id: "temp-" + Date.now(),
            start_date: newRange.startDate,
            end_date: newRange.endDate,
            task: newRange.task ?? null,
            color: newRange.color || "indigo",
            size: newRange.size || "everyday",
          });
        }
        return list;
      });

      return { previousRanges };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRanges) {
        queryClient.setQueryData(calendarKeys.ranges(), context.previousRanges);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.ranges() });
    },
  });
}

export function useDeleteYearCalendarRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("year_calendar_ranges").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: calendarKeys.ranges() });
      const previousRanges = queryClient.getQueryData<CalendarRange[]>(calendarKeys.ranges());

      queryClient.setQueryData<CalendarRange[]>(calendarKeys.ranges(), (old) => {
        return old?.filter((r) => r.id !== id) || [];
      });

      return { previousRanges };
    },
    onError: (_err, _id, context) => {
      if (context?.previousRanges) {
        queryClient.setQueryData(calendarKeys.ranges(), context.previousRanges);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.ranges() });
    },
  });
}

export type CalendarMark = Pick<Tables<"year_calendar_marks">, "id" | "date" | "task">;

export const markKeys = {
  all: ["year-calendar-marks"] as const,
  list: () => [...markKeys.all, "list"] as const,
};

export function useYearCalendarMarks() {
  return useQuery({
    queryKey: markKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("year_calendar_marks")
        .select("id, date, task")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpsertYearCalendarMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date, task }: { id?: number; date: string; task: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();

      if (!profile || !profile.user_int_id) throw new Error("User profile not found");

      // Validate Date Format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new Error("Invalid date format");
      }

      const payload = {
        user_id: profile.user_int_id,
        date: date,
        task: task.trim().slice(0, 500),
      };

      if (id) {
        const { data, error } = await supabase
          .from("year_calendar_marks")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("year_calendar_marks").insert(payload).select().single();
        if (error) throw error;
        return data;
      }
    },
    onMutate: async (newMark) => {
      await queryClient.cancelQueries({ queryKey: markKeys.list() });
      const previousMarks = queryClient.getQueryData<CalendarMark[]>(markKeys.list());

      queryClient.setQueryData<CalendarMark[]>(markKeys.list(), (old) => {
        const list = old ? [...old] : [];
        if (newMark.id) {
          const index = list.findIndex((m) => m.id === newMark.id);
          if (index !== -1) {
            list[index] = { ...list[index], date: newMark.date, task: newMark.task };
          }
        } else {
          list.push({
            id: -1, // Temp ID
            date: newMark.date,
            task: newMark.task,
          });
        }
        return list;
      });

      return { previousMarks };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: markKeys.list() });
    },
  });
}

export function useDeleteYearCalendarMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("year_calendar_marks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: markKeys.list() });
      const previousMarks = queryClient.getQueryData<CalendarMark[]>(markKeys.list());

      queryClient.setQueryData<CalendarMark[]>(markKeys.list(), (old) => {
        return old?.filter((m) => m.id !== id) || [];
      });
      return { previousMarks };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: markKeys.list() });
    },
  });
}
