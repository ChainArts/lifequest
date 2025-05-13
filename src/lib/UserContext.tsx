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
            await invoke("update_user_data", {
                exp: updates.exp ?? user!.exp,
                level: calculateLevel(updates.exp ?? user!.exp).level,
                current_streak: updates.current_streak ?? user!.current_streak,
                highest_streak: updates.highest_streak ?? user!.highest_streak,
                coins: updates.coins ?? user!.coins,
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
