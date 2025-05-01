// src/pages/HabitDetail.tsx
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useHabits } from "../lib/HabitsContext";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import HabitStats from "../components/organisms/HabitStats/HabitStats";
import HabitSettings from "../components/organisms/HabitSettings/HabitSettings";
import HabitHeatmap from "../components/organisms/HabitHeatmap/HabitHeatmap";
import HabitGraph from "../components/organisms/HabitGraph/HabitGraph";
import HabitForm from "../components/organisms/HabitForm/HabitForm";
import ActionButton from "../components/atoms/ActionButton/ActionButton";
import { HiPencil } from "react-icons/hi";

const HabitDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getHabitById, refreshHabitById, refreshHabits, refreshToday, refreshXp } = useHabits();

    const [habit, setHabit] = useState<HabitCardProps | null>(null);
    const [isOpen, setOpen] = useState(false);

    // load (cache-first)
    const loadHabit = async (force = false) => {
        if (!id) return;
        const data = await getHabitById(id, force);
        setHabit(data);
    };

    useEffect(() => {
        loadHabit();
    }, [id]);

    // after saving, force refetch everything
    const handleEditSuccess = async () => {
        if (!id) return;
        const fresh = await refreshHabitById(id); // always hits the API
        setHabit(fresh);
        await refreshHabits();
        await refreshToday();
        await refreshXp();
    };

    const deleteHabit = async () => {
        if (!id) return;
        await invoke("delete_habit", { id });
        await refreshHabits();
        await refreshToday();
        navigate("/habits");
    };

    if (!habit) return <div>Loading habit details...</div>;

    return (
        <>
            <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
                <motion.section variants={sectionVariants}>
                    <div className="back" onClick={() => navigate("/habits")}>
                        Back
                    </div>
                    <HabitStats icon={habit.icon} xp={habit.habit_xp} title={habit.title} />
                </motion.section>
                <motion.section variants={sectionVariants}>
                    <HabitSettings setOpen={setOpen} />
                </motion.section>
                <motion.section variants={sectionVariants}>
                    <HabitHeatmap />
                </motion.section>
                <motion.section variants={sectionVariants}>
                    <HabitGraph />
                </motion.section>
                <motion.section variants={sectionVariants}>
                    <button className="delete" onClick={deleteHabit}>
                        Delete
                    </button>
                    <section className="container">
                        <HabitForm setOpen={setOpen} isOpen={isOpen} mode="edit" initialValues={habit} id={id} onSubmitSuccess={handleEditSuccess} />
                    </section>
                </motion.section>
            </motion.main>
            <ActionButton onClick={() => setOpen(true)} icon={<HiPencil />} />
        </>
    );
};

export default HabitDetail;
