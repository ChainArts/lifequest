import "./UserBar.scss";
import { useUser } from "../../../lib/UserContext";

const UserBar = () => {
    const { user } = useUser();
    if (!user) return null;
    const { exp, current_streak } = user;
    const xpValue = exp > 1 ? `${exp} XP` : `${exp} XP`;
    const streakValue = current_streak > 1 ? `${current_streak} Days` : `${current_streak} Day`;

    return (
        <div className="user-bar">
            <div className="user-bar__xp">
                <span className="user-bar__xp-label">XP:</span>
                <span className="user-bar__xp-value">{xpValue}</span>
            </div>
            <div className="user-bar__streak">
                <span className="user-bar__streak-label">Streak:</span>
                <span className="user-bar__streak-value">{streakValue}</span>
            </div>
        </div>
    );
};

export default UserBar;
