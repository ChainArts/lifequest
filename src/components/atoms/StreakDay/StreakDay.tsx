import "./StreakDay.scss";
import { HiCheck } from "react-icons/hi";

type StreakDayProps = {
    day: string;
    isToday: boolean;
    isCompleted: boolean;
};

const StreakDay = ({ day, isToday, isCompleted }: StreakDayProps) => {
    if (isToday) {
        return (
            <div className="streak-day__flag">
                <p className="fst--upper-heading streak-day__name">{day}</p>
                <div
                    className={`streak-day__status ${
                        isCompleted ? "streak-day--completed" : ""
                    } ${isToday ? "streak-day--today" : ""}`}
                >
                    {isCompleted ? (
                        <HiCheck className="streak-day__icon" />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="streak-day__wrapper">
            <p className="fst--upper-heading streak-day__name">{day}</p>
            <div
                className={`streak-day__status ${
                    isCompleted ? "streak-day--completed" : ""
                }`}
            >
                {isCompleted ? <HiCheck className="streak-day__icon" /> : ""}
            </div>
        </div>
    );
};

export default StreakDay;
