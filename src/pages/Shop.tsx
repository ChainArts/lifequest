import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Diary = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <h1>Diary</h1>
        </motion.main>
    );
};

export default Diary;
