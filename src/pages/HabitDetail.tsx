// src/pages/HabitDetail.tsx
import { useEffect, useState } from "react";
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
import { HiOutlineTrash } from "react-icons/hi2";
import { usePopOver } from "../lib/PopOverContext";

const HabitDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { getStreak } = useHabits();
    const navigate = useNavigate();
    const { getHabitById, refreshHabitById, refreshHabits, refreshToday, refreshXp } = useHabits();
    const { openPopOver, closePopOver } = usePopOver();

    const [habit, setHabit] = useState<HabitCardProps | null>(null);
    const [isOpen, setOpen] = useState(false);

    // load (cache-first)
    const loadHabit = async (force = false) => {
        if (!id) return;
        const data = await getHabitById(id, force);
        const streak = await getStreak(id);
        setHabit({
            ...data,
            current_streak: streak,
        });
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
        await refreshXp();
        navigate("/habits");
    };

    const openDelete = () => {
        openPopOver(
            "Delete Habit",
            <div>
                <p className="fst--base">
                    Are you sure you want to delete <strong>{habit ? habit.title : "this habit"}</strong>? This action cannot be undone.
                </p>
                <div className="button-container">
                    <button className="cancel" onClick={() => closePopOver()}>
                        Cancel
                    </button>
                    <button
                        className="delete"
                        onClick={() => {
                            deleteHabit();
                            closePopOver();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
                {habit && (
                    <>
                        <motion.section variants={sectionVariants} className="container">
                            <div className="link-header">
                                <div className="link primary" onClick={() => navigate("/habits")}>
                                    Back
                                </div>
                                <div className="link delete" onClick={openDelete}>
                                    <HiOutlineTrash />
                                </div>
                            </div>
                            <HabitStats {...habit} />
                        </motion.section>
                        <motion.section variants={sectionVariants} className="container">
                            <HabitSettings setOpen={setOpen} goal={habit.goal} unit={habit.unit} week_days={habit.week_days} tracking={habit.tracking} color={habit.color} />
                        </motion.section>
                        <motion.section variants={sectionVariants} className="container">
                            {id && <HabitHeatmap id={id} />}
                        </motion.section>
                        <motion.section variants={sectionVariants} className="container">
                            {habit.tracking && id && <HabitGraph id={id} />}
                        </motion.section>
                        <motion.section variants={sectionVariants} className="container">
                            <section className="container">
                                <HabitForm setOpen={setOpen} isOpen={isOpen} mode="edit" initialValues={habit} id={id} onSubmitSuccess={handleEditSuccess} />
                            </section>
                        </motion.section>
                    </>
                )}
            </motion.main>
            <ActionButton onClick={() => setOpen(true)} icon={<HiPencil />} />
            Edit
        </>
    );
};

export default HabitDetail;
