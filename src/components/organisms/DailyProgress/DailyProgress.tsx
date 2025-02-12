import "./DailyProgress.scss";
import CircularProgress from "../../atoms/CircularProgress/CircularProgress";
import { useState } from "react";

const DailyProgress = () => {
    const [progress, setProgress] = useState(0);

    return (
        <div>
            <h2>Daily Progress</h2>
            <CircularProgress progress={progress} />
            <button onClick={() => setProgress(progress - 20)}>
                Decrement
            </button>
            <button onClick={() => setProgress(progress + 20)}>
                Increment
            </button>
        </div>
    );
};

export default DailyProgress;
