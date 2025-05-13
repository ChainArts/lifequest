import { Formik, Form, ErrorMessage } from "formik";
import "../HabitForm/HabitForm.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import { useState } from "react";
import Button from "../../atoms/Button/Button";
import AddActiveHabit from "./AddActiveHabits";
import { useHabits } from "../../../lib/HabitsContext";
import NumberInput from "./NumberInput";

type HabitFormProps = {
    setOpen: (value: boolean) => void;
    isOpen: boolean;
    habits: ActiveHabitProps[];
    onSubmitSuccess?: () => void;
    fetchHabits: () => void;
};
interface HabitValues {
    [key: string]: {
        done: number;
        data: number;
    };
}

const DailyHabitsEdit = ({ habits, setOpen, isOpen, onSubmitSuccess, fetchHabits }: HabitFormProps) => {
    const [addActiveHabitOpen, setAddActiveHabitOpen] = useState(false);
    const { updateHabitProgress } = useHabits();
    const initialValues: HabitValues = habits.reduce((acc, habit) => {
        acc[habit.id] = {
            done: habit.done ?? 0,
            data: habit.data ?? 0,
        };
        return acc;
    }, {} as HabitValues);

    const onSubmit = async (values: HabitValues) => {
        for (const habit of habits) {
            const { done } = values[habit.id];
            const delta = done - (habit.done ?? 0);
            if (delta !== 0) {
                try {
                    await updateHabitProgress(habit.id, delta, habit.current_streak, habit.goal);
                    console.log(`Habit ${habit.id} updated by ${delta}`);
                } catch (error) {
                    console.error(`Error updating habit ${habit.id}:`, error);
                }
            } else if (values[habit.id].data !== undefined && delta === 0) {
                const data = values[habit.id].data;
                try {
                    await updateHabitProgress(habit.id, 0, habit.current_streak, habit.goal, data);
                    console.log(`Habit ${habit.id} data updated to ${data}`);
                } catch (error) {
                    console.error(`Error updating habit ${habit.id} data:`, error);
                }
            }
        }

        if (onSubmitSuccess) {
            onSubmitSuccess();
        }
        fetchHabits();
        setOpen(false);
    };

    return (
        <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
            {({ values, setFieldValue, resetForm }) => (
                <Form id="habitForm">
                    <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                        <Sheet.Container>
                            <Sheet.Header>
                                <div className="form-header">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            setOpen(false);
                                        }}
                                    >
                                        <HiOutlineX />
                                    </button>
                                    <h2>Edit today's Habits</h2>
                                    <button type="submit" form="habitForm">
                                        Save
                                    </button>
                                </div>
                            </Sheet.Header>
                            <Sheet.Content>
                                <Sheet.Scroller>
                                    <div className="container form-container">
                                        {habits.length !== 0 &&
                                            habits.map((habit) => (
                                                <fieldset key={habit.id}>
                                                    <div className="form-box">
                                                        <label htmlFor={habit.id}>
                                                            <div className="form-upper-heading">
                                                                <span className="fst--upper-heading gray">
                                                                    {habit.goal} {habit.unit}
                                                                </span>
                                                                <span className="fst--card-title">{habit.title}</span>
                                                            </div>
                                                            <NumberInput id={`${habit.id}.done`} value={values[habit.id]?.done} setFieldValue={setFieldValue} maxValue={habit.goal} />
                                                            <ErrorMessage name={`${habit.id}.done`} component="div" className="error invisible" />
                                                        </label>

                                                        {habit.tracking && (
                                                            <label htmlFor={`${habit.id}_data`} className="tracking__popover">
                                                                <span className="fst--upper-heading gray">Tracking Data</span>
                                                                <NumberInput id={`${habit.id}.data`} value={values[habit.id]?.data} setFieldValue={setFieldValue} />
                                                                <ErrorMessage name={`${habit.id}.data`} component="div" className="error invisible" />
                                                            </label>
                                                        )}
                                                    </div>
                                                </fieldset>
                                            ))}
                                    </div>
                                    <Button
                                        className="form-action-button"
                                        onClick={() => {
                                            setAddActiveHabitOpen(true);
                                        }}
                                    >
                                        Add Habit for today
                                    </Button>
                                    <AddActiveHabit addActiveHabitOpen={addActiveHabitOpen} setAddActiveHabitOpen={setAddActiveHabitOpen} habits={habits} fetchHabits={fetchHabits} />
                                </Sheet.Scroller>
                            </Sheet.Content>
                        </Sheet.Container>
                        <Sheet.Backdrop />
                    </Sheet>
                </Form>
            )}
        </Formik>
    );
};

export default DailyHabitsEdit;
