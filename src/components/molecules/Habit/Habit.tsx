import "./Habit.scss";
import { Suspense, createElement } from "react";
import * as Emojis from "react-fluentui-emoji/lib/modern";
import { HiPlus } from "react-icons/hi";

export interface HabitProps {
    id: number;
    name: string;
    goal: number;
    done: number;
    emoji?: string;
}

const Habit = ({
    id,
    name,
    goal,
    done,
    emoji = "IconMSlightlySmilingFace",
    setHabitDone,
}: HabitProps & {
    setHabitDone: (id: number, add: number) => void;
}) => {
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
                        <span className="fst--upper-heading">
                            {done}/{goal}
                        </span>
                        <span className="fst--card-title">{name}</span>
                    </div>
                    <button
                        className="habit__add"
                        onClick={() => setHabitDone(id, 1)}
                    >
                        <HiPlus />
                    </button>
                </div>
                <div className="habit__progress">
                    <div
                        className="habit__progress-cover"
                        style={{ width: `${100 - (done / goal) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Habit;
