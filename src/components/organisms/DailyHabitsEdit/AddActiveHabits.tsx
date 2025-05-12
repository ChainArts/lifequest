import { invoke } from "@tauri-apps/api/core";
import { Field } from "formik";
import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import Card from "../../molecules/Card/Card";
import { useNavigate } from "react-router-dom";

type AddActiveHabitProps = {
    addActiveHabitOpen: boolean;
    setAddActiveHabitOpen: (value: boolean) => void;
    habits: ActiveHabitProps[];
    fetchHabits: () => void;
};
const AddActiveHabit = ({ habits, addActiveHabitOpen, setAddActiveHabitOpen, fetchHabits }: AddActiveHabitProps) => {
    const navigate = useNavigate();
    const [inactiveHabits, setInactiveHabits] = useState<ActiveHabitProps[]>([]);
    const fetchInactiveHabits = async () => {
        try {
            const allHabits = (await invoke("get_habits", {})) as any[];
            const transformedHabits = allHabits.map((habit: any) => ({
                ...habit,
                id: habit.id.id.String,
            }));
            const inactiveHabits = transformedHabits.filter((habit) => !habits.some((h) => h.id === habit.id));
            setInactiveHabits(inactiveHabits);
        } catch (error) {
            console.error("Failed to fetch inactive habits:", error);
            return [];
        }
    };

    const scheduleHabit = async (id: string) => {
        try {
            await invoke("schedule_habit_for_today", { id });
            setAddActiveHabitOpen(false);
            fetchHabits();
        } catch (error) {
            console.error("Failed to schedule habit:", error);
        }
    };

    useEffect(() => {
        fetchInactiveHabits();
    }, []);

    return (
        <Sheet isOpen={addActiveHabitOpen} onClose={() => setAddActiveHabitOpen(false)} snapPoints={[400, 0]} initialSnap={0}>
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <Sheet.Scroller>
                        {inactiveHabits.length === 0 ? (
                            <div className="container form-upper-heading">
                                <Card className="secondary no-habits" onClick={() => navigate("/habits", { state: { create: true } })}>
                                    <p className="fst--card-title">Create a new habit!</p>
                                    <p className="fst--base">No additional habits where found</p>
                                </Card>
                            </div>
                        ) : (
                            <div className="container form-container">
                                <fieldset>
                                    <div className="form-box">
                                        {inactiveHabits.map((habit) => (
                                            <label htmlFor={habit.id} key={habit.id} className="pointer">
                                                <div className="form-upper-heading">{habit.title}</div>
                                                <Field id={habit.id} name={habit.id} type="checkbox" onClick={() => scheduleHabit(habit.id)} />
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        )}
                    </Sheet.Scroller>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setAddActiveHabitOpen(false)} />
        </Sheet>
    );
};

export default AddActiveHabit;
