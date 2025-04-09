// import { invoke } from "@tauri-apps/api/core";
import { motion } from "motion/react";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import DailyHabits from "../components/organisms/DailyHabits/DailyHabits";
import StreakProgress from "../components/organisms/StreakProgress/StreakProgress";
import DailyProgress from "../components/organisms/DailyProgress/DailyProgress";
import { useEffect, useState } from "react";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { invoke } from "@tauri-apps/api/core";
import { HabitCardProps } from "../components/molecules/HabitCard/HabitCard";
import { ActiveHabitProps } from "../components/molecules/ActiveHabit/ActiveHabit";

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

const Home = () => {
    const [habits, setHabits] = useState<ActiveHabitProps[]>([]);
    const [xp, setXP] = useState(0);
    const streak = 0;

    const today = new Date().getDay() - 1;

    const fetchHabits = async () => {
        try {
            const habits: HabitCardProps[] = await invoke("sync_habit_log", { todayIndex: today });
            const transformedHabits = habits.map((habit: any) => ({
                ...habit,
                id: habit.id.id.String,
                done: habit.progress,
            }));
            setHabits(transformedHabits as ActiveHabitProps[]);
        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const calculateProgress = (): number => {
        const totalHabits = habits.length;
        if (totalHabits === 0) return 0;

        const totalDone = habits.reduce((total, habit) => total + habit.done / habit.goal, 0);

        return Math.round((totalDone / totalHabits) * 100);
    };

    const setHabitDone = (id: string, add: number) => {
        setHabits((prevHabits) => {
            let bonusTriggered = false;

            const updatedHabits = prevHabits.map((habit) => {
                if (habit.id === id) {
                    // Only mark bonus if habit transitions from incomplete to complete.
                    const newDone = Math.min(habit.done + add, habit.goal);
                    if (habit.done < habit.goal && newDone === habit.goal) {
                        bonusTriggered = true;
                    }
                    return {
                        ...habit,
                        done: newDone,
                    };
                }
                return habit;
            });

            // If bonus is triggered and now every habit is complete, add bonus xp.
            if (bonusTriggered && updatedHabits.length > 0 && updatedHabits.every((habit) => habit.done === habit.goal)) {
                setXP((prevXP) => prevXP + 50);
            }

            return updatedHabits;
        });
        // Add 10 XP for each step regardless.
        setXP((prevXP) => prevXP + 10 * add);
    };

    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants}>
                <DailyProgress progress={calculateProgress()} habits={habits.length} xp={xp} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <StreakProgress streak={streak} isCompleted={calculateProgress() == 100} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <DailyHabits activeHabits={habits} setHabitDone={setHabitDone} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <StatsTeaser />
            </motion.section>
        </motion.main>
    );
};

export default Home;
