import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import { HiOutlineBookmark, HiOutlineBadgeCheck, HiOutlineUser } from "react-icons/hi";
import { PiIsland } from "react-icons/pi";
import { IconContext } from "react-icons";
import { AnimatePresence } from "motion/react";

const Navbar = () => {
    return (
        <IconContext.Provider value={{ className: "navbar__icons" }}>
            <AnimatePresence mode="popLayout">
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
                            <NavLink to="/island" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                                <PiIsland />
                                Island
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
            </AnimatePresence>
        </IconContext.Provider>
    );
};

export default Navbar;
