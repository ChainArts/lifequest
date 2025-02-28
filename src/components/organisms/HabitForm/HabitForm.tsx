import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as yup from "yup";
import "./HabitForm.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import EmojiPicker, { Categories } from "emoji-picker-react";
import { invoke } from "@tauri-apps/api/core";
import { BiSolidUpArrow, BiSolidDownArrow, BiSolidRightArrow } from "react-icons/bi";

const habitSchema = yup.object().shape({
    title: yup.string().required("name is required"),
    goal: yup.number().positive("Goal must be positive").required("Goal is required").typeError("Goal must be a number"),
    color: yup.string().required("Color is required"),
    // Optional fields:
    unit: yup.string(),
    weekDays: yup.number(),
    icon: yup.string(),
});

type HabitFormProps = {
    setOpen: (value: boolean) => void;
    isOpen: boolean;
    mode: string;
    id?: string;
    onSubmitSuccess?: () => void;
    initialValues?: {
        title: string;
        goal: number;
        unit: string;
        week_days: Array<boolean>;
        icon: string;
        color: string;
    };
};

const HabitForm = ({ id, setOpen, isOpen, mode, onSubmitSuccess, initialValues }: HabitFormProps) => {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const weekDaysArr = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const colorsArr = [
        { color: "pink", hex: "#F9b0d5" },
        { color: "rose", hex: "#cea3d8" },
        { color: "purple", hex: "#ad9deb" },
        { color: "violet", hex: "#8a9de8" },
        { color: "blue", hex: "#9bc1ff" },
        { color: "teal", hex: "#8ad8d8" },
        { color: "orange", hex: "#eab9ab" },
        { color: "red", hex: "#ef9898" },
    ];

    const defaultValues = {
        title: "",
        goal: 1,
        unit: "",
        week_days: [true, true, true, true, true, true, true],
        icon: "🎯",
        color: "#F9b0d5",
    };

    return (
        <Formik
            initialValues={initialValues || defaultValues}
            validationSchema={habitSchema}
            onSubmit={(values, { resetForm }) => {
                if (mode === "edit") {
                    invoke("update_habit", { values: values, id: id }).then(() => {
                        setOpen(false);
                        onSubmitSuccess && onSubmitSuccess();
                    });
                } else {
                    invoke("insert_habit", { values: values }).then(() => {
                        resetForm({ values: defaultValues });
                        setOpen(false);
                        onSubmitSuccess && onSubmitSuccess();
                    });
                }
            }}
        >
            {({ values, setFieldValue, resetForm }) => (
                <Form id="habitForm">
                    <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                        <Sheet.Container>
                            <Sheet.Header>
                                <div className="form-header">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (mode !== "edit") {
                                                resetForm({ values: defaultValues });
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        <HiOutlineX />
                                    </button>
                                    <h2>{mode} Habit</h2>
                                    <button type="submit" form="habitForm">
                                        Save
                                    </button>
                                </div>
                            </Sheet.Header>

                            <Sheet.Content>
                                <Sheet.Scroller>
                                    <div className="container form-container">
                                        <fieldset>
                                            <label htmlFor="title">Name Your Habit</label>
                                            <Field className="single-input" id="title" name="title" type="text" placeholder="new habit" />
                                            <ErrorMessage name="title" component="div" className="error" />
                                        </fieldset>

                                        <fieldset>
                                            <legend>Define your Goal</legend>
                                            <div className="form-box">
                                                <label htmlFor="goal">
                                                    Quantity
                                                    <Field id="goal" name="goal" type="number" inputMode="numeric" />
                                                    <div className="arrow-buttons">
                                                        <button type="button" onClick={() => setFieldValue("goal", Math.max(Number(values.goal) + 1, 1))}>
                                                            <BiSolidUpArrow />
                                                        </button>
                                                        <button type="button" onClick={() => setFieldValue("goal", Math.max(Number(values.goal) - 1, 1))}>
                                                            <BiSolidDownArrow />
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="goal" component="div" className="error" />
                                                </label>

                                                <label htmlFor="unit">
                                                    Unit
                                                    <Field id="unit" name="unit" type="text" placeholder="steps" />
                                                </label>
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <legend>Personalize your Habit</legend>
                                            <div className="form-box">
                                                <label htmlFor="icon" onClick={() => setEmojiPickerOpen(true)}>
                                                    Icon
                                                    <div>
                                                        <Field id="icon" name="icon" type="hidden" placeholder="icon" value={values.icon} />
                                                        <button className="input">
                                                            {values.icon}
                                                            <BiSolidRightArrow className="arrow" />
                                                        </button>
                                                    </div>
                                                </label>

                                                <div className="form-box-color">
                                                    {colorsArr.map((color) => (
                                                        <label key={color.color} htmlFor={color.color}>
                                                            <div
                                                                className="color-box"
                                                                style={{
                                                                    backgroundColor: color.hex,
                                                                }}
                                                            />
                                                            <Field id={color.color} name="color" type="radio" value={color.hex} />
                                                            <div
                                                                className="color-button"
                                                                style={
                                                                    {
                                                                        "--_card-color": color.hex,
                                                                    } as React.CSSProperties
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                    <ErrorMessage name="color" component="div" className="error" />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <legend>Track your progress</legend>
                                            <div className="form-box">
                                                <label htmlFor="tracking">
                                                    Enable
                                                    <input id="tracking" name="tracking" type="checkbox" />
                                                    <span className="toggle" />
                                                </label>
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <legend>Choose Your Routine</legend>
                                            <div className="form-box-weekdays">
                                                {weekDaysArr.map((day, index) => {
                                                    return (
                                                        <label key={day} htmlFor={day}>
                                                            {day.slice(0, 2)}
                                                            <input id={day} name="week_days" type="checkbox" checked={values.week_days[index]} onChange={() => setFieldValue(`week_days[${index}]`, !values.week_days[index])} />
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        <EmojiPickerComponent setEmojiPickerOpen={setEmojiPickerOpen} emojiPickerOpen={emojiPickerOpen} />
                                    </div>
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

type EmojiPickerProps = {
    emojiPickerOpen: boolean;
    setEmojiPickerOpen: (value: boolean) => void;
};

const EmojiPickerComponent = ({ emojiPickerOpen, setEmojiPickerOpen }: EmojiPickerProps) => {
    const { setFieldValue } = useFormikContext();

    return (
        <Sheet isOpen={emojiPickerOpen} onClose={() => setEmojiPickerOpen(false)} detent="content-height">
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <EmojiPicker
                        autoFocusSearch={false}
                        lazyLoadEmojis={true}
                        open={emojiPickerOpen}
                        width="100%"
                        searchDisabled={true}
                        height={"50svh"}
                        categories={[
                            {
                                name: "Smileys & People",
                                category: Categories.SMILEYS_PEOPLE,
                            },
                            {
                                name: "Animals & Nature",
                                category: Categories.ANIMALS_NATURE,
                            },
                            {
                                name: "Food & Drink",
                                category: Categories.FOOD_DRINK,
                            },
                            {
                                name: "Travel & Places",
                                category: Categories.TRAVEL_PLACES,
                            },
                            {
                                name: "Activities",
                                category: Categories.ACTIVITIES,
                            },
                            {
                                name: "Objects",
                                category: Categories.OBJECTS,
                            },
                        ]}
                        skinTonesDisabled={true}
                        onEmojiClick={(object) => {
                            // Update Formik's icon field directly
                            setFieldValue("icon", object.emoji);
                            setEmojiPickerOpen(false);
                        }}
                        previewConfig={{
                            defaultCaption: "What represents your habit?",
                            defaultEmoji: "1f3af",
                        }}
                    />
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setEmojiPickerOpen(false)} />
        </Sheet>
    );
};

export default HabitForm;
