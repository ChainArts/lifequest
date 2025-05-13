// src/pages/Home.tsx
import { motion } from "motion/react";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import DailyHabits from "../components/organisms/DailyHabits/DailyHabits";
import StreakProgress from "../components/organisms/StreakProgress/StreakProgress";
import DailyProgress from "../components/organisms/DailyProgress/DailyProgress";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";

import { useHabits } from "../lib/HabitsContext";
import { useUser } from "../lib/UserContext";

const Home = () => {
    const { todayHabits, dailyXp, refreshToday, refreshXp } = useHabits();
    const { user } = useUser();

    const calculateProgress = () => {
        if (todayHabits.length === 0) return 0;
        const percent = todayHabits.reduce((sum, h) => sum + h.done / h.goal, 0) / todayHabits.length;
        return Math.round(percent * 100);
    };

    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants}>
                <DailyProgress progress={calculateProgress()} habits={todayHabits.length} xp={dailyXp} />
            </motion.section>

            <motion.section variants={sectionVariants}>
                <StreakProgress streak={user ? user.current_streak : 0} isCompleted={calculateProgress() === 100} />
            </motion.section>

            <motion.section variants={sectionVariants}>
                <DailyHabits activeHabits={todayHabits} updateXP={refreshXp} fetchHabits={refreshToday} />
            </motion.section>

            <motion.section variants={sectionVariants}>
                <StatsTeaser />
            </motion.section>
        </motion.main>
    );
};

export default Home;
