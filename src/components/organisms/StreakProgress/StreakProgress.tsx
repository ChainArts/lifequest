import StreakDay from "../../atoms/StreakDay/StreakDay";
import "./StreakProgress.scss";

const StreakTracker = () => {
    return (
        <div className="container">
            <div className="streak-progress__container">
                <StreakDay day="Mo" isToday={false} isCompleted={true} />
                <StreakDay day="Tu" isToday={false} isCompleted={true} />
                <StreakDay day="We" isToday={false} isCompleted={true} />
                <StreakDay day="Th" isToday={true} isCompleted={false} />
                <StreakDay day="Fr" isToday={false} isCompleted={false} />
                <StreakDay day="Sa" isToday={false} isCompleted={false} />
                <StreakDay day="Su" isToday={false} isCompleted={false} />
            </div>
        </div>
    );
};

export default StreakTracker;
