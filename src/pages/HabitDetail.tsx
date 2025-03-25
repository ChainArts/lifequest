import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import HabitForm from "../components/organisms/HabitForm/HabitForm";
import HabitStats from "../components/organisms/HabitStats/HabitStats";
import HabitSettings from "../components/organisms/HabitSettings/HabitSettings";
import HabitHeatmap from "../components/organisms/HabitHeatmap/HabitHeatmap";
import HabitGraph from "../components/organisms/HabitGraph/HabitGraph";
import ActionButton from "../components/atoms/ActionButton/ActionButton";
import { HiPencil } from "react-icons/hi";

const fetchHabitDetail = async (id: string): Promise<HabitCardProps> => {
    try {
        const habit = await invoke("get_single_habit", { id });
        return habit as HabitCardProps;
    } catch (error) {
        console.error("Error fetching habit:", error);
        throw error;
    }
};

const HabitDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [habit, setHabit] = useState<HabitCardProps | null>(null);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchHabitDetail(id)
                .then((data) => {
                    setHabit(data);
                })
                .catch((error) => console.error(error));
        }
    }, [id]);

    const deleteHabit = async (habitId: string) => {
        try {
            await invoke("delete_habit", { id: habitId });
            console.log("Habit deleted");
            navigate("/habits");
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    };

    if (!habit) return <div>Loading habit details...</div>;

    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <motion.section variants={sectionVariants}>
                <div className="back" onClick={() => navigate("/habits")}>
                    Back
                </div>
                <HabitStats icon={habit.icon} xp={habit.xp} title={habit.title} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <HabitSettings setOpen={(value: boolean) => setOpen(value)} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <HabitHeatmap />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <HabitGraph />
            </motion.section>
            <motion.section variants={sectionVariants}>
                {habit && (
                    <button className="delete" onClick={() => deleteHabit(id as string)}>
                        Delete
                    </button>
                )}
                <section className="container">
                    <HabitForm setOpen={setOpen} isOpen={isOpen} mode="edit" onSubmitSuccess={() => id && fetchHabitDetail(id)} initialValues={habit} id={id} />
                </section>

                <div className="relative">
                    <ActionButton onClick={() => setOpen(true)} icon={<HiPencil />} />
                </div>
            </motion.section>
        </motion.main>
    );
};

export default HabitDetail;
