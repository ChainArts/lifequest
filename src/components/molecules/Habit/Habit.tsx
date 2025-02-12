import "./Habit.scss";
import { Suspense, createElement } from "react";
import * as Emojis from "react-fluentui-emoji/lib/modern";
import { HiPlus } from "react-icons/hi";

interface HabitProps {
    habit: string;
    goal: number;
    current: number;
    emoji?: string;
}

const Habit = ({
    habit,
    goal,
    current,
    emoji = "IconMSlightlySmilingFace",
}: HabitProps) => {
    return (
        <div className="habit card">
            <div className="habit__icon">
                <Suspense fallback={null}>
                    {createElement(Emojis[emoji as keyof typeof Emojis])}
                </Suspense>
            </div>
            <div className="habit__content">
                <div className="habit__info">
                    <div className="habit__title">
                        <span className="purple">
                            {current}/{goal}
                        </span>
                        <span className="fst--section-heading">{habit}</span>
                    </div>
                    <div className="habit__add">
                        <HiPlus />
                    </div>
                </div>
                <div className="habit__progress">
                    <div className="habit__progress-cover" style={
                        { width: `${100 - (current / goal) * 100}%` }
                    }></div>
                </div>
            </div>
        </div>
    );
};

export default Habit;
