import { useState } from "react";
import { PiPawPrintFill, PiShoppingCartFill } from "react-icons/pi";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import "./IslandMenu.scss";
import chickenThumbnail from "/src/assets/thumbnails/chicken.png";
import foxThumbnail from "/src/assets/thumbnails/fox.png";
import duckThumbnail from "/src/assets/thumbnails/duck.png";
import { useIsland } from "../../../lib/IslandContext";
import IslandShop from "./IslandShop";

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0,
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

export const itemListVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
};

export const itemVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.14, 0.8, 0.4, 1] } },
    exit: { opacity: 0, y: -5, transition: { duration: 1, ease: [0.14, 0.8, 0.4, 1] } },
};

const IslandMenu = () => {
    const [openPlaceMenu, setOpenPlaceMenu] = useState(false);
    const [openShopMenu, setOpenShopMenu] = useState(false);

    // NEW: track which zone (0,1,2) is active
    const [currentZoneIndex, setCurrentZoneIndex] = useState(0);

    const { zones, toggleSlotEnabled, getAvailableSlots } = useIsland();
    const zoneCount = zones.length;
    const zone = zones[currentZoneIndex] || { zone: "", name: "", slots: [] };

    const animalThumbnails = {
        chicken: chickenThumbnail,
        fox: foxThumbnail,
        duck: duckThumbnail,
    };

    // only flatten slots of the active zone:
    const placed = zone.slots.filter((s) => s.enabled);
    const available = zone.slots.filter((s) => !s.enabled);

    const prevZone = () => setCurrentZoneIndex((i) => (i - 1 + zoneCount) % zoneCount);
    const nextZone = () => setCurrentZoneIndex((i) => (i + 1) % zoneCount);

    const handlePlaceMenu = () => {
        setOpenPlaceMenu((v) => !v);
        setOpenShopMenu(false);
    };
    const handleShopMenu = () => {
        setOpenShopMenu((v) => !v);
        setOpenPlaceMenu(false);
    };
    const handleCloseMenu = () => {
        setOpenPlaceMenu(false);
        setOpenShopMenu(false);
    };

    const canEnableSlot = (slot: any) => {
        return getAvailableSlots(slot.animal) > 0;
    };

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
                        <div className="island-menu__header">
                            <div className="island-menu__counter">
                                <span className="island-menu__counter--placed">{placed.length}</span>
                                <span className="island-menu__counter--separator">/</span>
                                <span className="island-menu__counter--total-free">{placed.length + available.length}</span>
                            </div>
                            <div className="island-menu__title">
                                {zoneCount > 1 && (
                                    <div className="island-menu__nav" onClick={prevZone}>
                                        <HiChevronLeft />
                                    </div>
                                )}
                                <div className="island-menu__title-text">
                                    <span>{zone.name}</span>
                                </div>
                                {zoneCount > 1 && (
                                    <div className="island-menu__nav" onClick={nextZone}>
                                        <HiChevronRight />
                                    </div>
                                )}
                            </div>
                        </div>
                        <motion.ul className="island-menu__list" variants={itemListVariants}>
                            {placed.map((slot) => (
                                <motion.li key={slot.id} variants={itemVariants} className="island-menu__item" onClick={() => toggleSlotEnabled(zone.zone_id, slot.id)}>
                                    <img src={animalThumbnails[slot.animal]} alt={slot.animal} />
                                    <FaCheck className="island-menu__tick" />
                                </motion.li>
                            ))}
                            {available.map((slot) => (
                                <motion.li
                                    key={slot.id}
                                    variants={itemVariants}
                                    className={`island-menu__item ${!canEnableSlot(slot) ? "island-menu__item--disabled" : ""}`}
                                    onClick={() => {
                                        if (canEnableSlot(slot)) {
                                            toggleSlotEnabled(zone.zone_id, slot.id);
                                        }
                                    }}
                                >
                                    <img src={animalThumbnails[slot.animal]} alt={slot.animal} />
                                </motion.li>
                            ))}
                        </motion.ul>
                        <HiX className="island-menu__close" onClick={handleCloseMenu} />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
                {openShopMenu && (
                    <motion.div variants={islandMenuOverlayVariants} initial="initial" animate="animate" exit="exit" className="island-menu__shop-menu">
                        <div className="island-menu__header">
                            <div className="island-menu__title">
                                <div className="island-menu__title-text">
                                    <span>Shop</span>
                                </div>
                            </div>
                        </div>
                        <IslandShop />
                        <HiX className="island-menu__close" onClick={handleCloseMenu} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default IslandMenu;
