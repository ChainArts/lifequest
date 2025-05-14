import "./LevelUpToast.scss";

const LevelUpToast = ({level} : {level: string}) => {
    return (
        <div className="level-up-toast">
            <div className="level-up-toast__content">
                <h2 className="level-up-toast__title">Level Up!</h2>
                <p className="level-up-toast__message">You have reached Level {level} 🎉</p>
            </div>
        </div>
    );
}

export default LevelUpToast;