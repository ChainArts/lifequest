import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import { HiOutlineBookmark, HiOutlineBadgeCheck, HiOutlineBookOpen, HiOutlineUser } from "react-icons/hi";
import { IconContext } from "react-icons";

const Navbar = () => {
    return (
        <IconContext.Provider value={{ className: "navbar__icons" }}>
            <nav className="navbar">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                            <HiOutlineBookmark />
                            Today
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/habits" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                            <HiOutlineBadgeCheck />
                            Habits
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/diary" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                            <HiOutlineBookOpen />
                            Diary
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                            <HiOutlineUser />
                            Profile
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </IconContext.Provider>
    );
};

export default Navbar;
