import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import "../HabitForm/HabitForm.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { invoke } from "@tauri-apps/api/core";
import { ActiveHabitProps } from "../../molecules/ActiveHabit/ActiveHabit";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";

type HabitFormProps = {
    setOpen: (value: boolean) => void;
    isOpen: boolean;
    habits: ActiveHabitProps[];
    onSubmitSuccess?: () => void;
};

const DailyHabitsEdit = ({ habits, setOpen, isOpen, onSubmitSuccess }: HabitFormProps) => {
    // Build initial values dynamically: each habit's id maps to its "done" value.
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
                await invoke("update_habit_log", { id: habit.id, progress: values[habit.id] });

                console.log(`Habit ${habit.id} was updatec with value ${values[habit.id]}`);
            } catch (error) {
                console.error(`Error updating habit ${habit.id}:`, error);
            }
        }
        if (onSubmitSuccess) {
            onSubmitSuccess();
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
                                    <button className="form-action-button">Add Habit for today</button>
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
