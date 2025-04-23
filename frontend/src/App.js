import "./App.css";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import Home from "./pages/guest/Home";
import WasteData from "./pages/guest/WasteData";
import Dashboard from "./pages/guest/Dashboard";
import WastePrice from "./pages/guest/navbar/WastePrice";
import GarbageTruckSchedule from "./pages/guest/navbar/GarbageTruckSchedule";
import WasteCategory from "./pages/guest/navbar/WasteCategory";



import BathroomWaste from "./pages/guest/navbar/category/BathroomWaste";
import BigWaste from "./pages/guest/navbar/category/BigWaste";
import ComposableWaste from "./pages/guest/navbar/category/ComposableWaste";
import DirtyWaste from "./pages/guest/navbar/category/DirtyWaste";
import EnergyRDFWaste from "./pages/guest/navbar/category/EnergyRDFWaste";
import HazardousWaste from "./pages/guest/navbar/category/HazardousWaste";
import RecycleWaste from "./pages/guest/navbar/category/RecycleWaste";



import HomeVillager from "./pages/villager/HomeVillager";
import AddingWasteVillager from "./pages/villager/AddingWasteVillager";
import WasteDataVillager from "./pages/villager/WasteDataVillager";
import ProfileVillager from "./pages/villager/navbar/ProfileVillager";
import DashboardVillager from "./pages/villager/DashboardVillager";
import WasteCategoryVillager from "./pages/villager/navbar/WasteCategoryVillager";
import GarbageTruckScheduleVillager from "./pages/villager/navbar/GarbageTruckScheduleVillager";
import WastepriceVillager from "./pages/villager/navbar/WastepriceVillager";




import BathroomWasteVillager from "./pages/villager/navbar/category/BathroomWasteVillager";
import BigWasteVillager from "./pages/villager/navbar/category/BigWasteVillager";
import ComposableWasteVillager from "./pages/villager/navbar/category/ComposableWasteVillager";
import DirtyWasteVillager from "./pages/villager/navbar/category/DirtyWasteVillager";
import EnergyRDFWasteVillager from "./pages/villager/navbar/category/EnergyRDFWasteVillager";
import HazardousWasteVillager from "./pages/villager/navbar/category/HazardousWasteVillager";
import RecycleWasteVillager from "./pages/villager/navbar/category/RecycleWasteVillager";

import HomeCollector from "./pages/collector/HomeCollector";
import AddingWasteCollector from "./pages/collector/AddingWasteCollector";
import WasteDataCollector from './pages/collector/WasteDataCollector';
import DashboardCollector from './pages/collector/DashboardCollector';
import ProfileCollector from './pages/collector/navbar/ProfileCollector';
import GarbageTruckScheduleCollector from './pages/collector/navbar/GarbageTruckScheduleCollector';
import WasteCategoryCollector from './pages/collector/navbar/WasteCategoryCollector';
import WastePriceCollector from './pages/collector/navbar/WastePriceCollector';

import DirtyGarbage from './pages/collector/navbar/category/DirtyWasteCollector';
import RecycleWasteCollector from './pages/collector/navbar/category/RecycleWasteCollector';
import ComposableGarbage from './pages/collector/navbar/category/ComposableWasteCollector';
import EnergyRDFgarbage from './pages/collector/navbar/category/EnergyRDFWasteCollector';
import HazardousGarbage from './pages/collector/navbar/category/HazardousWasteCollector';
import BathroomGarbage from './pages/collector/navbar/category/BathroomWasteCollector';
import BigGarbage from './pages/collector/navbar/category/BigWasteCollector';



import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ToastContainer } from "react-toastify";

import NotFound from './pages/NotFound';

import './App.css';

const App = () => {
    return (
        <div className="App">
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/wastedata" element={<WasteData />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/waste-price" element={<WastePrice />} />
                    <Route path="/garbagetruckschedule" element={<GarbageTruckSchedule />} />
                    <Route path="/BathroomWaste" element={<BathroomWaste />} />
                    <Route path="/bigwaste" element={<BigWaste />} />
                    <Route path="/composablewaste" element={<ComposableWaste />} />
                    <Route path="/dirtywaste" element={<DirtyWaste />} />
                    <Route path="/EnergyRDFwaste" element={<EnergyRDFWaste />} />
                    <Route path="/hazardouswaste" element={<HazardousWaste />} />
                    <Route path="/RecycleWaste" element={<RecycleWaste />} />
                    <Route path="/category" element={<WasteCategory />} />
                    


                    <Route path="/v/homevillager" element={<HomeVillager />} />
                    <Route path="/v/addingwastevillager" element={<AddingWasteVillager />} />
                    <Route path="/v/WasteDataVillager" element={<WasteDataVillager />} />
                    <Route path="/v/profile-villager/:vill_id" element={<ProfileVillager />} />
                    <Route path="/v/dashboard" element={<DashboardVillager />} />
                    <Route path="/v/garbagetruckschedulevillager" element={<GarbageTruckScheduleVillager />} />
                    <Route path="/v/wastepricevillager" element={<WastepriceVillager />} />

                    <Route path="/v/bathroomwastevillager" element={<BathroomWasteVillager />} />
                    <Route path="/v/categoryvillager" element={<WasteCategoryVillager />} />
                    <Route path="/v/bigwastevillager" element={<BigWasteVillager />} />
                    <Route path="/v/composablewastevillager" element={<ComposableWasteVillager />} />
                    <Route path="/v/DirtyWasteVillager" element={<DirtyWasteVillager />} />
                    <Route path="/v/energyrdfwastevillager" element={<EnergyRDFWasteVillager />} />
                    <Route path="/v/hazardouswastevillager" element={<HazardousWasteVillager />} />
                    <Route path="/v/recyclewastevillager" element={<RecycleWasteVillager />} />
                    
                    <Route path="/c/homecollector" element={<HomeCollector />} />
                    <Route path="/c/addingwastecollector"element={<AddingWasteCollector />} />
                    <Route path="/c/wastedatacollector"element={<WasteDataCollector />} />
                    <Route path="/c/dashboard" element={<DashboardCollector />} />
                    <Route path="/c/profile-collector/:coll_id" element={<ProfileCollector />} />
                    <Route path="/c/garbagetruckschedulecollector" element={<GarbageTruckScheduleCollector/>} />
                    <Route path="/c/category" element={<WasteCategoryCollector/>} />
                    <Route path="/c/wastepricecollector" element={<WastePriceCollector />} />

                    <Route path="/c/DirtyGarbage" element={<DirtyGarbage />} />
                    <Route path="/c/RecycleWasteCollector" element={<RecycleWasteCollector/>} />
                    <Route path="/c/ComposableGarbage" element={<ComposableGarbage/>} />
                    <Route path="/c/EnergyRDFgarbage" element={<EnergyRDFgarbage/>} />
                    <Route path="/c/HazardousGarbage" element={<HazardousGarbage/>} />
                    <Route path="/c/BathroomGarbage" element={<BathroomGarbage/>} />
                    <Route path="/c/BigGarbage" element={<BigGarbage/>} />
                    
                    {/* 404 Route - must be last */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;