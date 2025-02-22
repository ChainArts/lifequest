import { ReactNode } from 'react';
import './Card.scss';

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Card = ({ children, className, style }: CardProps) => {
    return (
        <div className={`card ${className}`} style={style}>{children}</div>
    );
}

export default Card;