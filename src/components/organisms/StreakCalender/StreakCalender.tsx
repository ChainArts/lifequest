import StreakDay from "../../atoms/StreakDay/StreakDay";
import "./StreakCalender.scss";

type StreakCalenderProps = {
    streak: number;
};

const StreakCalender = ({ streak }: StreakCalenderProps) => {
    const today = new Date().getDay(); // 0 = Sunday, …, 6 = Saturday
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // convert JS Sunday=0 → index 6, Monday=1 → 0, … Saturday=6 → 5
    const dayIndex = (today + 6) % 7;
    // only offset when streak > 1
    const offset = streak > 1 ? streak - 1 : 0;
    const startIndex = (dayIndex - offset + 7) % 7;

    const orderedDays = days.slice(startIndex).concat(days.slice(0, startIndex));

    return (
        <div className="container">
            <div className="streak-progress__container">
                {orderedDays.map((day, idx) => {
                    const isTodayCell = idx === offset; // today at position 0 when streak ≤1
                    const completed = idx < streak; // mark all < streak as done
                    return <StreakDay key={idx} day={day} isToday={isTodayCell} isCompleted={completed} />;
                })}
            </div>
        </div>
    );
};

export default StreakCalender;
