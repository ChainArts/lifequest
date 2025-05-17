import { MdArrowForwardIos } from "react-icons/md";
import { useUser } from "../../../lib/UserContext";
import { calculateLevel } from "../../../lib/XP";
import DarkModeToggle from "../../atoms/DarkModeToggle/DarkModeToggle";
import Headline from "../../atoms/Headline/Headline";
import Card from "../../molecules/Card/Card";
import "./ProfileSettings.scss";
import { invoke } from "@tauri-apps/api/core";
import { usePopOver } from "../../../lib/PopOverContext";

const ProfileSettings = () => {
    const { user } = useUser();
    const { openPopOver, closePopOver } = usePopOver();

    const openDelete = () => {
        openPopOver(
            "Delete Profile",
            <div>
                <p className="fst--base">Are you sure you want to delete all your data? This action cannot be undone. You will lose all your habits, streaks, and progress.</p>
                <div className="button-container">
                    <button className="cancel" onClick={() => closePopOver()}>
                        Cancel
                    </button>
                    <button className="delete" onClick={reset_profile}>
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    const reset_profile = async () => {
        const confirm = window.confirm("Are you sure you want to reset your profile? This action cannot be undone.");
        if (confirm) {
            await invoke("reset_data");
            window.location.reload();
        }
    };

    return (
        <>
            <Headline level={2} style="section">
                Profile
            </Headline>
            <div className="stats-teaser__grid">
                <Card className=" inverse stats-teaser__streak">
                    <span className="stats-teaser__streak-title"></span>
                    <span className="fst--big-number">{user ? calculateLevel(user.exp).level : 0}</span>
                    <span className="stats-teaser__streak-title">Level</span>
                </Card>
                <div className="stats-teaser__list">
                    <Card className="profile__settings">
                        <span className="fst--card-title">Settings</span>
                        <div className="profile__settings_item">
                            <span className="fst--base">Dark Mode</span>
                            <DarkModeToggle />
                        </div>
                        <div className="profile__settings_item">
                            <span className="fst--base">Reset Profile</span>
                            <button className="delete" onClick={openDelete}>
                                <MdArrowForwardIos />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};
export default ProfileSettings;
