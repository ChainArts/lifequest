import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import HabitCards from "../components/organisms/HabitCards/HabitCards";
import ActionButton from "../components/atoms/ActionButton/ActionButton";
import { useState } from "react";
import HabitForm from "../components/organisms/HabitForm/HabitForm";
import { HiPlus } from "react-icons/hi";
import { useHabits } from "../lib/HabitsContext";

const Habits = () => {
    const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
    const { habitList, refreshHabits, refreshToday } = useHabits();

    return (
        <>
            <ActionButton onClick={() => setIsHabitFormOpen(true)} icon={<HiPlus />} />
            <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
                <motion.section variants={sectionVariants}>
                    <HabitCards setOpen={setIsHabitFormOpen} habitList={habitList} />
                </motion.section>
                <section className="container">
                    <HabitForm
                        setOpen={setIsHabitFormOpen}
                        isOpen={isHabitFormOpen}
                        mode="create"
                        onSubmitSuccess={() => { refreshHabits(); refreshToday(); }}
                    />
                </section>
            </motion.main>
        </>
    );
};

export default Habits;
