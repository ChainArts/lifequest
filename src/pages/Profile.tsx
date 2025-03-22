import DarkModeToggle from "../components/atoms/DarkModeToggle/DarkModeToggle";
import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Profile = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <h1>Profile</h1>
            <DarkModeToggle />
        </motion.main>
    );
}

export default Profile;