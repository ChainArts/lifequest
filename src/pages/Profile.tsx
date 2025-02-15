import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";

const Profile = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <h1>Profile</h1>
        </motion.main>
    );
}

export default Profile;