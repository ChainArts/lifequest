import { IconContext } from "react-icons";
import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitCards.scss";
import * as Emojis from "react-fluentui-emoji/lib/modern";
import { AiFillFire } from "react-icons/ai";
import { createElement, Suspense } from "react";

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

const HabitCard = () => {
    return (
        <Card className="habit-card">
            <div className="habit-card__content">
                <span className="fst--upper-heading ">
                    <AiFillFire />5
                </span>
                <span className="fst--card-title">Workout</span>
            </div>

            <div className="habit-card__icon">
                <Suspense fallback={null}>{createElement(Emojis["IconMFlexedBicepsDefault"])}</Suspense>
            </div>

            <div className="habit-card__line" />
            <div className="habit-card__week">
                <span>Mo</span>
                <span className="active">Tu</span>
                <span>We</span>
                <span className="habit-card__day">Th</span>
                <span>Fr</span>
                <span className="active">Sa</span>
                <span className="active">Su</span>
            </div>
        </Card>
    );
};

export default HabitCards;
