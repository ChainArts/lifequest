import "./styles/App.scss";
import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Profile from "./pages/Profile";
import HabitDetail from "./pages/HabitDetail";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/organisms/Navbar/Navbar";
import IslandContainer from "./components/organisms/IslandContainer/IslandContainer";
import Island from "./pages/Island";
import { HabitsProvider } from "./lib/HabitsContext";
import { UserProvider } from "./lib/UserContext";
import UserBar from "./components/organisms/UserBar/UserBar";
import { PopOverProvider } from "./lib/PopOverContext";
import { ToastContainer, cssTransition } from "react-toastify";

const ToastTransition = cssTransition({
    enter: "Toastify_fadeIn",
    exit: "Toastify_fadeOut",
});

function App() {
    const location = useLocation();
    return (
        <UserProvider>
            <HabitsProvider>
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={ToastTransition} />
                <UserBar />
                <PopOverProvider>
                    <IslandContainer location={location.pathname} />
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Home />} />
                            <Route path="/habits" element={<Habits />} />
                            <Route path="habits/:id" element={<HabitDetail />} />
                            <Route path="/island" element={<Island />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </AnimatePresence>
                    <Navbar />
                </PopOverProvider>
            </HabitsProvider>
        </UserProvider>
    );
}

export default App;
