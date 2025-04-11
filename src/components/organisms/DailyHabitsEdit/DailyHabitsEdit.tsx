import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import "../HabitForm/HabitForm.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { invoke } from "@tauri-apps/api/core";
import { ActiveHabitProps, calulateStreakXP } from "../../molecules/ActiveHabit/ActiveHabit";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import AddActiveHabit from "./AddActiveHabits";

type HabitFormProps = {
    setOpen: (value: boolean) => void;
    isOpen: boolean;
    habits: ActiveHabitProps[];
    onSubmitSuccess?: () => void;
    fetchHabits: () => void;
};

const DailyHabitsEdit = ({ habits, setOpen, isOpen, onSubmitSuccess, fetchHabits }: HabitFormProps) => {
    const [addActiveHabitOpen, setAddActiveHabitOpen] = useState(false);
    const initialValues = habits.reduce((values, habit) => {
        return { ...values, [habit.id]: habit.done };
    }, {} as { [key: string]: number });

    const schemaFields = habits.reduce((acc, habit) => {
        acc[habit.id] = yup.number().typeError("Must be a number").min(0, "Value cannot be negative").max(habit.goal, `Cannot exceed goal of ${habit.goal}`).required("Progress is required");
        return acc;
    }, {} as { [key: string]: yup.NumberSchema<number, yup.AnyObject> });

    const validationSchema = yup.object().shape(schemaFields);

    const onSubmit = async (values: { [key: string]: number }) => {
        for (const habit of habits) {
            try {
                const updateData: any = { id: habit.id, progress: values[habit.id], exp: 0 };
                updateData.completed = values[habit.id] === habit.goal;

                if (values[habit.id] === habit.goal) {
                    updateData.exp = calulateStreakXP(habit.current_streak);
                    await invoke("increase_habit_xp", {
                        id: habit.id,
                        exp: updateData.exp,
                    });
                }

                await invoke("update_habit_log", updateData);

                console.log(`Habit ${habit.id} was updatec with value ${values[habit.id]}`);
            } catch (error) {
                console.error(`Error updating habit ${habit.id}:`, error);
            }
        }
        if (onSubmitSuccess) {
            onSubmitSuccess();
            fetchHabits();
        }
        setOpen(false);
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize onSubmit={onSubmit}>
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
                                        <fieldset>
                                            <div className="form-box">
                                                {habits.map((habit) => (
                                                    <label htmlFor={habit.id} key={habit.id}>
                                                        <div className="form-upper-heading">
                                                            <span className="fst--upper-heading gray">
                                                                {habit.goal} {habit.unit}
                                                            </span>
                                                            <span className="fst--card-title">{habit.title}</span>
                                                        </div>
                                                        <div className="number-input-box">
                                                            <Field
                                                                id={habit.id}
                                                                name={habit.id}
                                                                type="number"
                                                                inputMode="numeric"
                                                                min={0}
                                                                max={habit.goal}
                                                                // Set value within the range if it is outside the range
                                                                onBlur={(e: { target: { value: any } }) => {
                                                                    const userValue = Number(e.target.value) || 0;
                                                                    const newValue = Math.max(0, Math.min(userValue, habit.goal));
                                                                    setFieldValue(habit.id, newValue);
                                                                }}
                                                            />
                                                            <div className="arrow-buttons">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const currentValue = values[habit.id] ?? 0;
                                                                        if (currentValue < habit.goal) {
                                                                            setFieldValue(habit.id, currentValue + 1);
                                                                        }
                                                                    }}
                                                                >
                                                                    <BiSolidUpArrow />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const currentValue = values[habit.id] ?? 0;
                                                                        if (currentValue > 0) {
                                                                            setFieldValue(habit.id, currentValue - 1);
                                                                        }
                                                                    }}
                                                                >
                                                                    <BiSolidDownArrow />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <ErrorMessage name={habit.id} component="div" className="error invisible" />
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
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
