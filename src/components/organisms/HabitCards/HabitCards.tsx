import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import HabitCard from "../../molecules/HabitCard/HabitCard";
import "./HabitCards.scss";


const HabitCards = () => {
    return (
        <section className="container">
            <IconContext.Provider value={{ className: "habit-cards__icons" }}>
                <Headline level={1} style="section">
                    Habits
                </Headline>
                <div className="habit-cards__list">
                    <HabitCard />
                    <HabitCard />
                </div>
            </IconContext.Provider>
        </section>
    );
};



export default HabitCards;
