// src/contexts/HabitsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";

export type ActiveHabitProps = Omit<HabitCardProps, "id"> & {
    id: string;
    done: number;
};

type HabitsContextType = {
    // full list
    habitList: HabitCardProps[];
    refreshHabits: () => Promise<void>;
    detailCache: Record<string, HabitCardProps>;
    getHabitById: (id: string, force?: boolean) => Promise<HabitCardProps>;
    refreshHabitById: (id: string) => Promise<HabitCardProps>;

    // today’s slice
    todayHabits: ActiveHabitProps[];
    dailyXp: number;
    streak: number;

    // actions
    refreshToday: () => Promise<void>;
    refreshXp: () => Promise<void>;
    setHabitProgress: (id: string, add: number) => void;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
    // full list
    const [habitList, setHabitList] = useState<HabitCardProps[]>([]);
    const [detailCache, setDetailCache] = useState<Record<string, HabitCardProps>>({});

    // today’s
    const [todayHabits, setTodayHabits] = useState<ActiveHabitProps[]>([]);
    const [dailyXp, setDailyXp] = useState(0);
    const [streak, setStreak] = useState(0); // you can wire this up to your backend if you have one

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

    const refreshStreak = async () => {
        try {
            const streak: number = (await invoke("get_streak", {})) as number;
            setStreak(streak);
        } catch (e) {
            console.error("Failed to fetch streak", e);
        }
    };

    // --- update local progress & XP when user ticks a habit ---
    const setHabitProgress = (id: string, add: number) => {
        setTodayHabits((prev) => {
            return prev.map((h) => {
                if (h.id !== id) return h;
                const newDone = Math.min(h.done + add, h.goal);
                // if they just hit the goal, bump XP
                if (h.done < h.goal && newDone === h.goal) {
                    refreshXp();
                }
                return { ...h, done: newDone };
            });
        });
    };

    // on mount, load everything
    useEffect(() => {
        refreshHabits();
        refreshToday();
        refreshXp();
        refreshStreak();
    }, []);

    return (
        <HabitsContext.Provider
            value={{
                habitList,
                refreshHabits,
                todayHabits,
                dailyXp,
                streak,
                refreshToday,
                refreshXp,
                setHabitProgress,
                detailCache,
                getHabitById,
                refreshHabitById,
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
