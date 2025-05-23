import { motion } from "framer-motion";
import { useIsland } from "../../../lib/IslandContext";
import { useUser } from "../../../lib/UserContext";
import { toast } from "react-toastify";
import chickenThumbnail from "/src/assets/thumbnails/chicken.png";
import foxThumbnail from "/src/assets/thumbnails/fox.png";
import duckThumbnail from "/src/assets/thumbnails/duck.png";
import { RiCopperCoinFill } from "react-icons/ri";
// import "./IslandShop.scss";

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const IslandShop = () => {
    const { shopItems, buyAnimal, getMaxSlots, refreshInventory } = useIsland();
    const { user, refreshUser } = useUser();

    const animalThumbnails = {
        chicken: chickenThumbnail,
        fox: foxThumbnail,
        duck: duckThumbnail,
    };

    const handlePurchase = async (animalType: any, price: number) => {
        if (!user || user.coins < price) {
            toast.error("Not enough coins!");
            return;
        }

        // Check if we can purchase more of this animal type
        const maxSlots = getMaxSlots(animalType);
        const currentOwned = shopItems.find((item) => item.animal === animalType)?.owned || 0;

        if (currentOwned >= maxSlots) {
            toast.error("You already own the maximum number of this animal!");
            return;
        }

        const success = await buyAnimal(animalType);
        if (success) {
            await refreshUser(); // Refresh user data to update coins
            await refreshInventory(); // Refresh inventory
            toast.success(`${animalType} purchased!`);
        } else {
            toast.error("Purchase failed!");
        }
    };

    return (
        <motion.div className="island-shop__items">
            {shopItems.map((item) => {
                const maxSlots = getMaxSlots(item.animal);
                const canAfford = (user?.coins || 0) >= item.price;
                const atMaxCapacity = item.owned >= maxSlots;

                return (
                    <motion.div key={item.id} variants={itemVariants} className={`island-shop__item ${!canAfford || atMaxCapacity ? "island-shop__item--disabled" : ""}`}>
                        <div className="island-shop__item-info">
                            <h4>{item.animal.charAt(0).toUpperCase() + item.animal.slice(1)}</h4>
                            <div className="island-shop__item-stats">
                                <span className="island-shop__owned">{item.owned}</span>
                                <span>/</span>
                                <span className="island-shop__max">{maxSlots}</span>
                            </div>
                        </div>
                        <div className="island-shop__item-image">
                            <img src={animalThumbnails[item.animal]} alt={item.animal} />
                        </div>

                        <button className="island-shop__buy-btn" onClick={() => handlePurchase(item.animal, item.price)} disabled={!canAfford || atMaxCapacity}>
                            {atMaxCapacity ? (
                                <span>Max Owned</span>
                            ) : (
                                <span className="island-shop__price">
                                    <RiCopperCoinFill /> {item.price}
                                </span>
                            )}
                        </button>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default IslandShop;
