import "./styles/App.scss";
import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Profile from "./pages/Profile";
import HabitDetail from "./pages/HabitDetail";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/organisms/Navbar/Navbar";
import IslandHeader from "./components/organisms/IslandHeader/IslandHeader";
import Shop from "./pages/Shop";

function App() {
    const location = useLocation();
    //TEMP CHECK FOR LOGGED IN
    const isLoggedIn = true; //location.pathname !== "/";
    return (
        <>
            {isLoggedIn && <IslandHeader />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
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
