import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import LoadingContext, { LoadingState } from "./context/LoadingContext";
import Nav from "./layout/Nav.jsx";
import GlobalContext from "./context/GlobalContext";
import { useEffect, useState } from "react";
import BasicDialog from "./components/dialog/BasicDialog";
import MiniPopup from "./components/popup/MiniPopup";
// import NavRouter from "./NavRouter";
import LogIn2 from "./pages/login2/LogIn2";
import axios from "axios";
import { baseurl2 } from "./utils/xaxios";
import HomePage from "./pages/home/HomePage";
import globalNav from "./globalNavList.json";

import AppointmentPage from "./pages/appointment/AppointmentPage";
import CheckIn from "./pages/checkIn/CheckIn";
import ManagePointsOnCar from "./pages/checkIn/ManagePointsOnCar";
import NewCheckIn from "./pages/checkIn/NewCheckIn";
import { GlobalState } from "./context/GlobalContext";
import { useContext } from "react";
import AdvancedSearch from "./pages/search/AdvancedSearch";
import ManageJob from "./pages/job/ManageJob";
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
import EditInspectionPayment from "./pages/inspection/EditInspectionPayment";
import DynamicPage from "./pages/DynamicPage";
import Loans from "./pages/loans/Loans";
import ListCar from "./pages/car/ListCar";
import { ManageClientAndCar } from "./components/ManageCarAndClient";
import { ListClient } from "./pages/client/ListClient";
import ManageAccounts from "./pages/Accounts/ManageAccounts";
import ListAccounts from "./pages/Accounts/ListAccounts";
import ListJob from "./pages/job/ListJobs";
import AuthContext from "./context/AuthContext";
import Calculator from "./components/calculator/lib/Calculator";

function App() {
    async function toggleOfflineInSW(value) {
        if (process.env.NODE_ENV === "development") return;
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;
        const sw = reg?.active;
        if (sw !== null) {
            sw.postMessage({ name: "status", value });
        }
    }
    // return <ReportDaily forprint={true}/>
    return (
        <AuthContext>
            <GlobalContext>
                <LoadingContext>
                    <Nav />
                    <LoadingBar />
                    <NavRouter />

                    <MiniPopup />
                    <BasicDialog id="calculator">
                        <Calculator />
                        {/* <h3 className="text-red-600 bg-red-300">
                        the calculator app is under development
                    </h3> */}
                    </BasicDialog>
                </LoadingContext>
            </GlobalContext>
        </AuthContext>
    );
}

export default App;

export function LoadingBar() {
    const { load } = useContext(LoadingState);
    return (
        <div className="loadingbar  absolute pointer-events-none overflow-hidden w-full -mx-4 h-[4px] z-[10000]   ">
            <span className={` loading_slider ${load ? "show" : ""}`}></span>
        </div>
    );
}
function NavRouter({ credd, setCredd }) {
    // const { list_region } = useContext(GlobalState);
    return (
        // list_region && (
        <Routes>
            <Route path="/" element={<HomePage page={"/"} />} />
            <Route
                path="/nav/login/*"
                element={<LogIn2 onSetCreed={setCredd} />}
            ></Route>
            <Route
                path="/nav/*"
                element={
                    <Routes>
                        <Route path="/clients" element={<ListClient />} />
                        <Route
                            path="/accounts"
                            element={<HomePage page={"/accounts"} />}
                        />
                        <Route
                            path={`/accounts/:role`}
                            element={<ListAccounts />}
                        />
                        <Route
                            path="/register/*"
                            element={<RegistrationRoutes />}
                        />

                        <Route path="/loans" element={<Loans />} />
                        <Route path="/test" element={<TestComponents />} />
                        <Route path="/appt" element={<AppointmentPage />} />
                        <Route
                            path="/check-in/modifypoints/:carType"
                            element={<ManagePointsOnCar />}
                        />
                        <Route path="/check-in/:id" element={<NewCheckIn />} />
                        <Route
                            path="/report/today"
                            element={<ReportDaily />}
                        ></Route>
                        <Route path="/check-in" element={<CheckIn />}></Route>
                        <Route
                            path="/jobs/edit/:id"
                            element={<ManageJob />}
                        ></Route>
                        <Route
                            path="/inspections"
                            element={<Inspections />}
                        ></Route>
                        <Route
                            path="/inspections/edit/:id"
                            element={<EditInspection />}
                        ></Route>
                        <Route
                            path="/inspections/preview/:id"
                            element={<Inspection />}
                        ></Route>
                        <Route
                            path="/inspections/payment/:id"
                            element={<EditInspectionPayment />}
                        ></Route>
                        <Route
                            path="/cars"
                            element={<ListCar path="list" />}
                        ></Route>
                        <Route path="/cars/:id" element={<ManageCar />}></Route>
                        <Route
                            path="/inspections/car/:id"
                            element={<ManageCar inspection />}
                        ></Route>
                        <Route
                            path="/clients/:id"
                            element={<ManageClient />}
                        ></Route>
                        <Route path="/jobs" element={<ListJob />}></Route>
                        <Route
                            path="/jobs/:status"
                            element={<ListJob />}
                        ></Route>
                        <Route
                            path="/search"
                            element={<HomePage page={"/search"} />}
                        />
                        <Route
                            path="/advancedsearch"
                            element={<AdvancedSearch />}
                        />
                        <Route
                            path="/search/:typein"
                            element={<AdvancedSearch />}
                        />
                        <Route
                            path="/more"
                            element={<HomePage page={"/more"} />}
                        />
                        <Route
                            path="/transaction/new"
                            element={<NewTransaction />}
                        />
                        <Route
                            path="/accounts/history"
                            element={<AccountHistory />}
                        />

                        <Route
                            path="/notification/list"
                            element={<NotificationManagerUI />}
                        />
                        <Route path="/*" element={<PageNotFound />} />
                    </Routes>
                }
            ></Route>
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
        // )
    );
    function RegistrationRoutes() {
        return (
            <Routes>
                <Route index element={<HomePage page={"/register"} />} />
                <Route
                    path="/client"
                    element={<ListClient path="register" />}
                />
                <Route path="/car" element={<ListCar path="register" />} />
                <Route
                    path={`/accounts`}
                    element={<ManageAccounts path="register" />}
                />

                <Route
                    path="/stock"
                    element={<NewStockRegistration path="register" />}
                />
            </Routes>
        );
    }
}
function PageNotFound() {
    return (
        <div>
            <h1>Nothing here ... </h1>
            <em>
                Navigate to &nbsp;
                <b>
                    <Link to={"/"}>&nbsp; HOME &nbsp;</Link>
                </b>
                &nbsp; or &nbsp;
                <b>
                    <Link to={-1}>&nbsp; go back &nbsp;</Link>
                </b>{" "}
            </em>
        </div>
    );
}
