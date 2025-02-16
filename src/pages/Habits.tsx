import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import HabitCards from "../components/molecules/HabitCards/HabitCards";

const Habits = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <HabitCards />

            <button onClick={() => setOpen(true)}>Open sheet</button>

            <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>hi</Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </motion.main>
    );
};
export default Habits;
