import "./Headline.scss";

interface HeadlineProps {
    children: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: 1 | 2 | 3 | 4 | 5 | 6;
}

const Headline = ({ children, level, style }: HeadlineProps) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={`headline fst-${style}`}>{children}</Tag>;
}

export default Headline;