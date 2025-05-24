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

export interface ShopItem {
    id: string;
    animal: AnimalType;
    price: number;
    owned: number;
}

export interface IslandContextType {
    zones: Zone[];
    shopItems: ShopItem[];
    toggleSlotEnabled: (zone: string, slotId: string) => void;
    buyAnimal: (animalType: AnimalType) => Promise<boolean>;
    getAvailableSlots: (animalType: AnimalType) => number;
    getMaxSlots: (animalType: AnimalType) => number;
    refreshInventory: () => Promise<void>;
}

const IslandContext = createContext<IslandContextType>({
    zones: [],
    shopItems: [],
    toggleSlotEnabled: () => {},
    buyAnimal: async () => false,
    getAvailableSlots: () => 0,
    getMaxSlots: () => 0,
    refreshInventory: async () => {},
});

export const IslandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);

    const fetchZones = async () => {
        try {
            const fetchedZones: Zone[] = await invoke("get_zones");
            setZones(fetchedZones);
        } catch (error) {
            console.error("Failed to fetch zones:", error);
        }
    };

    const refreshInventory = async () => {
        try {
            const inventory: any[] = await invoke("get_animal_inventory");
            const shopItems: ShopItem[] = [
                { id: "chicken", animal: "chicken" as AnimalType, price: 50, owned: 0 },
                { id: "fox", animal: "fox" as AnimalType, price: 150, owned: 0 },
                { id: "duck", animal: "duck" as AnimalType, price: 100, owned: 0 },
            ].map((item) => {
                const inventoryItem = inventory.find((inv) => inv.animal_type === item.animal);
                return {
                    ...item,
                    owned: inventoryItem?.owned || 0,
                };
            });
            setShopItems(shopItems);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        }
    };

    useEffect(() => {
        fetchZones();
        refreshInventory();
    }, []);

    const toggleSlotEnabled = async (zoneId: string, slotId: string) => {
        const slot = zones.find((z) => z.zone_id === zoneId)?.slots.find((s) => s.id === slotId);
        if (!slot) return;

        const ownedCount = shopItems.find((item) => item.animal === slot.animal)?.owned || 0;
        const usedCount = zones.flatMap((z) => z.slots).filter((s) => s.animal === slot.animal && s.enabled).length;

        if (!slot.enabled && usedCount >= ownedCount) {
            console.log("No animals available to place");
            return;
        }

        try {
            await invoke("toggle_slot", { zoneId, slotId });
            await fetchZones(); // Refresh zones after toggle
        } catch (error) {
            console.error("Failed to toggle slot:", error);
        }
    };

    const buyAnimal = async (animalType: AnimalType): Promise<boolean> => {
        const item = shopItems.find((item) => item.animal === animalType);
        if (!item) return false;

        try {
            await invoke("buy_animal", {
                animalType,
                price: item.price,
            });
            await refreshInventory(); // Refresh inventory after purchase
            return true;
        } catch (error) {
            console.error("Failed to buy animal:", error);
            return false;
        }
    };

    const getMaxSlots = (animalType: AnimalType): number => {
        return zones.flatMap((z) => z.slots).filter((s) => s.animal === animalType).length;
    };

    // Get currently available slots (owned - used)
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
                refreshInventory,
                getMaxSlots,
            }}
        >
            {children}
        </IslandContext.Provider>
    );
};

export const useIsland = (): IslandContextType => {
    return useContext(IslandContext);
};
