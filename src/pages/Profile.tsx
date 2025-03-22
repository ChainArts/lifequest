import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container">
            <h1>Profile</h1>

        </motion.main>
    );
}

export default Profile;