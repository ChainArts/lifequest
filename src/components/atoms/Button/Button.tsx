import "./Button.scss";

type ButtonProps = {
    children?: React.ReactNode;
    onClick: () => void;
    className?: string;
};

const Button = ({ children, onClick, className }: ButtonProps) => {
    return (
        <div className="button__container">
            <button className={`button ${className}`} onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default Button;
