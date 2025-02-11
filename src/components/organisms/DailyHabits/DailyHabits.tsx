import "./DailyHabits.scss";
import Habit from "../../molecules/Habit/Habit";
import Headline from "../../atoms/Headline/Headline";

const DailyHabits = () => {
    return (
        <section className="container">
            <Headline level={2} style="section">
                Daily Habits
            </Headline>
            <div className="daily-habits__list">
                <Habit habit="Drink water" goal={8} current={5} />
                <Habit habit="Read 20 pages" goal={20} current={10} />
                <Habit habit="Sex" goal={10} current={0} emoji="IconMBitingLip"/>
            </div>
        </section>
    );
};

export default DailyHabits;
