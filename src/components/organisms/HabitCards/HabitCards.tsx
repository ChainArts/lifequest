import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import HabitCard from "../../molecules/HabitCard/HabitCard";
import "./HabitCards.scss";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";

const HabitCards = () => {
    const [isOpen, setOpen] = useState(false);
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
                <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <Sheet.Scroller>hi</Sheet.Scroller>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
            </section>
        </>
    );
};

export default HabitCards;
