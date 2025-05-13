// src/contexts/HabitsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import { calulateStreakXP } from "./XP";

export type ActiveHabitProps = Omit<HabitCardProps, "id"> & {
    id: string;
    done: number;
    completed?: boolean;
    data?: number;
};

type HabitsContextType = {
    // full list
    habitList: HabitCardProps[];
    refreshHabits: () => Promise<void>;
    detailCache: Record<string, HabitCardProps>;
    getHabitById: (id: string, force?: boolean) => Promise<HabitCardProps>;
    refreshHabitById: (id: string) => Promise<HabitCardProps>;
    habitCount: number;

    // today’s slice
    todayHabits: ActiveHabitProps[];
    dailyXp: number;
    // actions
    refreshToday: () => Promise<void>;
    refreshXp: () => Promise<void>;
    updateHabitProgress: (habitLogId: string, add?: number, currentStreak?: number, goal?: number, data?: number) => Promise<boolean>;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
    // full list
    const [habitList, setHabitList] = useState<HabitCardProps[]>([]);
    const [detailCache, setDetailCache] = useState<Record<string, HabitCardProps>>({});

    // today’s
    const [todayHabits, setTodayHabits] = useState<ActiveHabitProps[]>([]);
    const [dailyXp, setDailyXp] = useState(0);
    const habitCount = useMemo(() => habitList.length, [habitList]);

    const refreshHabitById = async (id: string) => {
        const habit = (await invoke("get_single_habit", { id })) as HabitCardProps;
        setDetailCache((prev) => ({ ...prev, [id]: habit }));
        return habit;
    };

    const getHabitById = async (id: string, force = false) => {
        if (!force && detailCache[id]) {
            return detailCache[id];
        }
        return await refreshHabitById(id);
    };

    // --- FULL list fetch ---
    const refreshHabits = async () => {
        try {
            const all: HabitCardProps[] = (await invoke("get_habits")) as any;
            setHabitList(all);
        } catch (e) {
            console.error("Failed to fetch all habits", e);
        }
    };

    // --- TODAY’s slice fetch ---
    const refreshToday = async () => {
        try {
            const todayIndex = new Date().getDay() - 1;
            const raw = (await invoke("sync_habit_log", { todayIndex })) as any[];
            const active = raw.map((h) => ({
                ...h,
                id: h.id.id.String,
                done: h.progress,
                data: h.data,
            })) as ActiveHabitProps[];
            setTodayHabits(active);
        } catch (e) {
            console.error("Failed to fetch today's habits", e);
        }
    };

    // --- XP fetch ---
    const refreshXp = async () => {
        try {
            const xp: number = (await invoke("get_xp_for_today", {})) as number;
            setDailyXp(xp);
        } catch (e) {
            console.error("Failed to fetch XP", e);
        }
    };

    const updateHabitProgress = async (habitLogId: string, add?: number, currentStreak?: number, goal?: number, data?: number) => {
        // 0) get previous “completed” state
        const wasCompleted = (await invoke("get_habit_log_completed", { id: habitLogId })) as boolean;
        // 1) bump local state
        let newDone = 0;
        setTodayHabits((prev) =>
            prev.map((h) => {
                if (h.id !== habitLogId) return h;
                newDone = Math.min(h.done + (add ?? 0), h.goal);
                return { ...h, done: newDone };
            })
        );

        // 2) build payload
        const completed = newDone === goal;
        const isNewCompletion = completed && !wasCompleted;
        const exp = isNewCompletion ? calulateStreakXP(currentStreak ?? 0) : 0;

        // only include exp/completed when we're newly completing
        const payload: any = { id: habitLogId, progress: newDone, data: data };
        if (isNewCompletion) {
            payload.exp = exp;
            payload.completed = true;
        }

        // 3) call backend

        try {
            if (isNewCompletion) {
                await invoke("increase_habit_xp", { id: habitLogId, exp });
                await refreshXp();
                await refreshHabits();
            }
            // this now only ever updates `progress` (and newly‐earned XP/completed if applicable)
            await invoke("update_habit_log", payload);
        } catch (e) {
            console.error("Failed to sync habit:", e);
        }

        return isNewCompletion; // return true if we got XP
    };

    // on mount, load everything
    useEffect(() => {
        refreshHabits();
        refreshToday();
        refreshXp();
    }, []);

    return (
        <HabitsContext.Provider
            value={{
                habitList,
                refreshHabits,
                todayHabits,
                dailyXp,
                refreshToday,
                refreshXp,
                updateHabitProgress,
                detailCache,
                getHabitById,
                refreshHabitById,
                habitCount,
            }}
        >
            {children}
        </HabitsContext.Provider>
    );
}

export function useHabits() {
    const ctx = useContext(HabitsContext);
    if (!ctx) throw new Error("useHabits must be inside HabitsProvider");
    return ctx;
}
