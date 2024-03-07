import { useEffect, useState } from "react";
import "./jobs.css";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import BasicTable from "../../components/tables/BasicTable";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageList_v1 from "../../layout/PageList_v1";
import { _utilFunction } from "../../utils/_utilFunctions";
import PageListPerson_v2 from "../../layout/PageListPerson_v2";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import PageListPerson_v1 from "../../layout/PageListPerson_v1";
import { useCountWithGroupFunctions } from "../../hooks/useGroupFunctions";
import ClockBig from "../../components/ClockBig";
import BreakLine from "../../components/BreakLine";
import IconSmall from "../../components/IconSmall";
import ButtonAddCar from "../../components/button/ButtonAddCar";
let fromlocalStorage = localStorage.getItem("pending jobs");
if (fromlocalStorage) fromlocalStorage = JSON.parse(fromlocalStorage);
else fromlocalStorage = [];
export default function ListJob() {
    const { status = "pending" } = useParams();
    const jobTabs = [
        { value: "appt", src: "/public/images/call.svg" },
        { value: "pending", src: "/public/images/spanner.svg" },
        { value: "finished", src: "/public/images/doneall.svg" },
        { value: "next", src: "/public/images/upload.svg" },
    ];
    const navigate = useNavigate();
    const urlList = {
        appt: null,
        pending: "/api/getlist/job?status=pending",
        finished: "/api/getlist/job?status=finished",
        next: "/api/getlist/job?status=next",
    };
    const { list1 } = useEffectStateArrayData(
        urlList[status],
        []
        // fromlocalStorage
    );
    useEffect(() => {
        if (list1 && Array.isArray(list1)) {
            localStorage.setItem("pending jobs", JSON.stringify(list1));
        }
    }, [list1]);

    return (
        <main className="checkin min-[1024px]:p-2     max-w-[70rem]  ">
            <div className="flex bg gap-2 p-2 max-md:p-1  ">
                {jobTabs.map((obj1) => {
                    return (
                        <Link
                            role="button"
                            style={{ "--btn-active-bg": "blue" }}
                            name={obj1.value}
                            key={obj1.value}
                            className={
                                status === obj1.value
                                    ? "btn bg-blue-700 pointer-events-none shadow-md shadow-blue-500 text-white  basis-16 flex-1  text-xl max-md:text-base  "
                                    : "btn hover:bg-blue-700 hover:text-white hover:shadow-blue-500  basis-16 flex-1 text-xl max-md:text-base shadow-md shadow-gray-500"
                            }
                            to={`/nav/jobs/${obj1.value}`}
                        >
                            <IconSmall src={obj1.src} />
                            <span className="max-sm:hidden">{obj1.value}</span>
                        </Link>
                    );
                })}
            </div>
            {status == "appt" ? (
                <ListAppts />
            ) : (
                <PageList_v1
                    list={list1}
                    info={{
                        h1: "name",
                        pre: "J",
                        h2: "idjob",
                        h3: "make",
                        h32: "model",
                        h4: status == "pending" ? "created" : status,
                    }}
                    display="icon"
                    openurl="/nav/jobs/edit/"
                    id="idjob"
                />
            )}
            <BreakLine />
            <BreakLine />
            <div className="grid gap-2 w-fit grid-cols-2 mx-auto">

            <ButtonAddCar onClick={()=>navigate("/nav/register/car")}/>
            <ClockBig />
            </div>
        </main>
    );
}
function ListAppts() {
    const dayNum = _utilFunction.dayNumber();

    const { data } = useEffectStateSingleData(
        `/api/getlist?from=appts_view&filter=apptdate>='${_utilFunction.dateToday()}'`
    );
    const { groupedcout1, gcount1 } = useCountWithGroupFunctions(
        data?.payLoad,
        ["days"]
    );
    return (
        <>
            <div className="bg-green-200 min-h-[2rem] p-1 flex gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((val, ind) => {
                    ind += 1 + dayNum;
                    return (
                        <span
                            className=" grid gap-1 px-1 grid-cols-[auto,auto] place-items-center rounded-lg basis-16 flex-grow bg-green-400"
                            key={val}
                        >
                            <span>{val}</span>
                            {groupedcout1[0][ind] && (
                                <span className="bg-red-400 rounded-full p-1 w-4 h-4 text-center">
                                    {groupedcout1[0][ind]}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>
            <PageListPerson_v1
                list={data?.payLoad}
                info={{
                    h1: "name",
                    pre: "AP",
                    h2: "idappt",
                    h3: "apptday",
                    h32: "days",
                    h4: "apptdate",
                }}
                pagetype="person"
                display="icon"
                openurl="/nav/jobs/edit/"
                id="idjob"
            />
        </>
    );
}
