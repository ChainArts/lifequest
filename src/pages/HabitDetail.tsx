import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import HabitForm from "../components/organisms/HabitForm/HabitForm";

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
            <h1>Habit Detail</h1>
            <div>
                <h2>{habit.title}</h2>
            </div>
            {habit && <button onClick={() => setOpen(true)}>Edit</button>}
            {habit && <button onClick={() => deleteHabit(id as string)}>Delete</button>}
            <section className="container">
                <HabitForm setOpen={setOpen} isOpen={isOpen} mode="edit" onSubmitSuccess={() => id && fetchHabitDetail(id)} initialValues={habit} id={id} />
            </section>
        </motion.main>
    );
};

export default HabitDetail;
