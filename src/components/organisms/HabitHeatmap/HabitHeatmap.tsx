import Headline from "../../atoms/Headline/Headline";
import "./HabitHeatmap.scss";

const HabitHeatmap = () => {
    return (
        <>
            <div className="habit-heatmap">
                <Headline level={1} style="section">
                    Heatmap
                </Headline>
                <span>Soon TM</span>
            </div>
        </>
    );
};

export default HabitHeatmap;
