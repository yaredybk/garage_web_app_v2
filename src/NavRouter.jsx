import { Route, Routes } from "react-router-dom";
import AppointmentPage from "./pages/appointment/AppointmentPage";
import CheckIn from "./pages/checkIn/CheckIn";
import ManagePointsOnCar from "./pages/checkIn/ManagePointsOnCar";
import NewCheckIn from "./pages/checkIn/NewCheckIn";
import { GlobalState } from "./context/GlobalContext";
import { useContext } from "react";
import AdvancedSearch from "./pages/search/AdvancedSearch";
import ManageJob from "./pages/job/ManageJob";
import JobsList from "./pages/job/JobsList";
import More from "./pages/more/More";
import NewAccountRegistration from "./pages/more/NewAccountRegistration";
import NewTransaction from "./pages/transaction/NewTransaction";
// import ReportToday from "./pages/report/ReportToday";
import ReportDaily from "./pages/report/ReportDaily";
import AccountHistory from "./pages/report/AccountHistory";
import NewStockRegistration from "./pages/more/NewStockRegistration";
import NotificationManagerUI from "./pages/notification/NotificationManagerUI";
// import NotificationManager from "./pages/notification/NotificationManager";
import TestComponents from "./pages/testing/TestComponents";
import ManageCar from "./pages/car/ManageCar";
import ManageClient from "./pages/client/ManageClient";
import Inspection from "./pages/inspection/Inspection";
import EditInspection from "./pages/inspection/EditInspection";
import Inspections from "./pages/inspection/Inspections";

export default function NavRouter() {
    const { list_region } = useContext(GlobalState);
    return (
        list_region && (
            <Routes>
                <Route path="/test" element={<TestComponents />} />
                <Route path="/appt" element={<AppointmentPage />} />
                <Route
                    path="/check-in/modifypoints/:carType"
                    element={<ManagePointsOnCar />}
                />
                <Route
                    path="/check-in/:id"
                    element={<NewCheckIn />}
                />
                <Route path="/report/today" element={<ReportDaily />}></Route>
                <Route path="/check-in" element={<CheckIn />}></Route>
                <Route path="/job/:id" element={<ManageJob />}></Route>
                <Route path="/inspections" element={<Inspections />}></Route>
                <Route path="/edit-inspection/:id" element={<EditInspection />}></Route>
                <Route path="/inspection/:id" element={<Inspection />}></Route>
                <Route path="/car/:id" element={<ManageCar />}></Route>
                <Route path="/client/:id" element={<ManageClient />}></Route>
                <Route path="/client/:id" element={<ManageJob />}></Route>
                <Route path="/job" element={<JobsList />}></Route>
                <Route path="/advancedsearch" element={<AdvancedSearch />} />
                <Route path="/more" element={<More />} />
                <Route path="/transaction/new" element={<NewTransaction />} />
                <Route path="/accounts/history" element={<AccountHistory />} />
                <Route
                    path="/accounts/new-registration"
                    element={<NewAccountRegistration />}
                />
                <Route
                    path="/stocks/new-registration"
                    element={<NewStockRegistration />}
                />
                <Route
                    path="/notification/list"
                    element={<NotificationManagerUI />}
                />
            </Routes>
        )
    );
}
