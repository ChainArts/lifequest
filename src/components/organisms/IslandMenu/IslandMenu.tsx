import { PiPawPrintFill, PiShoppingCartFill } from "react-icons/pi";
import { HiX } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import "./IslandMenu.scss";
import { useState } from "react";
import chickenThumbnail from "/src/assets/thumbnails/chicken.png";

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.5,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
        },
    },
};

const islandMenuButtonVariants = {
    initial: { x: 200 },
    animate: { x: 0, transition: { duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
    exit: { x: 200, transition: { duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
};

const islandMenuOverlayVariants = {
    initial: { y: 500 },
    animate: { y: 0, transition: { staggerChildren: 0.2, delay: 0.1, duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
    exit: { y: 500, transition: { duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
};

const itemListVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
};

const itemVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.14, 0.8, 0.4, 1] } },
    exit: { opacity: 0, y: -5, transition: { duration: 1, ease: [0.14, 0.8, 0.4, 1] } },
};

const IslandMenu = () => {
    const [openPlaceMenu, setOpenPlaceMenu] = useState(false);
    const [openShopMenu, setOpenShopMenu] = useState(false);

    const handlePlaceMenu = () => {
        setOpenPlaceMenu(!openPlaceMenu);
        setOpenShopMenu(false);
    };
    const handleShopMenu = () => {
        setOpenShopMenu(!openShopMenu);
        setOpenPlaceMenu(false);
    };

    const handleCloseMenu = () => {
        setOpenPlaceMenu(false);
        setOpenShopMenu(false);
    };

    const placeItems = [
        {
            id: "chicken",
            name: "Chicken",
            thumbnail: chickenThumbnail,
        }
    ];

    return (
        <motion.div className="island-menu">
            <AnimatePresence mode="wait">
                {!openPlaceMenu && !openShopMenu && (
                    <motion.div className="island-menu__buttons" variants={containerVariants} initial="initial" animate="animate" exit="exit">
                        <motion.span variants={islandMenuButtonVariants} className="island-menu__button" onClick={handleShopMenu}>
                            <PiShoppingCartFill />
                        </motion.span>
                        <motion.span variants={islandMenuButtonVariants} className="island-menu__button" onClick={handlePlaceMenu}>
                            <PiPawPrintFill />
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
                {openPlaceMenu && (
                    <motion.div variants={islandMenuOverlayVariants} initial="initial" animate="animate" exit="exit" className="island-menu__place-menu">
                        <h2>Place</h2>
                        <span className="island-menu__close" onClick={handleCloseMenu}>
                            <HiX />
                        </span>
                        <h3>Currently on the island</h3>
                        <motion.ul className="island-menu__list" variants={itemListVariants}>
                            {placeItems.map((item) => (
                                <motion.li variants={itemVariants} key={item.id} className="island-menu__item">
                                    <img src={item.thumbnail} alt={item.name} />
                                </motion.li>
                            ))}
                        </motion.ul>
                        <h3>Available</h3>
                        <motion.ul className="island-menu__list" variants={itemListVariants}>
                            {/* Similar to above but grouped with a counter for the same item */}
                            {Object.values(
                                placeItems.reduce((acc, item) => {
                                    if (!acc[item.id]) {
                                        acc[item.id] = { ...item, count: 1 };
                                    } else {
                                        acc[item.id].count += 1;
                                    }
                                    return acc;
                                }, {} as Record<string, { id: string; name: string; thumbnail: string; count: number }>)
                            ).map((groupedItem) => (
                                <motion.li variants={itemVariants} key={groupedItem.id} className="island-menu__item">
                                    <img src={groupedItem.thumbnail} alt={groupedItem.name} />
                                    {groupedItem.count > 1 && <span className="item-counter">{groupedItem.count}</span>}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
                {openShopMenu && (
                    <motion.div variants={islandMenuOverlayVariants} initial="initial" animate="animate" exit="exit" className="island-menu__shop-menu">
                        <h2>Shop</h2>
                        <span className="island-menu__close" onClick={handleCloseMenu}>
                            <HiX />
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default IslandMenu;
