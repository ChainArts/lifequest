import { motion } from "framer-motion";
import { useIsland } from "../../../lib/IslandContext";
import { useUser } from "../../../lib/UserContext";
import { toast } from "react-toastify";
import chickenThumbnail from "/src/assets/thumbnails/chicken.png";
import foxThumbnail from "/src/assets/thumbnails/fox.png";
import duckThumbnail from "/src/assets/thumbnails/duck.png";
// import "./IslandShop.scss";

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const IslandShop = () => {
    const { shopItems, buyAnimal, getAvailableSlots } = useIsland();
    const { user, updateUser } = useUser();

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

        const success = await buyAnimal(animalType);
        if (success) {
            await updateUser({ coins: -price }, "add");
            toast.success(`${animalType} purchased!`);
        } else {
            toast.error("Purchase failed!");
        }
    };

    return (
        <>
            <span>💰 {user?.coins || 0}</span>
            <motion.div className="island-shop__items">
                {shopItems.map((item) => {
                    const availableSlots = getAvailableSlots(item.animal);
                    const canAfford = (user?.coins || 0) >= item.price;

                    return (
                        <motion.div key={item.id} variants={itemVariants} className={`island-shop__item ${!canAfford ? "island-shop__item--disabled" : ""}`}>
                            <div className="island-shop__item-image">
                                <img src={animalThumbnails[item.animal]} alt={item.animal} />
                            </div>

                            <div className="island-shop__item-info">
                                <h4>{item.animal.charAt(0).toUpperCase() + item.animal.slice(1)}</h4>
                                <div className="island-shop__item-stats">
                                    <span className="island-shop__owned">Owned: {item.owned}</span>
                                    <span className="island-shop__available">Available: {availableSlots}</span>
                                </div>
                            </div>

                            <div className="island-shop__item-purchase">
                                <span className="island-shop__price">💰 {item.price}</span>
                                <button className="island-shop__buy-btn" onClick={() => handlePurchase(item.animal, item.price)} disabled={!canAfford}>
                                    Buy
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </>
    );
};

export default IslandShop;
