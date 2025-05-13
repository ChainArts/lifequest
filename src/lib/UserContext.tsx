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
    updateUser: (updates: Partial<User>, strategy: string) => Promise<void>;
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
    const updateUser = async (updates: Partial<User>, strategy: string) => {
        try {
            const oldLevel = user!.level;
            const newExp = updates.exp ?? user!.exp;
            const { level: newLevel } = calculateLevel(newExp);

            // start with either passed‐in coins or current coins
            let newCoins = updates.coins ?? user!.coins;
            // reward 100 coins on level up
            if (newLevel > oldLevel) {
                newCoins += 100;
            }
            await invoke("update_user_data", {
                exp: newExp,
                level: newLevel,
                current_streak: updates.current_streak ?? user!.current_streak,
                highest_streak: updates.highest_streak ?? user!.highest_streak,
                coins: newCoins,
                strategy,
            });
            await refreshUser();
        } catch (err) {
            console.error("failed to update user:", err);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return <UserContext.Provider value={{ user, refreshUser, updateUser }}>{children}</UserContext.Provider>;
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
