// import { invoke } from "@tauri-apps/api/core";
import { motion } from "motion/react";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import DailyHabits from "../components/organisms/DailyHabits/DailyHabits";
import StreakProgress from "../components/organisms/StreakProgress/StreakProgress";
import DailyProgress from "../components/organisms/DailyProgress/DailyProgress";
import { useEffect, useState } from "react";
import pageVariants from "../components/atoms/PageTransition/PageTransition";
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
            console.log(today);
            const habits: HabitCardProps[] = await invoke("get_todays_habits", { todayIndex: today });

            const transformedHabits = habits.map((habit: any) => ({
                ...habit,
                id: habit.id.id.String,
                done: 0,
            }));
            setHabits(transformedHabits as ActiveHabitProps[]);
        } catch (error) {
            console.error(error);
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
        setHabits((habits) =>
            habits.map((habit) =>
                habit.id === id
                    ? {
                          ...habit,
                          done: Math.min(habit.done + add, habit.goal),
                      }
                    : habit
            )
        );
    };

    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <DailyProgress progress={calculateProgress()} habits={habits.length} xp={xp} />
            <StreakProgress streak={streak} isCompleted={calculateProgress() == 100} />
            <DailyHabits activeHabits={habits} setHabitDone={setHabitDone} />
            <StatsTeaser />
        </motion.main>
    );
};

export default Home;
