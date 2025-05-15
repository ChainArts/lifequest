import { createContext, useContext, ReactNode } from "react";

export type AnimalType = "chicken" | "fox" | "duck";

export interface Slot {
    id: string;
    position: { x: number; y: number; z: number };
    animal: AnimalType;
    enabled: boolean;
}

export interface Zone {
    id: string;
    name: string;
    slots: Slot[];
}

export interface IslandContextType {
    zones: Zone[];
}

const IslandContext = createContext<IslandContextType>({ zones: [] });

const predefinedZones: Zone[] = [
    {
        id: "zone-1",
        name: "Island 1",
        slots: [
            { id: "slot-1-1", position: { x: -2.5, y: 0, z: 3.1 }, animal: "chicken", enabled: true },
            { id: "slot-1-2", position: { x: 2.3, y: -1.7, z: 2.3 }, animal: "fox", enabled: true },
            { id: "slot-1-3", position: { x: 0.0, y: 4.2, z: 4.0 }, animal: "chicken", enabled: true },
            { id: "slot-1-4", position: { x: 3.8, y: -1.55, z: 0 }, animal: "fox", enabled: true },
            { id: "slot-1-5", position: { x: -3.3, y: 2.2, z: -2.7 }, animal: "chicken", enabled: true },
            { id: "slot-1-6", position: { x: 2, y: -1.4, z: -3.0 }, animal: "duck", enabled: true },
            { id: "slot-1-7", position: { x: 0, y: -1.6, z: 0 }, animal: "duck", enabled: true },
        ],
    },

    {
        id: "zone-2",
        name: "Island 2",
        slots: [
            { id: "slot-2-1", position: { x: -9.27, y: 3.41, z: -12.1 }, animal: "fox", enabled: true },
            { id: "slot-2-2", position: { x: -9.0, y: 9.2, z: -6.0 }, animal: "chicken", enabled: true },
            { id: "slot-2-3", position: { x: -8.1, y: 3.47, z: -13.14 }, animal: "fox", enabled: true },
            { id: "slot-2-4", position: { x: -11.5, y: 9.2, z: -13.8 }, animal: "chicken", enabled: true },
            { id: "slot-2-5", position: { x: -10.56, y: 3.96, z: -6.44 }, animal: "fox", enabled: true },
            { id: "slot-2-6", position: { x: -7.1, y: 3.47, z: -7.7 }, animal: "duck", enabled: true },
            { id: "slot-2-7", position: { x: -6.1, y: 3.47, z: -10.14 }, animal: "duck", enabled: true },

        ],
    },

    {
        id: "zone-3",
        name: "Island 3",
        slots: [
            { id: "slot-3-1", position: { x: -7.3, y: 6.2, z: 8.5 }, animal: "chicken", enabled: true },
            { id: "slot-3-2", position: { x: -8.5, y: 0.35, z: 8.8 }, animal: "fox", enabled: true },
            { id: "slot-3-3", position: { x: -10.5, y: 2.5, z: 11.0 }, animal: "chicken", enabled: true },
            { id: "slot-3-4", position: { x: -7.14, y: 0.31, z: 11.65 }, animal: "fox", enabled: true },
            { id: "slot-3-5", position: { x: -6.0, y: 1.2, z: 14.0 }, animal: "chicken", enabled: true },
            { id: "slot-3-6", position: { x: -10.5, y: 0.31, z: 12.0 }, animal: "duck", enabled: true },
            { id: "slot-3-7", position: { x: -11.14, y: 0.61, z: 8.5 }, animal: "duck", enabled: true },
        ],
    },
];

export const IslandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <IslandContext.Provider value={{ zones: predefinedZones }}>{children}</IslandContext.Provider>;
};

export const useIsland = (): IslandContextType => {
    return useContext(IslandContext);
};
