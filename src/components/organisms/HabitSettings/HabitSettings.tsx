import Headline from "../../atoms/Headline/Headline";

interface HabitSettingsProps {
    setOpen: (value: boolean) => void;
}

const HabitSettings = ({ setOpen }: HabitSettingsProps) => {
    return (
        <div className="habit-settings">
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Settings
                </Headline>
                <button onClick={() => setOpen(true)}>edit</button>
            </div>
        </div>
    );
};
export default HabitSettings;
