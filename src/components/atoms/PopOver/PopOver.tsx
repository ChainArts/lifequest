import { ReactNode, useState } from "react";
import Card from "../../molecules/Card/Card";
import { HiOutlineX } from "react-icons/hi";
import "./PopOver.scss";

const PopOver = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="popover" onClick={() => setIsOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                <Card className="popover__card">
                    <div className="popover__header">
                        <button type="button" onClick={() => setIsOpen(false)}>
                            <HiOutlineX />
                        </button>
                    </div>
                    <div className="popover__content">{children}</div>
                </Card>
            </div>
        </div>
    );
};

export default PopOver;
