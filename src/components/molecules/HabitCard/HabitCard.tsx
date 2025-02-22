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
    const color = "#9A98EF";
    //calculate lighter shade of color
    const colorLight = color + "FF";

    //convert activeDays to array of boolean
    const activeDaysArray = activeDays.split("").map((day) => (day === "1" ? true : false));
    const days = ["M", "T", "W", "T", "F", "S", "S"];

    return (
        <Card className="habit-card" style={{"--_card-color": color, "--_card-color-light": colorLight} as React.CSSProperties}>
            <div className="habit-card__icon">
                <Suspense fallback={null}>{createElement(Emojis["IconMFlexedBicepsDefault"], { size: "2.5rem" })}</Suspense>
            </div>
            <div className="habit-card__content">
                <div className="habit-card__title">
                    <div className="habit-card__info">
                        <span className="fst--upper-heading">{`${quantity} ${quantityType}`}</span>

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
                    <LinearProgress goal={nextlevelXp} done={currentXp}  />
                </div>
            </div>
        </Card>
    );
};

export default HabitCard;
