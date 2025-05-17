import { useHabits } from "../../../lib/HabitsContext";
import { useUser } from "../../../lib/UserContext";
import StreakDay from "../../atoms/StreakDay/StreakDay";
import "./StreakCalender.scss";

type StreakCalenderProps = {
    streak: number;
    todayCompleted: boolean;
};

const StreakCalender = ({ streak, todayCompleted }: StreakCalenderProps) => {
    const today = new Date().getDay(); // 0 = Sunday, …, 6 = Saturday
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    console.log("todayCompleted", todayCompleted);
    console.log("streak", streak);

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
                    const isTodayCell = idx === offset;
                    const completed = idx < streak - 1;
                    return <StreakDay key={idx} day={day} isToday={isTodayCell} isCompleted={(isTodayCell && todayCompleted) || completed} />;
                })}
            </div>
        </div>
    );
};

export default StreakCalender;
