import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./StatsTeaser.scss";
import { useHabits } from "../../../lib/HabitsContext";
import { useUser } from "../../../lib/UserContext";

const StatsTeaser = () => {
    const { habitCount } = useHabits();
    const { user } = useUser();
    return (
        <section className="container">
            <Headline level={2} style="section">
                Stats
            </Headline>
            <div className="stats-teaser__grid">
                <Card className="stats-teaser__streak">
                    <span className="stats-teaser__streak-title">
                        Current Streak
                    </span>
                    <span className="fst--big-number">{user?.current_streak}</span>
                    <span className="uppercase bold">days</span>
                </Card>
                <div className="stats-teaser__list">
                    <Card className="stats-teaser__list-item">
                        <div className="stats-teaser__list-item-title fst--card-title">
                            <span>Longest</span>
                            <span>Streak</span>
                        </div>
                        <div className="stats-teaser__list-item-value">
                            <span className="fst--big-number purple">
                                {user?.highest_streak}
                            </span>
                        </div>
                    </Card>
                    <Card className="stats-teaser__list-item">
                        <div className="stats-teaser__list-item-title fst--card-title">
                            <span>Total</span>
                            <span>Habits</span>
                        </div>
                        <div className="stats-teaser__list-item-value">
                            <span className="fst--big-number blue">
                                {habitCount}
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default StatsTeaser;
