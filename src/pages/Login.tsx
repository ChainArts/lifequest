import { motion } from "motion/react";
import GoogleButton from "../components/atoms/GoogleButton/GoogleButton";
import pageVariants from "../components/atoms/PageTransition/PageTransition";

const Login = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <GoogleButton />
        </motion.main>
    );
};

export default Login;
