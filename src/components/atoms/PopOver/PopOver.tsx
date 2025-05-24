import { ReactNode, useState } from "react";
import Card from "../../molecules/Card/Card";
import { HiOutlineX } from "react-icons/hi";
import "./PopOver.scss";
import { AnimatePresence, motion } from "motion/react";

const popoverVariants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
};

const PopOver = ({ title, children }: { title: string; children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div className="popover" variants={popoverVariants} initial="initial" animate="in" exit="out" onClick={() => setIsOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Card className="popover__card">
                            <div className="popover__header">
                                <h2 className="popover__title">{title}</h2>
                                <button type="button" onClick={() => setIsOpen(false)}>
                                    <HiOutlineX />
                                </button>
                            </div>
                            <div className="popover__content">{children}</div>
                        </Card>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopOver;
