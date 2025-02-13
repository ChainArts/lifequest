import "./DailyProgress.scss";
import CircularProgress from "../../atoms/CircularProgress/CircularProgress";
import { useState } from "react";

const DailyProgress = () => {
    const [progress, setProgress] = useState(0);

    return (
        <div className="daily-progress__container">
            <div className="daily-progress__stats">
                <p className="daily-progress__number purple">3</p>
                <p className="fst--upper-heading purple">Habits</p>
            </div>
            <CircularProgress progress={progress} />
            <div className="daily-progress__stats">
                <p className="daily-progress__number purple">500</p>
                <p className="fst--upper-heading purple">XP earned</p>
            </div>
        </div>
    );
};

export default DailyProgress;
