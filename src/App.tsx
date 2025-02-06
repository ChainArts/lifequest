import "./styles/App.scss";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

function App() {
 
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;
