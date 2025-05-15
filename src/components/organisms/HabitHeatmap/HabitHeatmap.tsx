import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitHeatmap.scss";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useHabits } from "../../../lib/HabitsContext";

function ServerDay(props: any) {
    const { highlightedDays = [], uncompletedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isCompleted = !outsideCurrentMonth && highlightedDays.includes(day.date());
    const isUncompleted = !outsideCurrentMonth && uncompletedDays.includes(day.date());

    let badge: string | undefined;
    if (isCompleted) badge = "";
    else if (isUncompleted) badge = "❌";

    return (
        <Badge key={day.toString()} overlap="circular" badgeContent={badge}>
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} className={isCompleted ? "completed" : isUncompleted ? "uncompleted" : undefined} />
        </Badge>
    );
}

const HabitHeatmap = ({ id }: { id: string }) => {
    const { getHabitCompleted } = useHabits();
    const [isLoading, setIsLoading] = useState(true);
    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
    const [uncompletedDays, setUncompletedDays] = useState<number[]>([]);
    const [startDay, setStartDay] = useState(() => dayjs().startOf("month").format("YYYY-MM-DD"));
    const [endDay, setEndDay] = useState(() => dayjs().endOf("month").format("YYYY-MM-DD"));

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getHabitCompleted(id, startDay, endDay);
            if (data) {
                setHighlightedDays(data.filter((d) => d.completed).map((d) => dayjs(d.date).date()));
                const todayDate = dayjs().date();
                setUncompletedDays(data.filter((d) => !d.completed && dayjs(d.date).date() !== todayDate).map((d) => dayjs(d.date).date()));
            }
            setIsLoading(false);
        };
        fetchData();
    }, [getHabitCompleted, id, startDay, endDay]);

    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Activity Calendar
                </Headline>
            </div>

            <Card className="habit-calendar__card">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        slots={{ day: ServerDay }}
                        slotProps={{
                            day: (ownerState: any) => ({
                                ...ownerState,
                                highlightedDays,
                                uncompletedDays,
                            }),
                        }}
                        loading={isLoading}
                        disabled
                        renderLoading={() => <DayCalendarSkeleton />}
                        onMonthChange={(month: dayjs.Dayjs) => {
                            setStartDay(month.startOf("month").format("YYYY-MM-DD"));
                            setEndDay(month.endOf("month").format("YYYY-MM-DD"));
                        }}
                    />
                </LocalizationProvider>
            </Card>
        </>
    );
};

export default HabitHeatmap;
