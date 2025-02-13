// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import DarkModeToggle from "../components/atoms/DarkModeToggle/DarkModeToggle";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import DailyHabits from "../components/organisms/DailyHabits/DailyHabits";
import StreakProgress from "../components/organisms/StreakProgress/StreakProgress";
import DailyProgress from "../components/organisms/DailyProgress/DailyProgress";
import IslandHeader from "../components/organisms/IslandHeader/IslandHeader";

const Home = () => {
    // const [greetMsg, setGreetMsg] = useState("");
    // const [name, setName] = useState("");

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }
    return (
        <motion.main>
            <IslandHeader />
            <DarkModeToggle />
            <DailyProgress />
            <StreakProgress />
            <StatsTeaser />
            <DailyHabits />

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
