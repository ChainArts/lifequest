import { invoke } from "@tauri-apps/api/core";
import DarkModeToggle from "../components/atoms/DarkModeToggle/DarkModeToggle";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Profile = () => {
    const reset_profile = async () => {
        const confirm = window.confirm("Are you sure you want to reset your profile? This action cannot be undone.");
        if (confirm) {
            await invoke("reset_data");
            window.location.reload();
        }
    };
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <motion.section variants={sectionVariants}>
                <h1>Profile</h1>
                <DarkModeToggle />
                <div className="profile__reset">
                    <button className="delete" onClick={reset_profile}>
                        Delete
                    </button>
                </div>
            </motion.section>
        </motion.main>
    );
};

export default Profile;
