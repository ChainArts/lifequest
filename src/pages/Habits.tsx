import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import HabitCards from "../components/organisms/HabitCards/HabitCards";
import ActionButton from "../components/atoms/ActionButton/ActionButton";
import { useEffect, useState } from "react";
import HabitForm from "../components/organisms/HabitForm/HabitForm";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import { invoke } from "@tauri-apps/api/core";
import { HiPlus } from "react-icons/hi";

const Habits = () => {
    const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
    const [habitList, setHabitList] = useState<HabitCardProps[]>([]);

    const fetchHabits = async () => {
        try {
            const habits = await invoke("get_habits");
            setHabitList(habits as HabitCardProps[]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants}>
                <HabitCards setOpen={setIsHabitFormOpen} habitList={habitList} />
            </motion.section>
            <section className="container">
                <HabitForm setOpen={setIsHabitFormOpen} isOpen={isHabitFormOpen} mode="create" onSubmitSuccess={fetchHabits} />
            </section>
            <ActionButton onClick={() => setIsHabitFormOpen(true)} icon={<HiPlus />} />
        </motion.main>
    );
};
export default Habits;
