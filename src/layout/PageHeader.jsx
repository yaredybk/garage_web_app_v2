import { Link, useLocation, useNavigate } from "react-router-dom";
import "./pageheader.css";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { LoadingState } from "../context/LoadingContext";
import IconSmall from "../components/IconSmall";
let backCounter = 0;

export default function PageHeader() {
    const pageslist = [
        // { url: "/", title: "Home" },
        // { url: "/nav/appt", title: "Appointment" },
        {
            url: "/nav/report/today",
            title: "report",
            img: "/public/images/report.png",
        },
        // { url: "/nav/check-in", title: "Check-in" },
        // { url: "/nav/check-in/modifypoints/sedan", title: "edit" },
        { url: "/nav/job", title: "jobs", img: "/public/images/repair.png" },
        // { url: "/nav/advancedsearch", title: "search" },
        { url: "/nav/more", title: "more" },
    ];
    const locc = useLocation();
    const [locationhis, setLocationhis] = useState([null, null, null, "/"]);
    const navigate = useNavigate();
    useEffect(() => {
        if (locationhis[3] == locc.pathname) return;
        let tmp = [];
        tmp = locationhis;
        if (locationhis[2] == locc.pathname) {
            tmp = [null, tmp[0], tmp[1], tmp[2]];
            backCounter++;
            // console.log(backCounter);
            if (backCounter == 3) {
                // console.log("going back ", history.length - 1, " steps");
                // history.go(-(history.length - 1));
                // navigate("/", { replace: true });
                // history.go()
            }
        } else {
            backCounter = 0;
            tmp.shift();
            tmp.push(locc.pathname);
        }
        // console.log(tmp);
        setLocationhis([...tmp]);

        return () => {};
    }, [locc.pathname]);
    const { load } = useContext(LoadingState);

    return (
        <header id="pageheader">
            <LoadingBar />
            <center className=" hidden print:hidden">
                <h1>Daniel Garage</h1>
            </center>
            <div className="nav   ">
                <IconSmall
                    role="button"
                    onClick={() => navigate(-1)}
                    className=" h-7"
                    src="/public/images/arrowback.svg"
                />
                {locationhis[3]?.match("newCheckIn") ? (
                    <Link>nav disabled</Link>
                ) : (
                    <>
                        <Link
                            className={
                                locationhis[3] == "/"
                                    ? "activenav flex-1"
                                    : " flex-1"
                            }
                            to="/"
                        >
                            home
                        </Link>
                        {pageslist.map((obj) => (
                            <Link
                                className={
                                    locationhis[3]?.match(obj.url)
                                        ? "activenav flex-1"
                                        : " flex-1"
                                }
                                key={obj.url}
                                to={obj.url}
                            >
                                {obj.title}
                            </Link>
                        ))}
                    </>
                )}
            </div>
        </header>
    );
}
export function LoadingBar() {
    const { load } = useContext(LoadingState);
    return (
        <div className="  absolute pointer-events-none overflow-hidden  w-[98vw] mx-auto h-[4px] z-50   ">
            <span className={` loading_slider ${load ? "show" : ""}`}></span>
        </div>
    );
}
