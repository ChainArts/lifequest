import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import { HiOutlineBookmark, HiOutlineBadgeCheck, HiOutlineBookOpen, HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { IconContext } from "react-icons";
import { AnimatePresence } from "motion/react";

const Navbar = () => {
    return (
        <IconContext.Provider value={{ className: "navbar__icons" }}>
            <AnimatePresence mode="popLayout">
                <nav className="navbar">
                    <ul>
                        <li>
                            <NavLink to="/home" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
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
                            <NavLink to="/shop" className={({ isActive }) => (isActive ? "active navbar-link" : "navbar-link")}>
                                <HiOutlineShoppingBag />
                                Shop
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
