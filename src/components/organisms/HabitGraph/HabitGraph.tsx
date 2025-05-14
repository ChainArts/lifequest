import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitGraph.scss";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useHabits } from "../../../lib/HabitsContext";

const HabitGraph = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<{ date: string; data: number | null }[]>([]);
    const { fetchHabitLogData } = useHabits();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const data = await fetchHabitLogData(id, 30);
            if (data) {
                setData(data);
            }
        };
        fetchData();
    }, []);

    const formatTick = (dateString: string) => {
        const dateObj = new Date(dateString);
        return format(dateObj, "dd.MM.");
    };

    const modes = {
        "0": "week",
        "1": "month",
        "2": "6 months",
    };

    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Settings
                </Headline>
                <button onClick={() => setOpen(true)}>show histroy</button>
            </div>
            <Card className="habit-graph__card">
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{ top: 20, right: 4, left: 4, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9a98ef" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#9bc1ff" stopOpacity={0.25} />
                            </linearGradient>

                            <linearGradient id="linearGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9a98ef" stopOpacity={1} />
                                <stop offset="100%" stopColor="#9bc1ff" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid opacity={0.5} vertical={false} strokeOpacity={0.5} stroke="var(--blue-light)" />
                        <XAxis dataKey="date" scale="point" tickFormatter={formatTick} tickLine={false} axisLine={false} minTickGap={4} tick={{ fill: "var(--purple-light)" }} fontSize={"0.825rem"} />
                        <YAxis axisLine={false} tickSize={0} mirror={true} tick={{ fill: "var(--purple-light)" }} dy={-10} fontSize={"0.825rem"} />

                        <Area type="monotone" dataKey="data" strokeWidth={2} stroke="url(#linearGradient)" fill="url(#areaGradient)" fillOpacity={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </>
    );
};

export default HabitGraph;
