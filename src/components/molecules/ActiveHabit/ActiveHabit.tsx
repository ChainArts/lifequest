import "./ActiveHabit.scss";
import { useState } from "react";
import { HiPlus, HiCheck } from "react-icons/hi";
import { cubicBezier, motion } from "motion/react";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import FluentEmoji from "../../../lib/FluentEmoji";
import { invoke } from "@tauri-apps/api/core";

export type ActiveHabitProps = {
    id: string;
    title: string;
    goal: number;
    unit: string;
    icon: string;
    done: number;
    color: string;
};

const calulateStreakXP = (streak: number) => {
    const thresholds = [3, 7, 14, 21, 30, 45, 60, 100, 150];
    const baseXP = 10;
    let multiplier = 1;

    if (streak > thresholds[thresholds.length - 1]) return baseXP * thresholds.length;

    for (const threshold of thresholds) {
        if (streak > threshold) {
            multiplier++;
        } else {
            break;
        }
    }

    return baseXP * multiplier;
};

const ActiveHabit = ({ habit, setHabitProgress }: { habit: ActiveHabitProps; setHabitProgress: (id: string, add: number) => void }) => {
    const [circles, setCircles] = useState<{ id: string }[]>([]);
    const { id, title, goal, done, icon, color, unit } = habit;

    const handleAdd = async () => {
        setHabitProgress(id, 1);
        await updateHabitProgress(id, done + 1);
        const timestamp = Date.now();
        const newCircles = [{ id: `${timestamp}` }];
        setCircles((prev) => [...prev, ...newCircles]);
    };

    // Call this function to update habit progress in the backend.
    const updateHabitProgress = async (habitLogId: string, newProgress: number) => {
        try {
            await invoke("update_habit_log", { id: habitLogId, progress: newProgress });

            if (newProgress == goal) {
                await invoke("update_habit_log", { id: habitLogId, completed: true });
                await invoke("update_habit_log", { id: habitLogId, xp_earned: 50 });
            } else {
                await invoke("update_habit_log", { id: habitLogId, completed: false });
            }

            console.log("Habit progress updated");
        } catch (error) {
            console.error("Failed to update habit progress:", error);
        }
    };

    // Remove a circle after its animation completes
    const removeCircle = (circleId: string) => {
        setCircles((prev) => prev.filter((c) => c.id !== circleId));
    };

    const finished = done >= goal ? true : false;
    return (
        <div
            className={`habit card ${finished ? "finished" : ""}`}
            style={
                {
                    "--_card-color": color,
                } as React.CSSProperties
            }
        >
            <div className="habit__icon">
                <div className="habit-card__icon">
                    <FluentEmoji emoji={icon} size={32} className="emoji" />
                </div>
            </div>
            <div className="habit__content">
                <div className="habit__info">
                    <div className="habit__title">
                        <span className={`fst--upper-heading ${finished ? "" : "gray"}`}>
                            {done}/{goal} {unit}
                        </span>
                        <span className="fst--card-title">{title}</span>
                    </div>
                    {!finished ? (
                        <motion.div layout>
                            <motion.button className="habit__add" onTap={handleAdd}>
                                <HiPlus />
                                {circles.map((circle) => (
                                    <motion.div
                                        key={circle.id}
                                        className="habit__add-pulse-circle"
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 4, opacity: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            ease: cubicBezier(0.14, 0.8, 0.4, 1),
                                        }}
                                        onAnimationComplete={() => removeCircle(circle.id)}
                                    />
                                ))}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div layout>
                            <HiCheck className="habit__done" />
                        </motion.div>
                    )}
                </div>
                <LinearProgress className="habit__progress" goal={goal} done={done} />
            </div>
        </div>
    );
};

export default ActiveHabit;
