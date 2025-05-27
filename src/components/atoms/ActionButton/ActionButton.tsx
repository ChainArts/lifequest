import { useLocation } from "react-router-dom";
import "./ActionButton.scss";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const getActionButtonVariants = (isLargeScreen: boolean) => ({
    initial: isLargeScreen
        ? {
              opacity: 0,
          }
        : {
              x: "200px",
          },
    in: isLargeScreen
        ? {
              opacity: 1,
              transition: {
                  duration: 0.5,
                  ease: [0.14, 0.8, 0.4, 1],
                  delay: 0.3,
              },
          }
        : {
              x: 0,
              transition: {
                  duration: 0.25,
                  ease: [0.14, 0.8, 0.4, 1],
                  delay: 0.3,
              },
          },
    out: isLargeScreen
        ? {
              opacity: 0,
              transition: {
                  duration: 0.25,
                  ease: [0.14, 0.8, 0.4, 1],
              },
          }
        : {
              x: "200px",
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
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth > 800);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <motion.div key={`action-btn-${location.pathname}`} className="action-button" variants={getActionButtonVariants(isLargeScreen)} initial="initial" animate="in" exit="out" onClick={onClick} whileTap={{ scale: 0.9 }}>
            {children}
            <button onClick={onClick}>{icon}</button>
        </motion.div>
    );
};

export default ActionButton;
