import { motion } from "motion/react";
import { useEffect } from "react";

const islandPageVariants = {
    initial: { y: "-3vh" },
    animate: { y: "100vh" },
    exit: { y: "-3vh" },
};

const Island = () => {
    useEffect(() => {
        // Disable scroll when this component mounts
        document.body.style.overflow = 'hidden';
        return () => {
            // Restore scroll on unmount
            document.body.style.overflow = 'auto';
        };
    }, []);
    return <motion.main initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5, ease: [0.14, 0.8, 0.4, 1] }} variants={islandPageVariants}></motion.main>;
};

export default Island;
