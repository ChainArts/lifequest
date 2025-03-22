import FluentEmoji from "../../../lib/FluentEmoji";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import Card from "../../molecules/Card/Card";
import "./HabitStats.scss";

const HabitStats = ({ icon, xp, title }: { icon: string; xp: number; title: String }) => {
    return (
        <div className="habit-stats">
            <Card className="habit-stats__icon">
                <FluentEmoji emoji={icon} size={64} className="emoji" />
                <span>{title}</span>
                <LinearProgress done={xp} goal={100} />
            </Card>
            <div className="habit-stats__info-list">
                <Card className="habit-stats__info">
                    <span>XP</span>
                    <span>{xp}</span>
                </Card>
                <Card className="habit-stats__info">
                    <span>Level</span>
                    <span>1</span>
                </Card>
            </div>
        </div>
    );
};

export default HabitStats;
