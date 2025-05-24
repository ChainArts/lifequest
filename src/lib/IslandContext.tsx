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

// NEW: Shop item interface
export interface ShopItem {
    id: string;
    animal: AnimalType;
    price: number;
    owned: number; // how many the user owns
}

export interface IslandContextType {
    zones: Zone[];
    shopItems: ShopItem[];
    toggleSlotEnabled: (zone: string, slotId: string) => void;
    buyAnimal: (animalType: AnimalType) => Promise<boolean>;
    getAvailableSlots: (animalType: AnimalType) => number;
}

const IslandContext = createContext<IslandContextType>({
    zones: [],
    shopItems: [],
    toggleSlotEnabled: () => {},
    buyAnimal: async () => false,
    getAvailableSlots: () => 0,
});

export const IslandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [shopItems, setShopItems] = useState<ShopItem[]>([
        { id: "chicken", animal: "chicken", price: 50, owned: 1 }, // start with 1 free chicken
        { id: "fox", animal: "fox", price: 150, owned: 0 },
        { id: "duck", animal: "duck", price: 100, owned: 0 },
    ]);

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
        // Check if user owns this animal type
        const slot = zones.find((z) => z.zone_id === zoneId)?.slots.find((s) => s.id === slotId);

        if (!slot) return;

        const ownedCount = shopItems.find((item) => item.animal === slot.animal)?.owned || 0;
        const usedCount = zones.flatMap((z) => z.slots).filter((s) => s.animal === slot.animal && s.enabled).length;

        // If trying to enable and no animals available
        if (!slot.enabled && usedCount >= ownedCount) {
            console.log("No animals available to place");
            return;
        }

        try {
            await invoke("toggle_slot", { zoneId, slotId });
            setZones((z) =>
                z.map((zItem) =>
                    zItem.zone_id !== zoneId
                        ? zItem
                        : {
                              ...zItem,
                              slots: zItem.slots.map((s) => (s.id === slotId ? { ...s, enabled: !s.enabled } : s)),
                          }
                )
            );
        } catch (error) {
            console.error("Failed to toggle slot:", error);
        }
    };

    const buyAnimal = async (animalType: AnimalType): Promise<boolean> => {
        const item = shopItems.find((item) => item.animal === animalType);
        if (!item) return false;

        try {
            // This would call your backend to deduct coins and update inventory
            await invoke("buy_animal", { animalType, price: item.price });

            setShopItems((items) => items.map((item) => (item.animal === animalType ? { ...item, owned: item.owned + 1 } : item)));
            return true;
        } catch (error) {
            console.error("Failed to buy animal:", error);
            return false;
        }
    };

    const getAvailableSlots = (animalType: AnimalType): number => {
        const ownedCount = shopItems.find((item) => item.animal === animalType)?.owned || 0;
        const usedCount = zones.flatMap((z) => z.slots).filter((s) => s.animal === animalType && s.enabled).length;
        return ownedCount - usedCount;
    };

    return (
        <IslandContext.Provider
            value={{
                zones,
                shopItems,
                toggleSlotEnabled,
                buyAnimal,
                getAvailableSlots,
            }}
        >
            {children}
        </IslandContext.Provider>
    );
};

export const useIsland = (): IslandContextType => {
    return useContext(IslandContext);
};
