import "./App.css";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";



//Guest
import Home from "./pages/guest/Home";
import WasteData from "./pages/guest/WasteData";
import Dashboard from "./pages/guest/Dashboard";
import WastePrice from "./pages/guest/navbar/WastePrice";
import WasteCategory from "./pages/guest/navbar/WasteCategory";

//WasteCategory (Guest)
import BathroomWaste from "./pages/guest/navbar/category/BathroomWaste";
//Category Guest Waste
import BigWaste from "./pages/guest/navbar/category/BigWaste";
import ComposableWaste from "./pages/guest/navbar/category/ComposableWaste";
import DirtyWaste from "./pages/guest/navbar/category/DirtyWaste";
import EnergyRDFWaste from "./pages/guest/navbar/category/EnergyRDFWaste";
import HazardousWaste from "./pages/guest/navbar/category/HazardousWaste";
import RecycleWaste from "./pages/guest/navbar/category/RecycleWaste";
//sales
//ฟล์หน้าขยะรีไซเคิลทั้ง 4
import PlasticWaste from './pages/guest/navbar/category/sales/PlasticWaste'; 
import GlassWaste from './pages/guest/navbar/category/sales/GlassWaste';
import PaperWaste from './pages/guest/navbar/category/sales/PaperWaste';
import MetalWaste from './pages/guest/navbar/category/sales/MetalWaste';

//GarbageTruckSchedule (Guest)
import GarbageTruckSchedule from "./pages/guest/navbar/GarbageTruckSchedule";
//Day (Guest)
import Monday from "./pages/guest/navbar/schedule/Monday";
import Tuesday from "./pages/guest/navbar/schedule/Tuesday";
import Wednesday from "./pages//guest/navbar/schedule/Wednesday";
import Friday from "./pages/guest/navbar/schedule/Friday";


//Collector
import HomeCollector from "./pages/collector/HomeCollector";
import AddingWasteCollector from "./pages/collector/AddingWasteCollector";
import WasteDataCollector from './pages/collector/WasteDataCollector';
import DashboardCollector from './pages/collector/DashboardCollector';
import ProfileCollector from './pages/collector/navbar/ProfileCollector';
import WastePriceCollector from './pages/collector/navbar/WastePriceCollector';

//WasteCategoryCollector (Collector)
import WasteCategoryCollector from './pages/collector/navbar/WasteCategoryCollector';
//Category Collector Waste
import BathroomWasteCollector from "./pages/collector/navbar/category/BathroomWasteCollector";
import BigWasteCollector from "./pages/collector/navbar/category/BigWasteCollector";
import ComposableWasteCollector from "./pages/collector/navbar/category/ComposableWasteCollector";
import EnergyRDFWasteCollector from "./pages/collector/navbar/category/EnergyRDFWasteCollector";
import HazardousWasteCollector from "./pages/collector/navbar/category/HazardousWasteCollector";
import RecycleWasteCollector from "./pages/collector/navbar/category/RecycleWasteCollector";
import DirtyWasteCollector from "./pages/collector/navbar/category/DirtyWasteCollector";

//GarbageTruckSchedule (Collector)
import GarbageTruckScheduleCollector from './pages/collector/navbar/GarbageTruckScheduleCollector';
//Day (Collector)
import MondayCollector from "./pages/collector/navbar/schedule/MondayCollector";
import TuesdayCollector from "./pages/collector/navbar/schedule/TuesdayCollector";
import WednesdayCollector from "./pages//collector/navbar/schedule/WednesdayCollector";
import FridayCollector from "./pages/collector/navbar/schedule/FridayCollector";



//Villager
import HomeVillager from "./pages/villager/HomeVillager";
import AddingWasteVillager from "./pages/villager/AddingWasteVillager";
import WasteDataVillager from "./pages/villager/WasteDataVillager";
import ProfileVillager from "./pages/villager/navbar/ProfileVillager";
import DashboardVillager from "./pages/villager/DashboardVillager";
import WastepriceVillager from "./pages/villager/navbar/WastepriceVillager";

//WasteCategoryVillager (Villager)
import WasteCategoryVillager from "./pages/villager/navbar/WasteCategoryVillager";
//Category Villager Waste
import BathroomWasteVillager from "./pages/villager/navbar/category/BathroomWasteVillager";
import BigWasteVillager from "./pages/villager/navbar/category/BigWasteVillager";
import ComposableWasteVillager from "./pages/villager/navbar/category/ComposableWasteVillager";
import DirtyWasteVillager from "./pages/villager/navbar/category/DirtyWasteVillager";
import EnergyRDFWasteVillager from "./pages/villager/navbar/category/EnergyRDFWasteVillager";
import HazardousWasteVillager from "./pages/villager/navbar/category/HazardousWasteVillager";
import RecycleWasteVillager from "./pages/villager/navbar/category/RecycleWasteVillager";

//GarbageTruckScheduleVillager (Villager)
import GarbageTruckScheduleVillager from "./pages/villager/navbar/GarbageTruckScheduleVillager";
//Day (Villager)
import MondayVillager from "./pages/villager/navbar/schedule/MondayVillager";
import TuesdayVillager from "./pages/villager/navbar/schedule/TuesdayVillager";
import WednesdayVillager from "./pages//villager/navbar/schedule/WednesdayVillager";
import FridayVillager from "./pages/villager/navbar/schedule/FridayVillager";

//CarbonFootprintCalculatorPlaceholder
import NotFoundGuest from './pages/guest/navbar/NotFoundGuest';
import NotFoundCollector from './pages/collector/navbar/NotFoundCollector';
import NotFoundVillager from './pages/villager/navbar/NotFoundVillager';


import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ToastContainer } from "react-toastify";

import HomeDashboardAdmin from "./pages/admin/HomeDashboardAdmin";





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


                    {/* WasteCategoryGuest (Guest) */}
                    <Route path="/category" element={<WasteCategory />} />
                    {/* Category Guest Waste */}
                    <Route path="/BathroomWaste" element={<BathroomWaste />} />
                    <Route path="/bigwaste" element={<BigWaste />} />
                    <Route path="/composablewaste" element={<ComposableWaste />} />
                    <Route path="/dirtywaste" element={<DirtyWaste />} />
                    <Route path="/EnergyRDFwaste" element={<EnergyRDFWaste />} />
                    <Route path="/hazardouswaste" element={<HazardousWaste />} />
                    <Route path="/sellwaste" element={<RecycleWaste />} />
                    {/* สำหรับหน้าขายขยะ */}
                    <Route path="/sellwaste/plastic" element={<PlasticWaste />} />
                    <Route path="/sellwaste/glass" element={<GlassWaste />} />
                    <Route path="/sellwaste/paper" element={<PaperWaste />} />
                    <Route path="/sellwaste/metal" element={<MetalWaste />} />

                    {/* GarbageTruckSchedule (guest) */}
                    <Route path="/garbagetruckschedule" element={<GarbageTruckSchedule />} />
                    {/* Day (guest) */}
                    <Route path="/schedule/monday" element={<Monday />} />
                    <Route path="/schedule/tuesday" element={<Tuesday />} />
                    <Route path="/schedule/wednesday" element={<Wednesday />} />
                    <Route path="/schedule/friday" element={<Friday />} />
                    


                    {/* Collector */}
                    <Route path="/c/homecollector" element={<HomeCollector />} />
                    <Route path="/c/addingwastecollector"element={<AddingWasteCollector />} />
                    <Route path="/c/wastedatacollector"element={<WasteDataCollector />} />
                    <Route path="/c/dashboard" element={<DashboardCollector />} />
                    {/* Collector id */}
                    <Route path="/c/profile-collector/:id" element={<ProfileCollector />} />
                    {/* Collector  id */}
                    <Route path="/c/wastepricecollector" element={<WastePriceCollector />} />

                    {/* WasteCategoryCollector (Collector) */}
                    <Route path="/c/categorycollector" element={<WasteCategoryCollector/>} />
                    {/* Category Collector Waste */}
                    <Route path="/c/bathroomwastecollector" element={<BathroomWasteCollector />} />
                    <Route path="/c/bigwastecollector" element={<BigWasteCollector />} />
                    <Route path="/c/composablewastecollector" element={<ComposableWasteCollector />} />
                    <Route path="/c/dirtywastecollector" element={<DirtyWasteCollector />} />
                    <Route path="/c/EnergyRDFwastecollector" element={<EnergyRDFWasteCollector />} />
                    <Route path="/c/hazardouswastecollector" element={<HazardousWasteCollector />} />
                    <Route path="/c/sellwastecollector" element={<RecycleWasteCollector />} />
                    
                    {/* GarbageTruckScheduleCollector (Collector) */}
                    <Route path="/c/garbagetruckschedulecollector" element={<GarbageTruckScheduleCollector/>} />
                    {/* Day (Collector) */}
                    <Route path="/schedule/mondaycollector" element={<MondayCollector />} />
                    <Route path="/schedule/tuesdaycollector" element={<TuesdayCollector />} />
                    <Route path="/schedule/wednesdaycollector" element={<WednesdayCollector />} />
                    <Route path="/schedule/fridaycollector" element={<FridayCollector />} />

          
                    {/* Villager */}
                    <Route path="/v/homevillager" element={<HomeVillager />} />
                    <Route path="/v/addingwastevillager" element={<AddingWasteVillager />} />
                    <Route path="/v/WasteDataVillager" element={<WasteDataVillager />} />
                    <Route path="/v/profile-villager/:vill_id" element={<ProfileVillager />} />
                    <Route path="/v/dashboard" element={<DashboardVillager />} />
                    <Route path="/v/wastepricevillager" element={<WastepriceVillager />} />

                    {/* WasteCategoryVillager (Villager) */}
                    <Route path="/v/categoryvillager" element={<WasteCategoryVillager />} />
                    {/* Category Villager Waste */}
                    <Route path="/v/bathroomwastevillager" element={<BathroomWasteVillager />} />
                    <Route path="/v/bigwastevillager" element={<BigWasteVillager />} />
                    <Route path="/v/composablewastevillager" element={<ComposableWasteVillager />} />
                    <Route path="/v/dirtyWastevillager" element={<DirtyWasteVillager />} />
                    <Route path="/v/energyrdfwastevillager" element={<EnergyRDFWasteVillager />} />
                    <Route path="/v/hazardouswastevillager" element={<HazardousWasteVillager />} />
                    <Route path="/v/sellwastevillager" element={<RecycleWasteVillager />} />

                    {/* GarbageTruckScheduleVillager (Villager) */}
                    <Route path="/v/garbagetruckschedulevillager" element={<GarbageTruckScheduleVillager />} />
                    {/* Day (Villager) */}
                    <Route path="/schedule/mondayvillager" element={<MondayVillager />} />
                    <Route path="/schedule/tuesdayvillager" element={<TuesdayVillager />} />
                    <Route path="/schedule/wednesdayvillager" element={<WednesdayVillager />} />
                    <Route path="/schedule/fridayvillager" element={<FridayVillager />} />

                    {/* (CarbonFootprintCalculatorPlaceholder) */}
                    {/* Guest */}
                    <Route path="/notfoundguest" element={<NotFoundGuest />} />
                    {/* Collector */}
                    <Route path="/c/notfoundcollector" element={<NotFoundCollector />} />
                    {/* Villager */}
                    <Route path="/v/notfoundvillager" element={<NotFoundVillager />} />



                    <Route path="/admin/all-waste-records" element={<HomeDashboardAdmin/>} />
                    
                    
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;