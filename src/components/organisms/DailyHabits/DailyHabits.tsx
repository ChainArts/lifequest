import "./DailyHabits.scss";
import ActiveHabit, { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import Headline from "../../atoms/Headline/Headline";
import { IconContext } from "react-icons";
import Card from "../../molecules/Card/Card";
import { useState } from "react";
import DailyHabitsEdit from "../DailyHabitsEdit/DailyHabitsEdit";

type DailyHabitsProps = {
    activeHabits: ActiveHabitProps[];
    updateXP: () => void;
    fetchHabits: () => void;
};

const DailyHabits = ({ activeHabits, updateXP, fetchHabits }: DailyHabitsProps) => {
    const [openEdit, setOpenEdit] = useState(false);
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "daily-habits__icons" }}>
                <div className="title-and-button">
                    <Headline level={2} style="section">
                        Todays Habits
                    </Headline>
                    <button
                        onClick={() => {
                            setOpenEdit(true);
                        }}
                    >
                        edit
                    </button>
                </div>
                {activeHabits.length === 0 ? (
                    <Card className="secondary no-habits" route="/habits">
                        <p className="fst--card-title">No habits for today</p>
                        <p className="fst--base">Create a new habit or plan one for today!</p>
                    </Card>
                ) : (
                    <div className="daily-habits__list">
                        {activeHabits.map((habit, index) => (
                            <ActiveHabit key={index} habit={habit} updateXP={updateXP} />
                        ))}
                    </div>
                )}
            </IconContext.Provider>
            <DailyHabitsEdit setOpen={setOpenEdit} isOpen={openEdit} habits={activeHabits} onSubmitSuccess={() => setOpenEdit(false)} fetchHabits={fetchHabits} />
        </section>
    );
};

export default DailyHabits;
