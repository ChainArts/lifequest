import { useFormik } from "formik";
import "./Form.scss";
import { HiOutlineX } from "react-icons/hi";
import { Sheet } from "react-modal-sheet";

type HabitFormProps = {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    mode?: "create" | "edit";
};

const HabitForm = ({ setOpen, isOpen, mode }: HabitFormProps) => {
    const formik = useFormik({
        initialValues: {
            habit: "",
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const colors = [
        {
            color: "pink",
            hex: "#F9b0d5",
        },
        {
            color: "rose",
            hex: "#cea3d8",
        },
        {
            color: "purple",
            hex: "#ad9deb",
        },
        {
            color: "violet",
            hex: "#8a9de8",
        },
        {
            color: "blue",
            hex: "#9bc1ff",
        },
        {
            color: "teal",
            hex: "#8ad8d8",
        },

        {
            color: "orange",
            hex: "#eab9ab",
        },
        {
            color: "red",
            hex: "#ef9898",
        },
    ];

    return (
        <form onSubmit={formik.handleSubmit}>
            <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header>
                        <div className="form-header">
                            <button onClick={() => setOpen(false)}>
                                <HiOutlineX />
                            </button>
                            <h2>Create Habit</h2>
                            <button type="submit">Save</button>
                        </div>
                    </Sheet.Header>

                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div className="container form-container">
                                <fieldset>
                                    <label htmlFor="habit">Habit Name</label>
                                    <input className="single-input" id="habit" name="habit" type="text" placeholder="new habit" onChange={formik.handleChange} value={formik.values.habit} />
                                </fieldset>
                                <fieldset>
                                    <legend>Set your Goal</legend>
                                    <div className="form-box">
                                        <label htmlFor="goal">
                                            Amount
                                            <input id="goal" name="goal" type="text" inputMode="numeric" />
                                        </label>

                                        <label htmlFor="unit">
                                            Unit
                                            <input id="unit" name="unit" type="text" placeholder="Repetition" />
                                        </label>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Repeat every ...</legend>
                                    <div className="form-box">
                                        {weekDays.map((day) => (
                                            <label key={day} htmlFor={day}>
                                                {day}
                                                <input id={day} name={day} type="checkbox" />
                                                <span className="toggle" />
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Appearance</legend>
                                    <div className="form-box">
                                        <label htmlFor="icon">
                                            Icon
                                            <input id="icon" name="icon" type="text" placeholder="Icon" />
                                        </label>
                                        <div className="form-box-color">
                                            {colors.map((color) => (
                                                <label key={color.color} htmlFor={color.color}>
                                                    <div className="color-box" style={{ backgroundColor: color.hex }} />

                                                    <input id={color.color} name="color" type="radio" value={color.hex} />
                                                    <div className="color-button" style={{ "--_card-color": color.hex } as React.CSSProperties} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </form>
    );
};

export default HabitForm;
