import "./Headline.scss";

interface HeadlineProps {
    children: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: "page" | "section" | "upper";
}

const Headline = ({ children, level, style }: HeadlineProps) => {
    const Tag: React.ElementType = `h${level}`;
    return <Tag className={`headline fst--${style}-heading`}>{children}</Tag>;
}

export default Headline;