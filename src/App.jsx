import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import LoadingContext, { LoadingState } from "./context/LoadingContext";
import PageHeader from "./layout/PageHeader";
import GlobalContext from "./context/GlobalContext";
import { useEffect, useState } from "react";
// import FoldedSection from "./components/FoldedSection";
// import RenderClients from "./features/clients/RenderClients";
// import RenderCars from "./features/cars/RenderCars";
// import ButtonSubmit from "./components/button/ButtonSubmit";
// import IconSmall from "./components/IconSmall";
import BasicDialog from "./components/dialog/BasicDialog";
// import RenderCar from "./features/cars/RenderCar";
// import NewCar from "./features/cars/NewCar";
// import NewClient from "./features/clients/NewClient";
// import RenderClient from "./features/clients/RenderClient";
// import ClockBig from "./components/ClockBig";
// import BreakLine from "./components/BreakLine";
// import { BreakLine2 } from "./pages/job/ManageJob";
import MiniPopup from "./components/popup/MiniPopup";
// import { openCloseModal } from "./utils/userInterface";
import NavRouter from "./NavRouter";
// import { AppointmentPage } from "./pages/appointment/AppointmentPage";
// import Calculator from "./components/calculator/index";
import LogIn2 from "./pages/login2/LogIn2";
import axios from "axios";
import { baseurl2 } from "./utils/xaxios";
import HomePage from "./pages/home/HomePage";

function App() {
    const [credd, setCredd] = useState({
        message: undefined,
        isregistered: undefined,
        username: undefined,
        status: false,
    });
    useEffect(() => {
        let uname = localStorage.getItem("username");
        if (!uname) {
            setCredd({
                message: false,
                isregistered: false,
                username: false,
            });
            return;
        }
        if (process.env.NODE_ENV === "development")
            document.title = uname + "@" + document.location.host.split(".")[3];
        else document.title = uname;
        axios
            .post(baseurl2 + "/auth/login", {}, { timeout: 500 })
            .then((res) => {
                localStorage.setItem("status", "local");
                toggleOfflineInSW("local");
                setCredd({ ...credd, isregistered: true, status: "local" });
            })
            .catch((err) => {
                if (!err.response) {
                    localStorage.setItem("status", "noserver");
                    toggleOfflineInSW("noserver");
                    setCredd({
                        ...credd,
                        isregistered: true,
                        status: "noserver",
                    });
                } else if (err.response.status == 401) {
                    toggleOfflineInSW("local");
                    localStorage.setItem("status", "unauthorized");
                    setCredd({
                        ...credd,
                        isregistered: false,
                        status: "unauthorized",
                    });
                } else {
                    toggleOfflineInSW("noserver");
                    localStorage.setItem("status", "unknown");
                    setCredd({
                        ...credd,
                        isregistered: true,
                        status: "noserver",
                    });
                }
            })
            .finally(() => {});
    }, []);

    async function toggleOfflineInSW(value) {
        if (process.env.NODE_ENV === "development") return;
        const reg = await navigator.serviceWorker.getRegistration();
        const sw = reg.active;
        if (sw !== null) {
            sw.postMessage({ name: "status", value });
        }
    }
    return (
        <div id="boss">
            <GlobalContext>
                <LoadingContext>
                    <LoginButton credd={credd} />
                    <PageHeader />
                    <Routes>
                        <Route path="/" element={<HomePage credd={credd} />} />
                        <Route
                            path="/nav/login/*"
                            element={
                                <LogIn2 creddin={credd} onSetCreed={setCredd} />
                            }
                        ></Route>
                        <Route path="/nav/*" element={<NavRouter />}></Route>
                    </Routes>

                    <MiniPopup />
                    <BasicDialog id="calculator">
                        {/* <Calculator /> */}
                        <h3 className="text-red-600 bg-red-300">
                            the calculator app is under development
                        </h3>
                    </BasicDialog>
                </LoadingContext>
            </GlobalContext>
        </div>
    );
}

export default App;

function LoginButton({ credd }) {
    return (
        process.env.NODE_ENV !="development" &&credd.isregistered === false && (
            <Link
                to={"/nav/login"}
                className=" grid relative text-center my-1 font-bold min-w-[17rem] bg-orange-400 mx-auto px-6 py-3"
            >
                login
            </Link>
        )
    );
}
