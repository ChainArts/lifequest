import "./LinearProgress.scss";

interface LinearProgressProps {
    className?: string;
    goal: number;
    done: number;
}

const LinearProgress = ({className, goal, done }: LinearProgressProps) => {
    return (
        <div className={`linear-progress ${className}`}>
                    <div className="linear-progress-cover" style={{ width: `${100 - (done / goal) * 100}%` }}></div>
                </div>
    );
}

export default LinearProgress;