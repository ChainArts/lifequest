import * as Emojis from "react-fluentui-emoji/lib/modern";
import { AiFillFire } from "react-icons/ai";
import { createElement, Suspense } from "react";
import Card from "../../molecules/Card/Card";
import "./HabitCard.scss";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";

const HabitCard = () => {
    const streak = 5;
    const activeDays = "1001001";
    const title = "Workout";
    const nextlevelXp = 100;
    const currentXp = 50;
    const quantity = 5;
    const quantityType = "reps";

    //convert activeDays to array of boolean
    const activeDaysArray = activeDays.split("").map((day) => (day === "1" ? true : false));
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    return (
        <Card className="habit-card">
            <div className="habit-card__icon">
                <Suspense fallback={null}>{createElement(Emojis["IconMFlexedBicepsDefault"], { size: "2.5rem" })}</Suspense>
            </div>
            <div className="habit-card__content">
                <div className="habit-card__info">
                    <div className="habit-card__stats">
                        <span className="fst--upper-heading gray">{`${quantity} ${quantityType}`}</span>
                        <span className="fst--upper-heading">
                            <AiFillFire /> {streak}
                        </span>
                    </div>

                    <span className="habit-card__title">{title}</span>
                </div>
                <div className="habit-card__progress">
                    <div className="habit-card__week">
                        {days.map((day, index) => (
                            <div key={index} className={`habit-card__day ${activeDaysArray[index] ? "active" : ""}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <LinearProgress goal={nextlevelXp} done={currentXp} />
                </div>
            </div>
        </Card>
    );
};

export default HabitCard;
