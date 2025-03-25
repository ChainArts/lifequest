const pageTransition = { duration: 0.5, ease: [0.14, 0.8, 0.4, 1], staggerChildren: 0.05 };
const sectionTransition = { ease: [0.14, 0.8, 0.4, 1], staggerChildren: 0.1 };
export const pageVariants = {
    initial: {
        y: "-3vh",
    },
    in: {
        y: 0,
        transition: pageTransition,
    },
    out: {
        y: "-3vh",
        transition: pageTransition,
    },
};

export const sectionVariants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
        transition: sectionTransition,
    },
    out: {
        opacity: 0,
        transition: sectionTransition,
    },
};
