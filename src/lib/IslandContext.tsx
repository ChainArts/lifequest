import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type AnimalType = "chicken" | "fox" | "duck";

export interface Slot {
    id: string;
    position: { x: number; y: number; z: number };
    animal: AnimalType;
    enabled: boolean;
}

export interface Zone {
    zone_id: string;
    name: string;
    slots: Slot[];
}

export interface IslandContextType {
    zones: Zone[];
    toggleSlotEnabled: (zone: string, slotId: string) => void;
}

const IslandContext = createContext<IslandContextType>({ zones: [], toggleSlotEnabled: () => {} });

export const IslandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const fetchedZones: Zone[] = await invoke("get_zones");
                setZones(fetchedZones);
                console.log("Fetched zones:", fetchedZones);
            } catch (error) {
                console.error("Failed to fetch zones:", error);
            }
        };
        fetchZones();
    }, []);

    const toggleSlotEnabled = async (zoneId: string, slotId: string) => {
        try {
            await invoke("toggle_slot", { zoneId, slotId });
            setZones((z) =>
                z.map((zItem) =>
                    zItem.zone_id !== zoneId
                        ? zItem
                        : {
                              ...zItem,
                              slots: zItem.slots.map((s) =>
                                  s.id === slotId ? { ...s, enabled: !s.enabled } : s
                              ),
                          }
                )
            );
        } catch (error) {
            console.error("Failed to toggle slot:", error);
        }
    };

    return <IslandContext.Provider value={{ zones, toggleSlotEnabled }}>{children}</IslandContext.Provider>;
};

export const useIsland = (): IslandContextType => {
    return useContext(IslandContext);
};
