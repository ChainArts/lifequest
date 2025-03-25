import "./ActionButton.scss";
import { motion } from "motion/react";

type ActionButtonProps = {
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
};

const ActionButton = ({ children, onClick, icon }: ActionButtonProps) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {children}
            <motion.button layout onClick={onClick} className="action-button">
                {icon}
            </motion.button>
        </motion.div>
    );
};

export default ActionButton;
