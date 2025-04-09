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

const Home = () => {
    const [habits, setHabits] = useState<ActiveHabitProps[]>([]);
    const [dailyXp, setDailyXp] = useState(0);
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

    const fetchXP = async () => {
        try {
            const xp: number = await invoke("get_xp_for_today", {});
            setDailyXp(xp);
        } catch (error) {
            console.error("Error fetching XP:", error);
        }
    };

    useEffect(() => {
        fetchHabits();
        fetchXP();
    }, []);

    const calculateProgress = (): number => {
        const totalHabits = habits.length;
        if (totalHabits === 0) return 0;

        const totalDone = habits.reduce((total, habit) => total + habit.done / habit.goal, 0);

        return Math.round((totalDone / totalHabits) * 100);
    };

    const setHabitProgress = (id: string, add: number) => {
        setHabits((prevHabits) => {
            const updatedHabits = prevHabits.map((habit) => {
                if (habit.id === id) {
                    const newDone = Math.min(habit.done + add, habit.goal);
                    if (newDone === habit.goal && habit.done < habit.goal) {
                        fetchXP();
                    }

                    return {
                        ...habit,
                        done: newDone,
                    };
                }
                return habit;
            });

            return updatedHabits;
        });
    };

    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants}>
                <DailyProgress progress={calculateProgress()} habits={habits.length} xp={dailyXp} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <StreakProgress streak={streak} isCompleted={calculateProgress() == 100} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <DailyHabits activeHabits={habits} setHabitProgress={setHabitProgress} updateXP={fetchXP} />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <StatsTeaser />
            </motion.section>
        </motion.main>
    );
};

export default Home;
