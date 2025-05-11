import { BsQuestionCircle } from "react-icons/bs";
import "./InfoBlob.scss";
import { useState } from "react";

const InfoBlob = ({ text }: { text: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="info-blob">
            {/* Optional: Add a title or description here */}
            <div className="info-trigger">
                {isOpen && <div className="tool-arrow" />}
                <button className="info-button" onClick={() => setIsOpen((prev) => !prev)}>
                    <BsQuestionCircle />
                </button>
            </div>

            {/* Properly interpolate the class name */}
            <div className={`popup${isOpen ? " open" : ""}`}>
                <p className="fst--base">{text}</p>
            </div>

            {/* Optional: clicking anywhere else on the page closes it */}
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default InfoBlob;
