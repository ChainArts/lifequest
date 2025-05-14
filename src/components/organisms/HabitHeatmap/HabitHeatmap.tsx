import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitHeatmap.scss";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

function getRandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date: dayjs.Dayjs, { signal }: { signal: AbortSignal }): Promise<{ daysToHighlight: number[] }> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const daysInMonth = date.daysInMonth();
            const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

            resolve({ daysToHighlight });
        }, 500);

        signal.onabort = () => {
            clearTimeout(timeout);
            reject(new DOMException("aborted", "AbortError"));
        };
    });
}

function ServerDay(props: any) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    return (
        <Badge key={props.day.toString()} overlap="circular" badgeContent={isSelected ? "🌚" : undefined}>
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

const HabitHeatmap = () => {
    const requestAbortController = useRef<AbortController | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);

    interface FetchHighlightedDaysResult {
        daysToHighlight: number[];
    }

    type FetchHighlightedDays = (date: dayjs.Dayjs) => void;

    const fetchHighlightedDays: FetchHighlightedDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, {
            signal: controller.signal,
        })
            .then(({ daysToHighlight }: FetchHighlightedDaysResult) => {
                setHighlightedDays(daysToHighlight);
                setIsLoading(false);
            })
            .catch((error: any) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== "AbortError") {
                    throw error;
                }
            });

        requestAbortController.current = controller;
    };
    useEffect(() => {
        fetchHighlightedDays(dayjs());
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date: dayjs.Dayjs) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
        }

        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

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
                        onMonthChange={handleMonthChange}
                        slots={{
                            day: ServerDay,
                        }}
                        slotProps={{
                            day: (ownerState: any) => ({
                                ...ownerState,
                                highlightedDays,
                            }),
                        }}
                        loading={isLoading}
                        disabled
                        renderLoading={() => <DayCalendarSkeleton />}
                    />
                </LocalizationProvider>
            </Card>
        </>
    );
};

export default HabitHeatmap;
