import { ReactNode } from "react";
import "./PageCard.scss";

interface PageCardProps {
    children: ReactNode;
}

const PageCard = ({ children }: PageCardProps) => {
    return <div className="page-card">{children}</div>;
};

export default PageCard;
