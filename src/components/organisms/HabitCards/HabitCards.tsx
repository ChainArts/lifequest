import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import HabitCard from "../../molecules/HabitCard/HabitCard";
import "./HabitCards.scss";
import { HabitCardProps } from "../../molecules/HabitCard/HabitCard";
import Card from "../../molecules/Card/Card";
import { AnimatePresence } from "motion/react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
type HabitCardsProps = {
    setOpen: (open: boolean) => void;
    habitList: HabitCardProps[];
};

const HabitCards = ({ setOpen, habitList }: HabitCardsProps) => {
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "habit-cards__icons" }}>
                <div className="title-and-button">
                    <Headline level={1} style="section">
                        Habits
                    </Headline>
                    <button onClick={() => setOpen(true)}>create</button>
                </div>
                {habitList.length === 0 ? (
                    <Card className="secondary no-habits" onClick={() => setOpen(true)}>
                        <p className="fst--card-title">No habits yet</p>
                        <p className="fst--base">
                            Tap <strong>+</strong> or <strong>create</strong> to add your first habit!
                        </p>
                        <HiOutlineArrowNarrowRight />
                    </Card>
                ) : (
                    <div className="habit-cards__list">
                        <AnimatePresence>
                            {habitList.map((habit) => (
                                <HabitCard key={habit.id.id.String} {...habit} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </IconContext.Provider>
        </section>
    );
};

export default HabitCards;
