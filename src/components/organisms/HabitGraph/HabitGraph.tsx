import Headline from "../../atoms/Headline/Headline";
import "./HabitGraph.scss";

const HabitGraph = () => {
    return (
        <>
            <div className="habit-graph">
                <Headline level={1} style="section">
                    Habit Graph
                </Headline>
                <span>Soon TM</span>
            </div>
        </>
    );
};

export default HabitGraph;
