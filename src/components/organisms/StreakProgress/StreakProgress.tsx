import StreakDay from "../../atoms/StreakDay/StreakDay";
import "./StreakProgress.scss";

type StreakTrackerProps = {
    streak: number;
    isCompleted: boolean;
};

const StreakTracker = ({ streak, isCompleted }: StreakTrackerProps) => {
    const today = new Date().getDay() - 1;
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const startIndex = (today - streak + 1 + 7) % 7;

    const orderedDays = days.slice(startIndex).concat(days.slice(0, startIndex));

    return (
        <div className="container">
            <div className="streak-progress__container">
                {orderedDays.map((day, index) => (
                    <StreakDay key={index} day={day} isToday={index === streak} isCompleted={(isCompleted && index === streak) || index < streak} />
                ))}
            </div>
        </div>
    );
};

export default StreakTracker;
