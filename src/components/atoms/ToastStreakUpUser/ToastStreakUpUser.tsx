import "./ToastStreakUpUser.scss";

const ToastStreakUpUser = ({ streak, isPb }: { streak: number; isPb: boolean }) => {
    return (
        <div className="streak-up-toast">
            <div className="streak-up-toast__content">
                <h3 className="streak-up-toast__title">You are on a Roll!</h3>
                {isPb ? <p className="streak-up-toast__pb">New highest Streak! {streak}</p> : <p className="streak-up-toast__message">Current Streak: {streak}</p>}
            </div>
        </div>
    );
};

export default ToastStreakUpUser;
