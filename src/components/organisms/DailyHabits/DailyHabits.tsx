import "./DailyHabits.scss";
import ActiveHabit, { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import Headline from "../../atoms/Headline/Headline";
import { IconContext } from "react-icons";
import Card from "../../molecules/Card/Card";

type DailyHabitsProps = {
    activeHabits: ActiveHabitProps[];
    setHabitProgress: (id: string, add: number) => void;
    updateXP: () => void;
};

const DailyHabits = ({ activeHabits, setHabitProgress, updateXP }: DailyHabitsProps) => {
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "daily-habits__icons" }}>
                <div className="title-and-button">
                    <Headline level={2} style="section">
                        Todays Habits
                    </Headline>
                </div>
                {activeHabits.length === 0 ? (
                    <Card className="secondary no-habits" route="/habits">
                        <p className="fst--card-title">No habits for today</p>
                        <p className="fst--base">Create a new habit or plan one for today!</p>
                    </Card>
                ) : (
                    <div className="daily-habits__list">
                        {activeHabits.map((habit, index) => (
                            <ActiveHabit key={index} habit={habit} setHabitProgress={setHabitProgress} updateXP={updateXP} />
                        ))}
                    </div>
                )}
            </IconContext.Provider>
        </section>
    );
};

export default DailyHabits;
