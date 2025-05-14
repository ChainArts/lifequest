import "./ToastLevelUp.scss";

const ToastLevelUp = ({level} : {level: number}) => {
    return (
        <div className="level-up-toast">
            <div className="level-up-toast__content">
                <h3 className="level-up-toast__title">Level Up!</h3>
                <p className="level-up-toast__message">You have reached level {level}</p>
            </div>
        </div>
    );
}

export default ToastLevelUp;