import "./styles/App.scss";
import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Profile from "./pages/Profile";
import HabitDetail from "./pages/HabitDetail";
import Login from "./pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/organisms/Navbar/Navbar";
import IslandHeader from "./components/organisms/IslandHeader/IslandHeader";
import DarkModeToggle from "./components/atoms/DarkModeToggle/DarkModeToggle";
import Shop from "./pages/Shop";

function App() {
    const location = useLocation();
    //TEMP CHECK FOR LOGGED IN
    const isLoggedIn = true; //location.pathname !== "/";
    return (
        <>
            <DarkModeToggle />
            {isLoggedIn && <IslandHeader />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="habits/:id" element={<HabitDetail />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </AnimatePresence>
            {isLoggedIn && <Navbar />}
        </>
    );
}

export default App;
