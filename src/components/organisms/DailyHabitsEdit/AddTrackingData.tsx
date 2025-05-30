import { Formik } from "formik";
import { useHabits } from "../../../lib/HabitsContext";
import NumberInput from "./NumberInput";
import "../HabitForm/HabitForm.scss";
import { usePopOver } from "../../../lib/PopOverContext";

type TrackingData = {
    id: string;
    name: string;
    initialValue: number | undefined;
};

const AddTrackingData = ({ id, initialValue, name }: TrackingData) => {
    const { updateHabitProgress, refreshToday } = useHabits();
    const { closePopOver } = usePopOver();
    const onSubmit = async (values: { data: number | undefined }) => {
        try {
            await updateHabitProgress(id, undefined, undefined, undefined, values.data);
            console.log(`Habit ${id} updated successfully.`);
        } catch (error) {
            console.error(`Error updating habit ${id}:`, error);
        }
        refreshToday();
        closePopOver();
    };
    return (
        <Formik initialValues={{ data: initialValue }} enableReinitialize onSubmit={onSubmit}>
            {({ values, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <div className="small-form-container">
                        <label htmlFor={`${id}_data`} className="tracking__popover">
                            <span className="fst--upper-heading gray">
                                Enter a number to track today’s progress for <strong>{name}</strong>:
                            </span>
                        </label>

                        <NumberInput id={"data"} value={values.data ?? 0} setFieldValue={setFieldValue} />

                        <div className="button-container ">
                            <button type="submit" className="button">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
export default AddTrackingData;
