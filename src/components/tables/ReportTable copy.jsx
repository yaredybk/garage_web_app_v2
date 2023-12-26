import { useState } from "react";
import "./basictable.css";
import "./reporttable.css";
import OverFlowAuto from "../OverFlowAuto";
import { BreakLine2 } from "../../pages/job/ManageJob";
/**
 * renders a basic table with row click
 * @param {Array} data array of objects
 * @param {function} onRowClickIndex called whene row clicked
 * @param {int} colIndex colument index used for row click
 * @param {string} color bgblue,bgred,bggreen
 * @returns a table
 */
export default function ReportTable({
    data,
    onRowClickIndex = null,
    rowObjectUp = null,
    colIndex = 0,
    color = " bgblue ",
    accountInfo = { idaccount: 0, name: "unknown" },
    show = [],
    hide = ["sharedfromjob"],
}) {
    const [showhide, setShowHide] = useState({
        hide,
        show,
    });
    if (!data || !data.length)
        return (
            <div className=" px-4 my-1 bg-red-200 text-red-700  text-left pl-10">
                NO {accountInfo.name} transaction in the range
            </div>
        );
    let tmp = isNaN(colIndex) ? 0 : colIndex;
    const clickColName = Object.keys(data[0])[tmp];
    return (
        // <div className=" bg-white  gap-2   p-1 grid static printgrid colsminauto grid-cols-[min-content,1fr] max-md:grid-cols-1   print:max-w-[95wv] print:grid-cols-[min-content,auto]    ">
        <div className="report_table_con mb-4 bg-white  max-[500px]:block    grid grid-cols-[min-content,1fr]  ">
            <div className="table-title w-24 max-[500px]:w-auto    max-md:flex-row flex-col flex p-1  max-md:justify-center   top-0">
                <div className="  top-0 max-md:flex gap-2 ">
                    <h2>{accountInfo.idaccount || accountInfo.name}</h2>
                    {showhide.show.map((ele1) => (
                        <button
                            htmlFor={ele1}
                            key={ele1}
                            className=" hidden bg-green-200 p-0   outline-green-800 text-green-800 "
                            onClick={() => {
                                let ind = showhide.show.findIndex(
                                    (ele) => ele === ele1
                                );
                                let removed = showhide.show.splice(ind, 1)[0];
                                showhide.hide.push(removed);
                                setShowHide({
                                    show: showhide.show,
                                    hide: showhide.hide,
                                });
                            }}
                        >
                            {ele1}
                        </button>
                    ))}
                    {showhide.hide.map((ele2) => (
                        <button
                            htmlFor={ele2}
                            key={ele2}
                            className=" hidden bg-red-200 p-0  line-through  "
                            onClick={() => {
                                let ind = showhide.hide.findIndex(
                                    (ele) => ele === ele2
                                );
                                let removed = showhide.hide.splice(ind, 1)[0];
                                showhide.show.push(removed);
                                setShowHide({
                                    show: showhide.show,
                                    hide: showhide.hide,
                                });
                            }}
                        >
                            {ele2}
                        </button>
                    ))}
                </div>
            </div>
            <div className=" max-w-full overflow-auto">
                <table
                    className={
                        "basic-table report_table overflow-x-auto mx-auto min-w-[30rem]  max-w-full  " +
                        color
                    }
                >
                    <tbody>
                        <tr className=" print:static  max-md:top-[3rem]">
                            {Object.keys(data[0])?.map(
                                (key, ind) =>
                                    key !== "reason" && (
                                        <th
                                            className={
                                                " bg-blue-300   bg-opacity-90 col-" +
                                                key
                                            }
                                            key={key + "header" + ind}
                                        >
                                            {key}
                                        </th>
                                    )
                            )}
                        </tr>
                        {data
                            ?.filter(
                                (ele) => !showhide.hide.includes(ele.reason)
                            )
                            ?.map((obj, ind) => (
                                <tr
                                    onClick={() => {
                                        onRowClickIndex &&
                                            onRowClickIndex(obj[clickColName]);
                                        rowObjectUp && rowObjectUp(obj);
                                    }}
                                    className={`reason-${obj.reason} `}
                                    key={"body row" + ind}
                                >
                                    {Object.keys(obj)
                                        ?.filter((key) => key !== "reason")
                                        ?.map((key, ind) => (
                                            <td
                                                className={` reason-${obj.reason}  col-${key}`}
                                                key={key + "body td" + ind}
                                            >
                                                {obj[key]}
                                            </td>
                                        ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
