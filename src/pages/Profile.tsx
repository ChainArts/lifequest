import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import ProfileSettings from "../components/organisms/ProfileSettings/ProfileSettings";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";

const Profile = () => {
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants} className="container">
                <ProfileSettings />
            </motion.section>
            <motion.section variants={sectionVariants}>
                    <StatsTeaser />
                </motion.section>
        </motion.main>
    );
};

export default Profile;
