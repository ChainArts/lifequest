import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import HabitCard from "../../molecules/HabitCard/HabitCard";
import "./HabitCards.scss";
import { useEffect, useState } from "react";
import HabitForm from "../HabitForm/HabitForm";
import { invoke } from "@tauri-apps/api/core";
import { HabitCardProps } from "../../molecules/HabitCard/HabitCard";
import { AnimatePresence } from "motion/react";

const HabitCards = () => {
    const [isOpen, setOpen] = useState(false);
    const [habitList, setHabitList] = useState<HabitCardProps[]>([]);

    const fetchHabits = async() => {
        try {
            const habits = await invoke("get_habits");
            setHabitList(habits as HabitCardProps[]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchHabits();
    }, []);
    return (
        <>
            <section className="container">
                <IconContext.Provider value={{ className: "habit-cards__icons" }}>
                    <div className="title-and-button">
                        <Headline level={1} style="section">
                            Habits
                        </Headline>
                        <button onClick={() => setOpen(true)}>create</button>
                    </div>
                    <div className="habit-cards__list">
                        <AnimatePresence mode="sync">
                            {habitList.map((habit) => (
                                <HabitCard key={habit.id.id.String} {...habit} />
                            ))}
                        </AnimatePresence>
                    </div>
                </IconContext.Provider>
            </section>
            <section className="container">
                <HabitForm setOpen={setOpen} isOpen={isOpen} mode="create" onSubmitSuccess={fetchHabits} />
            </section>
        </>
    );
};

export default HabitCards;
