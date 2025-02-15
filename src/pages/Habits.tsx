import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Habits = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <h1>Habits</h1>
        </motion.main>
    );
}
export default Habits;