import "./DailyHabits.scss";
import Habit, { HabitProps } from "../../molecules/Habit/Habit";
import Headline from "../../atoms/Headline/Headline";
import { IconContext } from "react-icons";

type DailyHabitsProps = {
    habits: HabitProps[];
    setHabitDone: (id: number, add: number) => void;
};

const DailyHabits = ({ habits, setHabitDone }: DailyHabitsProps) => {
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "daily-habits__icons" }}>
                <Headline level={2} style="section">
                    Daily Habits
                </Headline>
                <div className="daily-habits__list">
                    {habits.map((habit) => (
                        <Habit
                            key={habit.id}
                            id={habit.id}
                            name={habit.name}
                            goal={habit.goal}
                            done={habit.done}
                            emoji={habit.emoji}
                            setHabitDone={setHabitDone}
                        />
                    ))}
                </div>
            </IconContext.Provider>
        </section>
    );
};

export default DailyHabits;
