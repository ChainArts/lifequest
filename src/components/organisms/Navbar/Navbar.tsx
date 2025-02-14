import { Link } from "react-router-dom";
import "./Navbar.scss";
import {
    HiOutlineBookmark,
    HiOutlineBadgeCheck,
    HiOutlineBookOpen,
    HiOutlineUser,
} from "react-icons/hi";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <HiOutlineBookmark />
                    Today
                </li>
                <li>
                    <HiOutlineBadgeCheck />
                    Habits
                </li>
                <li>
                    <HiOutlineBookOpen />
                    Diary
                </li>
                <li>
                    <HiOutlineUser />
                    Profile
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
