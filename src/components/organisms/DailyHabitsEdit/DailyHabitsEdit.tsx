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
import { calulateStreakXP } from "../../../lib/XP";
import { useUser } from "../../../lib/UserContext";

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
    const { incrementStreak, updateUser } = useUser();
    const initialValues: HabitValues = habits.reduce((acc, habit) => {
        acc[habit.id] = {
            done: habit.done ?? 0,
            data: habit.data ?? 0,
        };
        return acc;
    }, {} as HabitValues);

    const onSubmit = async (values: HabitValues) => {
        for (const habit of habits) {
            const { done, data } = values[habit.id];
            const initialDone = habit.done ?? 0;
            const initialData = habit.data ?? 0;
            const doneDelta = done - initialDone;
            const dataChanged = habit.tracking && data !== initialData;

            if (doneDelta !== 0 || dataChanged) {
                try {
                    const gotXp = (await updateHabitProgress(habit.id, doneDelta, habit.current_streak, habit.goal, dataChanged ? data : undefined)) as boolean;
                    if (gotXp) {
                        const earned = calulateStreakXP(habit.current_streak);
                        await incrementStreak();
                        await updateUser({ exp: earned }, "add");
                    }
                    console.log(`Habit ${habit.id} updated successfully.`, { doneDelta, dataChanged });
                } catch (error) {
                    console.error(`Error updating habit ${habit.id}:`, error);
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
