import "./ActionButton.scss";
import { motion } from "motion/react";

const actionButtonVariants = {
    initial: {
        x: "200px"
    },
    in: {
        x: 0,
        transition: {
            duration: 0.25,
            ease: [0.14, 0.8, 0.4, 1],
            delay: 0.5,
        }
    },
    out: {
        x: "200px",
        transition: {
            duration: 0.25,
            ease: [0.14, 0.8, 0.4, 1],
        }
    },
};

type ActionButtonProps = {
    icon: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
};

const ActionButton = ({children, onClick, icon }: ActionButtonProps) => {
    return (
        <motion.div variants={actionButtonVariants} className="action-button">
            { children }
            <button onClick={onClick}>
                {icon}
            </button>
        </motion.div>
    );
};

export default ActionButton;
