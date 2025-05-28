import "./DailyHabits.scss";
import ActiveHabit, { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import Headline from "../../atoms/Headline/Headline";
import { IconContext } from "react-icons";
import Card from "../../molecules/Card/Card";
import { useState } from "react";
import DailyHabitsEdit from "../DailyHabitsEdit/DailyHabitsEdit";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight, HiPlus } from "react-icons/hi";

type DailyHabitsProps = {
    activeHabits: ActiveHabitProps[];
    updateXP: () => void;
    fetchHabits: () => void;
};

const DailyHabits = ({ activeHabits, updateXP, fetchHabits }: DailyHabitsProps) => {
    const [openEdit, setOpenEdit] = useState(false);
    const navigate = useNavigate();

    // console.log("activeHabits tracking", activeHabits[0].tracking);
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
                    <Card className="secondary no-habits" onClick={() => navigate("/habits", { state: { create: true } })}>
                        <p className="fst--card-title">No habits for today</p>
                        <p className="fst--base">Create a new habit or plan one for today!</p>
                        <HiOutlineArrowNarrowRight />
                    </Card>
                ) : (
                    <div className="daily-habits__list">
                        {activeHabits.map((habit, index) => (
                            <ActiveHabit key={index} habit={habit} updateXP={updateXP} />
                        ))}
                        <div className="daily-habits__add-new" onClick={() => navigate("/habits", { state: { create: true } })}>
                            <HiPlus />
                        </div>
                    </div>
                )}
            </IconContext.Provider>
            <DailyHabitsEdit setOpen={setOpenEdit} isOpen={openEdit} habits={activeHabits} onSubmitSuccess={() => setOpenEdit(false)} fetchHabits={fetchHabits} />
        </section>
    );
};

export default DailyHabits;
