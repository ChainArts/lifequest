import "./DailyProgress.scss";
import CircularProgress from "../../atoms/CircularProgress/CircularProgress";

type DailyProgressProps = {
    habits: number;
    progress: number;
    xp: number;
};

const DailyProgress = ({ progress, habits, xp }: DailyProgressProps) => {
    return (
        <div className="daily-progress__container container">
            <div className="daily-progress__stats">
                <p className="daily-progress__number purple">{habits}</p>
                <p className="fst--upper-heading purple">Habits</p>
            </div>
            <CircularProgress progress={progress} />
            <div className="daily-progress__stats">
                <p className="daily-progress__number purple">{xp}</p>
                <p className="fst--upper-heading purple">XP earned</p>
            </div>
        </div>
    );
};

export default DailyProgress;
