import { ReactNode } from "react";
import "./Card.scss";
import { NavLink } from "react-router-dom";

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    route?: string;
    onClick?: () => void;
}

const Card = ({ children, className, style, route, onClick }: CardProps) => {
    if (route) {
        return (
            <NavLink to={route}>
                <div className={`card ${className}`} style={style}>
                    {children}
                </div>
            </NavLink>
        );
    }

    return (
        <div className={`card ${className}`} style={style} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
