import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitSettings.scss";

interface HabitSettingsProps {
    setOpen: (value: boolean) => void;
    goal: number;
    unit: string;
    week_days: Array<boolean>;
    tracking: boolean;
    color: string;
}

const HabitSettings = ({ setOpen, goal, unit, week_days, tracking, color }: HabitSettingsProps) => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Settings
                </Headline>
                <button onClick={() => setOpen(true)}>edit</button>
            </div>
            <Card className="habit-settings__card">
                <div className="habit-settings__item">
                    <span className="fst--base">Goal</span>
                    <span className="fst--base">{goal}</span>
                </div>
                <div className="habit-settings__item">
                    <span className="fst--base">Unit</span>
                    <span className="fst--base">{unit}</span>
                </div>
                <div className="habit-settings__item">
                    <span className="fst--base">Tracking</span>
                    <span className="fst--base">{tracking ? "enabled" : "disabled"}</span>
                </div>
                <div className="habit-settings__item">
                    <span className="fst--base">Active Days</span>
                    <span className="fst--base">
                        <div className="habit-card__week" style={{ "--_card-color": color } as React.CSSProperties}>
                            {days.map((day, index) => (
                                <div key={index} className={`habit-card__day ${week_days[index] ? "active" : ""}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                    </span>
                </div>
            </Card>
        </>
    );
};
export default HabitSettings;
