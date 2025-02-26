import { motion } from "motion/react";
import GoogleButton from "../components/atoms/GoogleButton/GoogleButton";
import pageVariants from "../components/atoms/PageTransition/PageTransition";
import Headline from "../components/atoms/Headline/Headline";

const Login = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants} className="container--full login">
            <Headline level={1} style="page">LIFEQUEST</Headline>
            <GoogleButton />
        </motion.main>
    );
};

export default Login;
