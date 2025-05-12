import "./ActiveHabit.scss";
import { useState } from "react";
import { HiPlus, HiCheck } from "react-icons/hi";
import { cubicBezier, motion } from "motion/react";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import FluentEmoji from "../../../lib/FluentEmoji";
import { useHabits } from "../../../lib/HabitsContext";
import { calulateStreakXP } from "../../../lib/XP";
import { useUser } from "../../../lib/UserContext";

export type ActiveHabitProps = {
    id: string;
    title: string;
    goal: number;
    unit: string;
    icon: string;
    done: number;
    color: string;
    current_streak: number;
    tracking: boolean;
};

const ActiveHabit = ({ habit, updateXP }: { habit: ActiveHabitProps; updateXP: () => void }) => {
    const [circles, setCircles] = useState<{ id: string }[]>([]);
    const { id, title, goal, done, icon, color, unit, current_streak } = habit;
    const { updateHabitProgress } = useHabits();
    const { updateUser } = useUser();

    const handleAdd = async () => {
        const gotXp = (await updateHabitProgress(id, 1, current_streak, goal)) as boolean;
        console.log("gotXp", gotXp);

        if (gotXp) {
            const earned = calulateStreakXP(current_streak);
            await updateUser({ exp: earned }, "add");
        }
        const timestamp = Date.now();
        const newCircles = [{ id: `${timestamp}` }];
        setCircles((prev) => [...prev, ...newCircles]);
        updateXP();
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
