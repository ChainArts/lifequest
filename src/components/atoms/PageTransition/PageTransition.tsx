const pageTransition = {duration: 0.3, ease: [.14,.8,.4,1]};
const pageVariants = {
    initial: {
        y: "3vh"

    },
    in: {
        opacity: 1,
        y: 0,
        transition: pageTransition
      
    },
    out: {
        y: "3vh",
      transition: pageTransition
    },
}

export default pageVariants;