import "./Habit.scss";
import { Suspense, createElement } from "react";
import * as Emojis from "react-fluentui-emoji/lib/modern";

interface HabitProps {
    habit: string;
    goal: number;
    current: number;
    emoji?: string;
}

const Habit = ({ habit, goal, current, emoji = "IconMSlightlySmilingFace" }: HabitProps) => {

    return (
        <div className="habit card">
            <div className="habit__icon">
                <Suspense fallback={null}>
                    {createElement(Emojis[emoji as keyof typeof Emojis])}
                </Suspense>
            </div>
            <div className="habit__title">
                <span className="fst--section-heading">{habit}</span>
                <span className="fst--base-bold">
                    {current}/{goal}
                </span>
            </div>
            <div className="habit__progress">
                <div
                    className="habit__progress-bar"
                    style={{ width: `${(current / goal) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default Habit;
