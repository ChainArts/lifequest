import "./DailyHabits.scss";
import ActiveHabit, { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import Headline from "../../atoms/Headline/Headline";
import { IconContext } from "react-icons";

type DailyHabitsProps = {
    activeHabits: ActiveHabitProps[];
    setHabitDone: (id: string, add: number) => void;
};

const DailyHabits = ({ activeHabits, setHabitDone }: DailyHabitsProps) => {
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "daily-habits__icons" }}>
                <Headline level={2} style="section">
                    Todays Habits
                </Headline>
                <div className="daily-habits__list">
                    {activeHabits.map((habit, index) => (
                        <ActiveHabit key={index} habit={habit} setHabitDone={setHabitDone} />
                    ))}
                </div>
            </IconContext.Provider>
        </section>
    );
};

export default DailyHabits;
