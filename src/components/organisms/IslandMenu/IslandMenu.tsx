import { PiPawPrintFill, PiShoppingCartFill } from "react-icons/pi";
import { motion } from "framer-motion";
import "./IslandMenu.scss";

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.5,
        },
    },
};

const islandMenuButtonVariants = {
    initial: { x: 200 },
    animate: { x: 0, transition: { duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
    exit: { x: 200, transition: { duration: 0.3, ease: [0.14, 0.8, 0.4, 1] } },
};

const IslandMenu = () => {
    return (
        <motion.div className="island-menu">
            <motion.div className="island-menu__buttons" variants={containerVariants} initial="initial" animate="animate">
                <motion.span variants={islandMenuButtonVariants} className="island-menu__button">
                    <PiShoppingCartFill />
                </motion.span>
                <motion.span variants={islandMenuButtonVariants} className="island-menu__button">
                    <PiPawPrintFill />
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default IslandMenu;
