import "./App.css";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/guest/Home";
import WasteData from "./pages/guest/WasteData";
import HomeVillager from "./pages/villager/HomeVillager";
import AddingWasteVillager from "./pages/villager/AddingWasteVillager";
import WasteDataVillager from "./pages/villager/WasteDataVillager";
import ProfileVillager from "./pages/villager/ProfileVillager";
import HomeCollector from "./pages/collector/HomeCollector";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ToastContainer } from "react-toastify";

const App = () => {
    return (
        <div className="App">
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/waste-data" element={<WasteData />} />
                    <Route path="/v/homevillager" element={<HomeVillager />} />
                    <Route path="/v/addingwastevillager" element={<AddingWasteVillager />} />
                    <Route path="/v/wastedatavillager" element={<WasteDataVillager />} />
                    <Route path="/v/profile-villager/:vill_id" element={<ProfileVillager />} />
                    <Route path="/c/homecollector" element={<HomeCollector />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;