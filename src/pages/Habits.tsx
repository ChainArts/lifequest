import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import HabitCards from "../components/organisms/HabitCards/HabitCards";


const Habits = () => {
    return (
        <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
        >

            <HabitCards />
        </motion.main>
    );
};
export default Habits;
