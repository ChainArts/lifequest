import { BsQuestionCircle } from "react-icons/bs";
import "./InfoBlob.scss";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const blobVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 15,
            stiffness: 400,
            mass: 0.8,
            duration: 0.2,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.3,
            ease: [0.14, 0.8, 0.4, 1],
        },
    },
};

const blobArrowVariants = {
    initial: { opacity: 0, y: -10, x: "-50%" },
    animate: {
        opacity: 1,
        y: 0,
        x: "-50%",
        transition: {
            type: "spring",
            damping: 16,
            stiffness: 500,
            delay: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        x: "-50%",
        transition: {
            duration: 0.1,
            ease: [0.14, 0.8, 0.4, 1],
        },
    },
};

const InfoBlob = ({ text }: { text: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="info-blob">
            {/* Optional: Add a title or description here */}
            <div className="info-trigger">
                <AnimatePresence>{isOpen && <motion.div className="tool-arrow" variants={blobArrowVariants} initial="initial" animate="animate" exit="exit" />}</AnimatePresence>
                <button className="info-button" onClick={() => setIsOpen((prev) => !prev)}>
                    <BsQuestionCircle />
                </button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div className="popup" variants={blobVariants} initial="initial" animate="animate" exit="exit">
                            <p className="fst--base">{text}</p>
                        </motion.div>
                        <div className="backdrop" onClick={() => setIsOpen(false)} />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfoBlob;
