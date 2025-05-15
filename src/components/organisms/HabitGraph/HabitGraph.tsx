import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./HabitGraph.scss";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHabits } from "../../../lib/HabitsContext";
import { Sheet } from "react-modal-sheet";
import { MdOutlineAutoGraph } from "react-icons/md";

const HabitGraph = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<{ date: string; data: number | null }[]>([]);
    const { fetchHabitLogData } = useHabits();
    const [mode, setMode] = useState(14);
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 100 });

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const btn = container.querySelector("button.active");
        if (btn) {
            setSliderStyle({
                left: btn.offsetLeft,
                width: btn.offsetWidth,
            });
        }
    }, [mode]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const data = await fetchHabitLogData(id, mode);
            if (data) {
                setData(data);
            }
        };
        fetchData();
    }, [mode]);

    const formatTick = (dateString: string) => {
        const dateObj = new Date(dateString);
        return format(dateObj, "dd.MM.");
    };

    const formatDate = (dateString: string) => {
        const dateObj = new Date(dateString);
        return format(dateObj, "dd.MM.yyyy");
    };

    if (data.length <= 1) {
        return (
            <>
                <div className="title-and-button">
                    <Headline level={1} style="section">
                        Tracking Graph
                    </Headline>
                </div>
                <Card className="habit-graph__card center" style={{ height: "240px" }}>
                    <p className="fst--base">Not enough data to visualize your progress.</p>
                    <p className="fst--base">Keep tracking your habit to see the graph.</p>
                    <MdOutlineAutoGraph className="graph-icon" />
                </Card>
            </>
        );
    }

    return (
        <>
            <div className="title-and-button">
                <Headline level={1} style="section">
                    Tracking Graph
                </Headline>
                <button onClick={() => setOpen(true)}>show history</button>
            </div>
            <Card className="habit-graph__card">
                <div ref={containerRef} className="graph-modes">
                    <div className="slider" style={sliderStyle} />

                    <button className={mode === 14 ? "active" : ""} onClick={() => setMode(14)}>
                        2 weeks
                    </button>
                    <button className={mode === 30 ? "active" : ""} onClick={() => setMode(30)}>
                        30 days
                    </button>
                    <button className={mode === 90 ? "active" : ""} onClick={() => setMode(90)}>
                        3 months
                    </button>
                </div>
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

                        <CartesianGrid vertical={false} stroke="var(--progress-bg-round)" />
                        <XAxis dataKey="date" scale="point" tickFormatter={formatTick} tickLine={false} axisLine={{ stroke: "var(--purple-dark)" }} minTickGap={16} tick={{ fill: "var(--text)" }} fontSize={"0.75rem"} />
                        <YAxis axisLine={false} tickSize={0} mirror={true} tick={{ fill: "var(--text)" }} dy={-8} fontSize={"0.75rem"} />

                        <Area type="monotone" dataKey="data" strokeWidth={1} stroke="url(#linearGradient)" fill="url(#areaGradient)" fillOpacity={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={[800, 400, 0]} initialSnap={1}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div className="container">
                                {data.map((d) => (
                                    <div key={d.date} className="habit-settings__item ">
                                        <span className="fst--base">{formatDate(d.date)}</span>
                                        <span className="fst--base">{d.data !== null ? d.data : "---"}</span>
                                    </div>
                                ))}
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => setOpen(false)} />
            </Sheet>
        </>
    );
};

export default HabitGraph;
