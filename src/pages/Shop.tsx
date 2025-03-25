import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Shop = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <motion.section variants={sectionVariants}>
                <h1>Shop</h1>
            </motion.section>
        </motion.main>
    );
};

export default Shop;
