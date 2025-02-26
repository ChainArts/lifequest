import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import HabitCard from "../../molecules/HabitCard/HabitCard";
import "./HabitCards.scss";
import { useEffect, useState } from "react";
import HabitForm from "../HabitForm/HabitForm";
import { invoke } from "@tauri-apps/api/core";

const HabitCards = () => {
    const [isOpen, setOpen] = useState(false);
    const [habitList, setHabitList] = useState([]);

    useEffect(() => {
        invoke("get_habits").then((res) => {
            setHabitList(res as []);
            console.log(habitList);
        });
    }
    , []);
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
                        <HabitCard />
                        <HabitCard />
                    </div>
                </IconContext.Provider>
            </section>
            <section className="container">
                <HabitForm setOpen={setOpen} isOpen={isOpen} mode="create" />
            </section>
        </>
    );
};

export default HabitCards;
