import React, { useState } from "react";
import { useEffectStateArrayData } from "./../../hooks/EffectStateArrayData";
import ButtonSubmit from "./../../components/button/ButtonSubmit";
import { useNavigate } from "react-router-dom";
import FoldedSection from "../../components/FoldedSection";

export default function JobHistory({type="job", idcar = 63, count = 1 }) {
    const [infoHis, setinfoHis] = useState({ idcar, count });
    const JobHisData = useEffectStateArrayData(
        `/api/getlist/${type == "job" ?"jobhistory":"inspectionhistory" }?count=${infoHis.count}&idcar=${infoHis.idcar}`
    );

    const infotoextract =
    type == "job" ?
    [
        ["idjob", "job id"],
        ["finished", "last date"],
        ["odo", "last KM"],
        ["next", "NEXT"],
    ]
    :[
        ["idinspection", "insp. id"],
        ["createdat", "date"],
        ["odo", "Odo"],
        // ["next", "NEXT"],
    ]
    ;
    const navigate = useNavigate();
    function goto(jobinfoin) {
        jobinfoin.idjob &&
            navigate(`/nav/job/${jobinfoin.idjob}`, { replace: true });
    }
    return (
        <FoldedSection
            open
            color="violet"
            title="vehicle job history"
            className="  bg-violet-300 "
        >
            <div className="flex flex-wrap   gap-2 m-1">
                {(JobHisData.list1?.length &&
                    JobHisData.list1?.map((job_, ind) => {
                        return (
                            <table
                                onClick={() => goto(job_)}
                                className="singlejob hover:bg-green-300 cursor-pointer max-sm:w-full   overflow-hidden bg-green-200 border-solid border-2 rounded-md border-green-800 "
                                key={ind}
                            >
                                <tbody>
                                    {infotoextract.map(([key, disp], ind) => (
                                        <tr
                                            key={key}
                                            className={
                                                ind % 2
                                                    ? "  bg-green-100 bg-opacity-50  "
                                                    : "   "
                                            }
                                        >
                                            <td className="red border-r-2 border-blue-800 border-solid border-0  text-right px-1 ">
                                                {disp}
                                            </td>
                                            {disp == "last KM" ? (
                                                <td>{job_[key]}</td>
                                            ) : (
                                                <td
                                                    className={
                                                        job_[key]
                                                            ? "   "
                                                            : "  animate-ping-1 bg-red-200 text-red-700 "
                                                    }
                                                >
                                                    {job_[key] ||
                                                        "pending. . ."}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    <tr>
                                        <td
                                            colSpan={2}
                                            // style={{ columnSpan: 2 }}
                                            className="max-w-[7rem]  bg-red-200"
                                        >
                                            {job_.notes?.map(
                                                (obj) => `${obj.description}, `
                                            ) || "NO NOTES!"}
                                        </td>
                                        {/* <td></td> */}
                                    </tr>
                                </tbody>
                            </table>
                        );
                    })) || (
                    <span className="  warning red w-44 ">
                        this vehicle does not have any history
                    </span>
                )}
            </div>
            <ButtonSubmit
                className=" p-2 bg-violet-800  text-white m-1"
                onClick={() => {
                    setinfoHis({ ...infoHis, count: count + 5 });
                }}
            >
                more history
            </ButtonSubmit>
        </FoldedSection>
    );
}
