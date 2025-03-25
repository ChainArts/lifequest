import { AiFillFire } from "react-icons/ai";
import Card from "../../molecules/Card/Card";
import "./HabitCard.scss";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import { NavLink } from "react-router-dom";
import FluentEmoji from "../../../lib/FluentEmoji";
import { motion } from "motion/react";
import { sectionVariants as cardVariants } from "../../atoms/PageTransition/PageTransition";

export interface HabitCardProps {
    id: { id: { String: string }; tb: string };
    title: string;
    goal: number;
    unit: string;
    week_days: Array<boolean>;
    icon: string;
    color: string;
    xp: number;
}

const HabitCard = ({ id, title, goal, unit, week_days, icon, color }: HabitCardProps) => {
    const streak = 5;
    const activeDays = week_days.map((day) => (day ? "1" : "0")).join("");
    const nextlevelXp = 100;
    const currentXp = 50;
    //calculate lighter shade of color
    const colorLight = color + "DD";

    //convert activeDays to array of boolean
    const activeDaysArray = activeDays.split("").map((day) => (day === "1" ? true : false));
    const days = ["M", "T", "W", "T", "F", "S", "S"];

    return (
        <motion.div variants={cardVariants}>
            <NavLink to={`/habits/${id.id.String}`} className="habit-card__link">
                <Card
                    className="habit-card"
                    style={
                        {
                            "--_card-color": color,
                            "--_card-color-light": colorLight,
                        } as React.CSSProperties
                    }
                >
                    <div className="habit-card__icon">
                        <FluentEmoji emoji={icon} size={32} className="emoji" />
                    </div>

                    <div className="habit-card__content">
                        <div className="habit-card__title">
                            <div className="habit-card__info">
                                <span className="fst--upper-heading">{`${goal} ${unit}`}</span>

                                <span className="habit-card__title">{title}</span>
                            </div>

                            <span className="fst--upper-heading">
                                <AiFillFire /> {streak}
                            </span>
                        </div>
                        <div className="habit-card__progress">
                            <div className="habit-card__details">
                                <div className="habit-card__week">
                                    {days.map((day, index) => (
                                        <div key={index} className={`habit-card__day ${activeDaysArray[index] ? "active" : ""}`}>
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <span className="fst--upper-heading">LVL</span>
                                    <span className="habit-card__level">12</span>
                                </div>
                            </div>
                            <LinearProgress goal={nextlevelXp} done={currentXp} />
                        </div>
                    </div>
                </Card>
            </NavLink>
        </motion.div>
    );
};

export default HabitCard;
