import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitGraph.scss";

const HabitGraph = () => {
    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Tracking Graph
                </Headline>
            </div>
            <Card className="habit-graph__card">
                Soon TM
                <div className="habit-graph__card__content">{/* Graph will be implemented here */}</div>
            </Card>
        </>
    );
};

export default HabitGraph;
