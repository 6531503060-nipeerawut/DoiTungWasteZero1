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
import SellWaste from "./pages/guest/navbar/category/SellWaste";



import HomeVillager from "./pages/villager/HomeVillager";
import AddingWasteVillager from "./pages/villager/AddingWasteVillager";
import WasteDataVillager from "./pages/villager/WasteDataVillager";
import ProfileVillager from "./pages/villager/ProfileVillager";
import DashboardVillager from "./pages/villager/DashboardVillager";
import WasteSeparationVillager from "./pages/villager/WasteSeparationVillager";
import GarbageTruckScheduleVillager from "./pages/villager/GarbageTruckScheduleVillager";
import WastepriceVillager from "./pages/villager/WastepriceVillager";




import BathroomWasteVillager from "./pages/villager/category/BathroomWasteVillager";
import BigWasteVillager from "./pages/villager/category/BigWasteVillager";
import ComposableWasteVillager from "./pages/villager/category/ComposableWasteVillager";
import DirtyWasteVillager from "./pages/villager/category/DirtyWasteVillager";
import EnergyRDFWasteVillager from "./pages/villager/category/EnergyRDFWasteVillager";
import HazardousWasteVillager from "./pages/villager/category/HazardousWasteVillager";
import SellWasteVillager from "./pages/villager/category/SellWasteVillager";

import HomeCollector from "./pages/collector/HomeCollector";
import AddingWasteCollector from "./pages/collector/AddingWasteCollector";
import WasteDataCollector from './pages/collector/WasteDataCollector';
import DashboardCollector from './pages/collector/DashboardCollector';
import ProfileCollector from './pages/collector/ProfileCollector';
import GarbageTruckScheduleCollector from './pages/collector/GarbageTruckScheduleCollector';
import WasteSeparationColledtor from './pages/collector/WasteSeparationCollector';
import WastePriceCollector from './pages/collector/WastePriceCollector';

import DirtyGarbage from './pages/collector/category/DirtyWasteCollector';
import GarbageSell from './pages/collector/category/SellWasteCollector';
import ComposableGarbage from './pages/collector/category/ComposableWasteCollector';
import EnergyRDFgarbage from './pages/collector/category/EnergyRDFWasteCollector';
import HazardousGarbage from './pages/collector/category/HazardousWasteCollector';
import BathroomGarbage from './pages/collector/category/BathroomWasteCollector';
import BigGarbage from './pages/collector/category/BigWasteCollector';



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
                    <Route path="/wastedata" element={<WasteData />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/waste-price" element={<WastePrice />} />
                    <Route path="/garbagetruckschedule" element={<GarbageTruckSchedule />} />
                    <Route path="/bathroomwaste" element={<BathroomWaste />} />
                    <Route path="/bigwaste" element={<BigWaste />} />
                    <Route path="/composablewaste" element={<ComposableWaste />} />
                    <Route path="/dirtywaste" element={<DirtyWaste />} />
                    <Route path="/energyrdfwaste" element={<EnergyRDFWaste />} />
                    <Route path="/hazardouswaste" element={<HazardousWaste />} />
                    <Route path="/sellwaste" element={<SellWaste />} />
                    <Route path="/category" element={<WasteCategory />} />
                    


                    <Route path="/v/homevillager" element={<HomeVillager />} />
                    <Route path="/v/addingwastevillager" element={<AddingWasteVillager />} />
                    <Route path="/v/WasteDataVillager" element={<WasteDataVillager />} />
                    <Route path="/v/profile-villager/:vill_id" element={<ProfileVillager />} />
                    <Route path="/v/dashboard" element={<DashboardVillager />} />
                    <Route path="/v/garbagetruckschedulevillager" element={<GarbageTruckScheduleVillager />} />
                    <Route path="/v/wastepricevillager" element={<WastepriceVillager />} />

                    <Route path="/v/bathroomwastevillager" element={<BathroomWasteVillager />} />
                    <Route path="/v/categoryvillager" element={<WasteSeparationVillager />} />
                    <Route path="/v/bigwastevillager" element={<BigWasteVillager />} />
                    <Route path="/v/composablewastevillager" element={<ComposableWasteVillager />} />
                    <Route path="/v/DirtyWasteVillager" element={<DirtyWasteVillager />} />
                    <Route path="/v/energyrdfwastevillager" element={<EnergyRDFWasteVillager />} />
                    <Route path="/v/hazardouswastevillager" element={<HazardousWasteVillager />} />
                    <Route path="/v/sellwastevillager" element={<SellWasteVillager />} />
                    
                    <Route path="/c/homecollector" element={<HomeCollector />} />
                    <Route path="/c/addingwastecollector"element={<AddingWasteCollector />} />
                    <Route path="/c/wastedatacollector"element={<WasteDataCollector />} />
                    <Route path="/c/dashboard" element={<DashboardCollector />} />
                    <Route path="/c/profile-collector/:coll_id" element={<ProfileCollector />} />
                    <Route path="/c/garbagetruckschedulecollector" element={<GarbageTruckScheduleCollector/>} />
                    <Route path="/c/categorycollector" element={<WasteSeparationColledtor/>} />
                    <Route path="/c/wastepricecollector" element={<WastePriceCollector />} />

                    <Route path="/c/DirtyGarbage" element={<DirtyGarbage />} />
                    <Route path="/c/GarbageSell" element={<GarbageSell/>} />
                    <Route path="/c/ComposableGarbage" element={<ComposableGarbage/>} />
                    <Route path="/c/EnergyRDFgarbage" element={<EnergyRDFgarbage/>} />
                    <Route path="/c/HazardousGarbage" element={<HazardousGarbage/>} />
                    <Route path="/c/BathroomGarbage" element={<BathroomGarbage/>} />
                    <Route path="/c/BigGarbage" element={<BigGarbage/>} />
                    
                    
                    
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;