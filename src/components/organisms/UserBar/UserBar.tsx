import "./UserBar.scss";
import { useUser } from "../../../lib/UserContext";
import { AiFillFire } from "react-icons/ai";
import LinearProgress from "../../atoms/LinearProgress/LinearProgress";
import { RiCopperCoinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const UserBar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    if (!user) return null;

    const { current_streak, level, goal, done, coins } = user;
    const streakValue = current_streak;
    const formatedLevel = level < 10 ? `0${level}` : level;

    return (
        <div className="user-bar">
            <div className="user-bar__stats" onClick={() => navigate("/profile")}>
                <div className="user-bar__level">
                    <span className="user-bar__level-value">{formatedLevel}</span>
                </div>
                <div className="user-bar__coins-xp">
                    <div className="user-bar__coins">
                        <RiCopperCoinFill className="user-bar__coins-icon" />
                        <span className="user-bar__coins-value">{coins}</span>
                    </div>
                    <div className="user-bar__xp">
                        <LinearProgress className="user-bar__xp-progress" goal={goal} done={done} />
                    </div>
                </div>
            </div>
            <div className="user-bar__streak" onClick={() => navigate("/profile")}>
                <AiFillFire className="user-bar__streak-icon" />
                <span className="user-bar__streak-value">{streakValue}</span>
            </div>
        </div>
    );
};

export default UserBar;
