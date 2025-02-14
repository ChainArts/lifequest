import "./styles/App.scss";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/organisms/Navbar/Navbar";
import IslandHeader from "./components/organisms/IslandHeader/IslandHeader";
import DarkModeToggle from "./components/atoms/DarkModeToggle/DarkModeToggle";

function App() {
    const location = useLocation();
    return (
        <>
            <DarkModeToggle />
            <IslandHeader />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                </Routes>
            </AnimatePresence>
            <Navbar />
        </>
    );
}

export default App;
