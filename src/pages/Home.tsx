import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import DarkModeToggle from "../components/atoms/DarkModeToggle";
import Box from "../components/molecules/Box/Box";

const Home = () => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", { name }));
    }
    return (
        <motion.main className="container">
            <DarkModeToggle />
            <form
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
            <p>{greetMsg}</p>
            <Box>
                <h2>Box</h2>
                <p>Box component</p>
            </Box>
        </motion.main>
    );
};

export default Home;
