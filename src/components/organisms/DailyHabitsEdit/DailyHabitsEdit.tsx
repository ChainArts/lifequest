import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import "../HabitForm/HabitForm.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { invoke } from "@tauri-apps/api/core";
import { ActiveHabitProps, calulateStreakXP } from "../../molecules/ActiveHabit/ActiveHabit";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { use, useEffect, useState } from "react";

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

    // Dynamically build the validation schema based on each habit's properties.
    const schemaFields = habits.reduce((acc, habit) => {
        acc[habit.id] = yup.number().typeError("Must be a number").min(0, "Value cannot be negative").max(habit.goal, `Cannot exceed goal of ${habit.goal}`).required("Progress is required");
        return acc;
    }, {} as { [key: string]: yup.NumberSchema<number, yup.AnyObject> });

    const validationSchema = yup.object().shape(schemaFields);

    // Handle form submission: update each habit's "done" value via the Tauri backend.
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
                                                            <span className="fst--upper-heading">
                                                                {habit.goal} {habit.unit}
                                                            </span>
                                                            {habit.title}
                                                        </div>
                                                        <Field
                                                            id={habit.id}
                                                            name={habit.id} // should correspond to initialValues key
                                                            type="number"
                                                            inputMode="numeric"
                                                            min={0}
                                                            max={habit.goal}
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
                                                        <ErrorMessage name={habit.id} component="div" className="error invisible" />
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                    <button
                                        className="form-action-button"
                                        onClick={() => {
                                            setAddActiveHabitOpen(true);
                                        }}
                                    >
                                        Add Habit for today
                                    </button>
                                    <AddActiveHabit addActiveHabitOpen={addActiveHabitOpen} setAddActiveHabitOpen={setAddActiveHabitOpen} habits={habits} />
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

type AddActiveHabitProps = {
    addActiveHabitOpen: boolean;
    setAddActiveHabitOpen: (value: boolean) => void;
    habits: ActiveHabitProps[];
};
const AddActiveHabit = ({ habits, addActiveHabitOpen, setAddActiveHabitOpen }: AddActiveHabitProps) => {
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
        } catch (error) {
            console.error("Failed to schedule habit:", error);
        }
    };

    useEffect(() => {
        fetchInactiveHabits();
    }, []);

    return (
        <Sheet isOpen={addActiveHabitOpen} onClose={() => setAddActiveHabitOpen(false)} detent="content-height">
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <Sheet.Scroller>
                        {inactiveHabits.length === 0 ? (
                            <div className="container form-upper-heading ">No additional Habits were found</div>
                        ) : (
                            <div className="container form-container">
                                <fieldset>
                                    <div className="form-box">
                                        {inactiveHabits.map((habit) => (
                                            <label htmlFor={habit.id} key={habit.id}>
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

export default DailyHabitsEdit;
