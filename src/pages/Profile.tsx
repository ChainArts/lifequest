import DarkModeToggle from "../components/atoms/DarkModeToggle/DarkModeToggle";
import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Profile = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <motion.section variants={sectionVariants}>
                <h1>Profile</h1>
                <DarkModeToggle />
            </motion.section>
        </motion.main>
    );
};

export default Profile;
