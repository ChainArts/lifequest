import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitHeatmap.scss";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

const HabitHeatmap = () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Tracking Graph
                </Headline>
            </div>
            <Card className="habit-calendar__card">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar loading={isLoading} disabled renderLoading={() => <DayCalendarSkeleton />} />
                </LocalizationProvider>
            </Card>
        </>
    );
};

export default HabitHeatmap;
