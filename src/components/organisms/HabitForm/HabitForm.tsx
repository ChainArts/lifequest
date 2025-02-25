import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import "./Form.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import EmojiPicker, { Categories } from "emoji-picker-react";


const habitSchema = yup.object().shape({
    title: yup.string().required("Habit name is required"),
    goal: yup
        .number()
        .positive("Goal must be positive")
        .required("Goal is required")
        .typeError("Goal must be a number"),
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
};

const HabitForm = ({ setOpen, isOpen, mode }: HabitFormProps) => {
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const weekDaysArr = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

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

    return (
        <Formik
            initialValues={{
                title: "",
                goal: 1,
                unit: "",
                weekDays: 0b1111111,
                icon: "🎯",
                color: "#F9b0d5",
            }}
            validationSchema={habitSchema}
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            {({ values, setFieldValue }) => (
                <Form id="habitForm">
                    <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                        <Sheet.Container>
                            <Sheet.Header>
                                <div className="form-header">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
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
                                            <label htmlFor="title">
                                                Habit Name
                                            </label>
                                            <Field
                                                className="single-input"
                                                id="title"
                                                name="title"
                                                type="text"
                                                placeholder="new habit"
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="div"
                                                className="error"
                                            />
                                        </fieldset>

                                        <fieldset>
                                            <legend>Set your Goal</legend>
                                            <div className="form-box">
                                                <label htmlFor="goal">
                                                    Quantity
                                                    <Field
                                                        id="goal"
                                                        name="goal"
                                                        type="text"
                                                        inputMode="numeric"
                                                    />
                                                    <ErrorMessage
                                                        name="goal"
                                                        component="div"
                                                        className="error"
                                                    />
                                                </label>

                                                <label htmlFor="unit">
                                                    Unit
                                                    <Field
                                                        id="unit"
                                                        name="unit"
                                                        type="text"
                                                        placeholder="Repetition"
                                                    />
                                                </label>
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <legend>Repeat every</legend>
                                            <div className="form-box">
                                                {weekDaysArr.map(
                                                    (day, index) => {
                                                        // Calculate the bit corresponding to this day.
                                                        const dayBit =
                                                            1 << (6 - index);
                                                        return (
                                                            <label
                                                                key={day}
                                                                htmlFor={day}
                                                            >
                                                                {day}
                                                                <input
                                                                    id={day}
                                                                    name="weekDays"
                                                                    type="checkbox"
                                                                    checked={Boolean(
                                                                        values.weekDays &
                                                                            dayBit
                                                                    )}
                                                                    onChange={() =>
                                                                        setFieldValue(
                                                                            "weekDays",
                                                                            values.weekDays ^
                                                                                dayBit
                                                                        )
                                                                    }
                                                                />
                                                                <span className="toggle" />
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </fieldset>

                                        <fieldset>
                                            <legend>Appearance</legend>
                                            <div className="form-box">
                                                <label htmlFor="icon">
                                                    Icon
                                                    <Field
                                                        id="icon"
                                                        name="icon"
                                                        type="text"
                                                        placeholder="icon"
                                                        value={
                                                            selectedEmoji ||
                                                            values.icon
                                                        }
                                                    />
                                                </label>
                                                <div className="form-box-color">
                                                    {colorsArr.map((color) => (
                                                        <label
                                                            key={color.color}
                                                            htmlFor={
                                                                color.color
                                                            }
                                                        >
                                                            <div
                                                                className="color-box"
                                                                style={{
                                                                    backgroundColor:
                                                                        color.hex,
                                                                }}
                                                            />
                                                            <Field
                                                                id={color.color}
                                                                name="color"
                                                                type="radio"
                                                                value={
                                                                    color.hex
                                                                }
                                                            />
                                                            <div
                                                                className="color-button"
                                                                style={
                                                                    {
                                                                        "--_card-color":
                                                                            color.hex,
                                                                    } as React.CSSProperties
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                    <ErrorMessage
                                                        name="color"
                                                        component="div"
                                                        className="error"
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <EmojiPicker
                                            autoFocusSearch={false}
                                            lazyLoadEmojis={true}
                                            open={true}
                                            width="100%"
                                            categories={[
                                                {
                                                    name: "Smileys & People",
                                                    category:
                                                        Categories.SMILEYS_PEOPLE,
                                                },
                                                {
                                                    name: "Animals & Nature",
                                                    category:
                                                        Categories.ANIMALS_NATURE,
                                                },
                                                {
                                                    name: "Food & Drink",
                                                    category:
                                                        Categories.FOOD_DRINK,
                                                },
                                                {
                                                    name: "Travel & Places",
                                                    category:
                                                        Categories.TRAVEL_PLACES,
                                                },
                                                {
                                                    name: "Activities",
                                                    category: Categories.ACTIVITIES,
                                                },
                                                {
                                                    name: "Objects",
                                                    category: Categories.OBJECTS,
                                                },
                                                {
                                                    name: "Symbols",
                                                    category: Categories.SYMBOLS,
                                                },
                                                {
                                                    name: "Flags",
                                                    category: Categories.FLAGS,
                                                },
                                            ]}
                                            skinTonesDisabled={true}
                                            onEmojiClick={(object) => {
                                                setSelectedEmoji(object.emoji);
                                            }}
                                            previewConfig={{
                                                defaultCaption:
                                                    "What represents your habit?",
                                            }}
                                        />
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

export default HabitForm;
