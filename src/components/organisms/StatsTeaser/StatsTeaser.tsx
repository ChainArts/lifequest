import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./StatsTeaser.scss";

const StatsTeaser = () => {
    const streak = 3;
    const longestStreak = 50;
    const diaryEntries = 2;
    return (
        <section className="container">
            <Headline level={2} style="section">
                Stats
            </Headline>
            <div className="stats-teaser__grid">
                <Card className="stats-teaser__streak">
                    <span className="stats-teaser__streak-title">Current Streak</span>
                    <span className="stats-teaser__streak-number">
                        {streak}
                    </span>
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
                                {longestStreak}
                            </span>
                        </div>
                    </Card>
                    <Card className="stats-teaser__list-item">
                        <div className="stats-teaser__list-item-title fst--card-title">
                            <span>Diary</span>
                            <span>Entries</span>
                        </div>
                        <div className="stats-teaser__list-item-value">
                            <span className="fst--big-number blue">
                                {diaryEntries}
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default StatsTeaser;
