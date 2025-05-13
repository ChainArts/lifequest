import FluentEmoji from "../../../lib/FluentEmoji";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import Card from "../../molecules/Card/Card";
import "./HabitStats.scss";

const HabitStats = ({ icon, xp, title, color }: { icon: string; xp: number; title: string; color: string }) => {
    const colorLight = color + "DD";
    return (
        <div className="habit-stats">
            <Card
                className="habit-stats__icon"
                style={
                    {
                        "--_card-color": color,
                        "--_card-color-light": colorLight,
                    } as React.CSSProperties
                }
            >
                <FluentEmoji emoji={icon} size={64} className="emoji" />
                <span>{title}</span>
                <LinearProgress done={xp} goal={100} />
            </Card>
            <div className="stats-teaser__list">
                <Card className="stats-teaser__list-item">
                    <div className="stats-teaser__list-item-title fst--card-title">
                        <span>Longest</span>
                        <span>Streak</span>
                    </div>
                    <div className="stats-teaser__list-item-value">
                        <span className="fst--big-number purple">1</span>
                    </div>
                </Card>
                <Card className="stats-teaser__list-item">
                    <div className="stats-teaser__list-item-title fst--card-title">
                        <span>Current</span>
                        <span>Level</span>
                    </div>
                    <div className="stats-teaser__list-item-value">
                        <span className="fst--big-number blue">1</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HabitStats;
