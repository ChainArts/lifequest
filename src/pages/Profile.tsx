import pageVariants from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        googleLogout();
        navigate("/");
    };
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <h1>Profile</h1>
            <span onClick={handleLogout}>Logout</span>

        </motion.main>
    );
}

export default Profile;