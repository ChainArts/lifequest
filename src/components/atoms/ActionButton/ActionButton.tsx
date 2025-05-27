import { useLocation } from "react-router-dom";
import "./ActionButton.scss";
import { motion } from "motion/react";

const getActionButtonVariants = () => ({
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.14, 0.8, 0.4, 1],
            delay: 0.3,
        },
    },
    out: {
        opacity: 0,
        transition: {
            duration: 0.25,
            ease: [0.14, 0.8, 0.4, 1],
        },
    },
});

type ActionButtonProps = {
    icon: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
};

const ActionButton = ({ children, onClick, icon }: ActionButtonProps) => {
    const location = useLocation();

    return (
        <motion.div key={`action-btn-${location.pathname}`} className="action-button" variants={getActionButtonVariants()} initial="initial" animate="in" exit="out" onClick={onClick} whileTap={{ scale: 0.9 }}>
            {children}
            <button onClick={onClick}>{icon}</button>
        </motion.div>
    );
};

export default ActionButton;