import "./ActionButton.scss";
import { motion } from "motion/react";

type ActionButtonProps = {
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
};

const ActionButton = ({ children, onClick, icon }: ActionButtonProps) => {
    return (
        <motion.div layout>
            {children}
            <button onClick={onClick} className="action-button">
                {icon}
            </button>
        </motion.div>
    );
};

export default ActionButton;
