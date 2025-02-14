import "./Habit.scss";
import { Suspense, createElement, useState } from "react";
import * as Emojis from "react-fluentui-emoji/lib/modern";
import { HiPlus, HiCheck } from "react-icons/hi";
import {
    AnimatePresence,
    AnimateSharedLayout,
    cubicBezier,
    motion,
} from "motion/react";

export interface HabitProps {
    id: number;
    name: string;
    goal: number;
    done: number;
    emoji?: string;
}

const Habit = ({
    id,
    name,
    goal,
    done,
    emoji = "IconMSlightlySmilingFace",
    setHabitDone,
}: HabitProps & {
    setHabitDone: (id: number, add: number) => void;
}) => {
    const [circles, setCircles] = useState<{ id: string; delay: number }[]>([]);

    const handleAdd = () => {
        setHabitDone(id, 1);
        const timestamp = Date.now();
        const newCircles = [
            { id: `${timestamp}-1`, delay: 0 },
            { id: `${timestamp}-2`, delay: 0.2 },
        ];
        setCircles((prev) => [...prev, ...newCircles]);
    };

    // Remove a circle after its animation completes
    const removeCircle = (circleId: string) => {
        setCircles((prev) => prev.filter((c) => c.id !== circleId));
    };

    const finished = done >= goal ? true : false;
    return (
        <div className={`habit card ${finished ? "finished" : ""}`}>
            <div className="habit__icon">
                <Suspense fallback={null}>
                    {createElement(Emojis[emoji as keyof typeof Emojis])}
                </Suspense>
            </div>
            <div className="habit__content">
                <div className="habit__info">
                    <div className={`habit__title`}>
                        <span className="fst--upper-heading">
                            {done}/{goal}
                        </span>
                        <span className="fst--card-title">{name}</span>
                    </div>
                    {!finished ? (
                        <motion.div layout>
                            <motion.button
                                className="habit__add"
                                onClick={handleAdd}
                            >
                                <HiPlus />
                                {circles.map((circle) => (
                                    <motion.div
                                        key={circle.id}
                                        className="habit__add-pulse-circle"
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 4, opacity: 0 }}
                                        transition={{
                                            duration: 1,
                                            ease: cubicBezier(
                                                0.14,
                                                0.8,
                                                0.4,
                                                1
                                            ),
                                            delay: circle.delay,
                                        }}
                                        onAnimationComplete={() =>
                                            removeCircle(circle.id)
                                        }
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

                <div className="habit__progress">
                    <div
                        className="habit__progress-cover"
                        style={{ width: `${100 - (done / goal) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Habit;
