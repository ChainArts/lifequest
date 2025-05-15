import FluentEmoji from "../../../lib/FluentEmoji";
import { calculateLevel } from "../../../lib/XP";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import Card from "../../molecules/Card/Card";
import { HabitCardProps } from "../../molecules/HabitCard/HabitCard";
import "./HabitStats.scss";

const HabitStats = ({ icon, habit_xp, title, color, current_streak, highest_streak }: HabitCardProps) => {
    const colorLight = color + "AA";
    const levelData = calculateLevel(habit_xp);
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
                <span className="uppercase bold">{title}</span>
                <LinearProgress className="icon-progress" done={levelData.done} goal={levelData.goal} />
            </Card>
            <div className="stats-teaser__list">
                <Card className="stats-teaser__list-item">
                    <div className="stats-teaser__list-item-title fst--card-title">
                        <span>Current</span>
                        <span>Streak</span>
                    </div>
                    <div className="stats-teaser__list-item-value">
                        <span className="fst--big-number purple">{current_streak}</span>
                    </div>
                </Card>
                <Card className="stats-teaser__list-item">
                    <div className="stats-teaser__list-item-title fst--card-title">
                        <span>Current</span>
                        <span>Level</span>
                    </div>
                    <div className="stats-teaser__list-item-value">
                        <span className="fst--big-number blue">{levelData.level}</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HabitStats;
