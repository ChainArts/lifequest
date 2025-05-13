import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { Field } from "formik";

interface NumberInputProps {
    value: number;
    setFieldValue: (field: string, value: any) => void;
    maxValue?: number;
    id: string;
}

const NumberInput = ({ id, setFieldValue, value, maxValue }: NumberInputProps) => {
    return (
        <div className="number-input-box">
            <Field
                id={id}
                name={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={maxValue}
                // Set value within the range if it is outside the range
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const userValue: number = Number(e.target.value) || 0;
                    const bounded: number = maxValue ? Math.max(0, Math.min(userValue, maxValue)) : Math.max(0, userValue);
                    setFieldValue(id, bounded);
                }}
            />
            <div className="arrow-buttons">
                <button
                    type="button"
                    onClick={() => {
                        const currentValue = value ?? 0;
                        if (!maxValue || currentValue < maxValue) {
                            setFieldValue(id, currentValue + 1);
                        }
                    }}
                >
                    <BiSolidUpArrow />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const currentValue = value ?? 0;
                        if (currentValue > 0) {
                            setFieldValue(id, currentValue - 1);
                        }
                    }}
                >
                    <BiSolidDownArrow />
                </button>
            </div>
        </div>
    );
};

export default NumberInput;
