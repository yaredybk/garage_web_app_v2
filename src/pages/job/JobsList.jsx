import { useState } from "react";
import "./jobs.css";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import BasicTable from "../../components/tables/BasicTable";
import { useNavigate } from "react-router-dom";
import OverFlowAuto from "../../components/OverFlowAuto";
import { ManageClientAndCar } from "../../components/ManageCarAndClient";
import ClockBig from "../../components/ClockBig";
import RenderPlate3 from "../../components/RenderPlate3";
import RenderPlateJobs from "../../components/RenderPlateJobs";

export default function JobsList() {
    const jobTabs = ["appt", "pending", "finished", "next"];
    let curloc = new URL(document.location.href);
    const navigate = useNavigate();
    const [infoo, setInfo] = useState({
        clientId: null,
        idcar: null,
        status: curloc.searchParams.get("status") || "pending",
    });

    const { list1 } = useEffectStateArrayData(
        "/api/getlist/jobs?status=" + infoo.status
    );
    function onChangeFilter(e) {
        let { name, value } = e.target;
        alterSearchQuery(name, value);
        setInfo({ ...infoo, [name]: value });
    }
    function alterSearchQuery(name, value) {
        let tmploc = new URL(document.location.href);
        if (tmploc.searchParams.has(name)) tmploc.searchParams.set(name, value);
        else tmploc.searchParams.append(name, value);
        window.history.replaceState(null, document.title, tmploc);
    }
    return (
        <div className="checkin min-[1024px]:p-2 grid    max-w-[63rem]  mx-auto ">
            <div className="grid max-sm:grid-cols-1 grid-cols-2 ">
                <ClockBig />
                <ManageClientAndCar minimal={true} />
            </div>
            <div className="flex bg gap-3 mx-auto">
                <h2>#</h2>
                {jobTabs.map((val) => {
                    return (
                        <button
                            name={val}
                            key={val}
                            className={
                                infoo.status === val ? " bg-blue-400 " : ""
                            }
                            onClick={() =>
                                onChangeFilter({
                                    target: {
                                        name: "status",
                                        value: val,
                                    },
                                })
                            }
                        >
                            {val}
                        </button>
                    );
                })}
            </div>
            <div className=" flex  gap-1 bg-gray-400 py-1  justify-center flex-wrap">
                {list1?.map((obj, ind) => (
                    <RenderPlateJobs
                        datein={infoo.status=="pending"?obj.created:obj[infoo.status]}
                        display1=" grid   bg-gray-300 "
                        key={`withdate  ${ind} ${obj?.idjob}`}
                        plateobj={obj}
                    />
                ))}
            </div>
        </div>
    );
    function openCheckinEditor(checkinId) {
        navigate("/nav/job/" + checkinId);
    }
}
