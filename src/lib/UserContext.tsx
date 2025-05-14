import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { calculateLevel } from "../lib/XP";
import { invoke } from "@tauri-apps/api/core";

//
// 1) Define your User shape (match schema::User fields)
//
export interface User {
    exp: number;
    level: number;
    current_streak: number;
    highest_streak: number;
    coins: number;
}

export interface UserXP {
    goal: number; // = xpForNextLevel − xpForCurrentLevel
    done: number; // = exp − xpForCurrentLevel
}

export type DisplayUser = User & UserXP;

//
// 2) Define what you expose in the context
//
interface UserContextType {
    user: DisplayUser | null;
    refreshUser: () => Promise<void>;
    updateUser: (updates: Partial<User>, strategy: "add" | "update" | "reset_streak") => Promise<void>;
    incrementStreak: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

//
// 3) Provider component
//
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<DisplayUser | null>(null);

    // Fetch (and init) user on mount
    const refreshUser = async () => {
        const raw = (await invoke("init_user_data")) as User;
        const xpFields = calculateLevel(raw.exp);

        const display: DisplayUser = {
            ...raw,
            ...xpFields,
        };

        setUser(display);
    };

    // Merge & send updates to backend, then refresh
    const updateUser = async (updates: Partial<User>, strategy: "add" | "update" | "reset_streak") => {
        if (!user) return;

        // build a payload with only the keys we intend to change
        const payload: {
            exp?: number;
            level?: number;
            currentstreak?: number;
            higheststreak?: number;
            coins?: number;
            strategy: string;
        } = { strategy };

        // 1) handle exp & level
        if (updates.exp !== undefined) {
            if (strategy === "add") {
                // increment exp
                payload.exp = updates.exp;
                // figure out if we're leveling up
                const oldTotal = user.exp;
                const newTotal = oldTotal + updates.exp;
                const { level: newLvl } = calculateLevel(newTotal);
                const levelDelta = newLvl - user.level;
                if (levelDelta > 0) {
                    payload.level = levelDelta;
                    payload.coins = 100; // reward 100 coins per level-up
                }
            } else {
                // full replace
                payload.exp = updates.exp;
                payload.level = calculateLevel(updates.exp).level;
            }
        }

        // 2) handle streak fields
        if (updates.current_streak !== undefined) {
            payload.currentstreak = strategy === "add" ? updates.current_streak : updates.current_streak;
        }
        if (updates.highest_streak !== undefined) {
            payload.higheststreak = updates.highest_streak;
        }
        

        // 3) invoke and refresh
        try {
            await invoke("update_user_data", payload);
            await refreshUser();
        } catch (err) {
            console.error("failed to update user:", err);
        }
    };

    const incrementStreak = async () => {
        if (!user) return;
        try {
            const todayDone = await invoke("check_all_today_completed");
            console.log("today_done", todayDone);
            if (todayDone) {
                const newCurrent = user.current_streak + 1;
                const newHighest = Math.max(user.highest_streak, newCurrent);
                await updateUser({ current_streak: newCurrent, highest_streak: newHighest }, "update");
            }
        } catch (err) {
            console.error("streak update failed:", err);
        }
    };

    const checkStreak = async () => {
        if (!user) return;
        try {
            const yesterdayDone = await invoke("check_all_yesterday_completed");
            console.log("yesterday_done", yesterdayDone);

            // only reset if you already have a streak AND today isn't done
            if (user.current_streak > 0 && !yesterdayDone) {
                await updateUser({}, "reset_streak");
            }
        } catch (e) {
            console.error("streak check failed:", e);
        }
    };

    useEffect(() => {
        (async () => {
            await refreshUser();
            await checkStreak();
            await refreshUser();
        })();
    }, []);

    return <UserContext.Provider value={{ user, refreshUser, updateUser, incrementStreak }}>{children}</UserContext.Provider>;
};

//
// 4) Hook for easy consumption
//
export const useUser = (): UserContextType => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be inside UserProvider");
    }
    return ctx;
};
