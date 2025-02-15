// import { invoke } from "@tauri-apps/api/core";
import { motion } from "motion/react";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import DailyHabits from "../components/organisms/DailyHabits/DailyHabits";
import StreakProgress from "../components/organisms/StreakProgress/StreakProgress";
import DailyProgress from "../components/organisms/DailyProgress/DailyProgress";
import { useState } from "react";
import pageVariants from "../components/atoms/PageTransition/PageTransition";

const Home = () => {
    const [habits, setHabits] = useState([
        {
            id: 1,
            name: "Meditation",
            goal: 5,
            done: 0,
        },
        {
            id: 2,
            name: "Workout",
            goal: 3,
            done: 0,
        },
        {
            id: 3,
            name: "Reading",
            goal: 10,
            done: 0,
        },
    ]);

    const calculateProgress = () => {
        const totalHabits = habits.length;

        const totalDone = habits.reduce(
            (total, habit) => total + habit.done / habit.goal,
            0
        );

        return Math.round((totalDone / totalHabits) * 100);
    };

    const setHabitDone = (id: number, add: number) => {
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
    // const [greetMsg, setGreetMsg] = useState("");
    // const [name, setName] = useState("");

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }
    return (
        <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
        >
            <DailyProgress
                progress={calculateProgress()}
                habbits={habits.length}
                xp={500}
            />
            <StreakProgress />

            <DailyHabits habits={habits} setHabitDone={setHabitDone} />
            <StatsTeaser />

            {/* <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <button type="submit">Greet</button>
            
            </form>
            <p>{greetMsg}</p> */}
        </motion.main>
    );
};

export default Home;
