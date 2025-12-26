import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export interface CalendarRange {
  id: string;
  start_date: string;
  end_date: string;
  task: string;
  color: string;
}

export const calendarKeys = {
  all: ["year-calendar"] as const,
  ranges: () => [...calendarKeys.all, "ranges"] as const,
};

export function useYearCalendarRanges() {
  return useQuery({
    queryKey: calendarKeys.ranges(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("year_calendar_ranges")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as CalendarRange[];
    },
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
    }: {
      id?: string;
      startDate: string;
      endDate: string;
      task: string;
      color?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: profile } = await supabase.from("profiles").select("user_int_id").eq("id", user.user.id).single();
      if (!profile || !profile.user_int_id) throw new Error("User profile not found");

      const payload = {
        user_id: profile.user_int_id,
        start_date: startDate,
        end_date: endDate,
        task,
        color: color || "indigo",
      };

      if (id) {
        const { data, error } = await supabase
          .from("year_calendar_ranges")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as CalendarRange;
      } else {
        const { data, error } = await supabase.from("year_calendar_ranges").insert(payload).select().single();
        if (error) throw error;
        return data as CalendarRange;
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
            list[index] = {
              ...list[index],
              start_date: newRange.startDate,
              end_date: newRange.endDate,
              task: newRange.task,
              color: newRange.color || list[index].color,
            };
          }
        } else {
          // Optimistic ID? Might be tricky for delete, but okay for display
          list.push({
            id: "temp-" + Date.now(),
            start_date: newRange.startDate,
            end_date: newRange.endDate,
            task: newRange.task,
            color: newRange.color || "indigo",
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
