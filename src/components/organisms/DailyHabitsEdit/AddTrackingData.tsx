import { Formik } from "formik";
import { useHabits } from "../../../lib/HabitsContext";
import NumberInput from "./NumberInput";
import "../HabitForm/HabitForm.scss";

type TrackingData = {
    id: string;
    name: string;
    initialValue: number;
};

const AddTrackingData = ({ id, initialValue, name }: TrackingData) => {
    const { updateHabitProgress } = useHabits();

    const onSubmit = async (values: { value: number }) => {
        try {
            await updateHabitProgress(id, undefined, undefined, undefined, values.value);
            console.log(`Habit ${id} updated successfully.`);
        } catch (error) {
            console.error(`Error updating habit ${id}:`, error);
        }
    };
    return (
        <Formik initialValues={{ value: initialValue }} enableReinitialize onSubmit={onSubmit}>
            {({ values, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <div className="small-form-container">
                        <label htmlFor={id} className="tracking__popover">
                            <span className="fst--upper-heading gray">
                                Enter your number that you want to track for <strong>{name}</strong>
                            </span>
                        </label>

                        <NumberInput id={id} value={values.value} setFieldValue={setFieldValue} />

                        <button type="submit" className="form-action-button">
                            Save
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
};
export default AddTrackingData;
