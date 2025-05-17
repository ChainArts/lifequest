import { Field } from "formik";
import { HiMinus, HiPlus } from "react-icons/hi";

interface NumberInputProps {
    value: number;
    setFieldValue: (field: string, value: any) => void;
    maxValue?: number;
    id: string;
}

const NumberInput = ({ id, setFieldValue, value, maxValue }: NumberInputProps) => {
    return (
        <div className="number-increase-decrease">
            <button
                type="button"
                className="number-minus"
                onClick={() => {
                    const currentValue = value ?? 0;
                    if (currentValue > 0) {
                        setFieldValue(id, currentValue - 1);
                    }
                }}
            >
                <HiMinus />
            </button>
            <Field
                id={id}
                name={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={maxValue}
                className="input"
                // Set value within the range if it is outside the range
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const userValue: number = Number(e.target.value) || 0;
                    const bounded: number = maxValue ? Math.max(0, Math.min(userValue, maxValue)) : Math.max(0, userValue);
                    setFieldValue(id, bounded);
                }}
            />

            <button
                type="button"
                className="number-plus"
                onClick={() => {
                    const currentValue = value ?? 0;
                    if (!maxValue || currentValue < maxValue) {
                        setFieldValue(id, currentValue + 1);
                    }
                }}
            >
                <HiPlus />
            </button>
        </div>
    );
};

export default NumberInput;
