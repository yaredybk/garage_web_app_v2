import React, { useState } from "react";
import "./basictable.css";
import "./reporttable.css";
/**
 * renders a basic table with row click
 * @param {Array} data array of objects
 * @param {function} onRowClickIndex called whene row clicked
 * @param {int} colIndex colument index used for row click
 * @param {string} color bgblue,bgred,bggreen
 * @returns a table
 */
export default function TransactionHisTable({
    data,
    onRowClickIndex = null,
    rowObjectUp = null,
    colIndex = 0,
    color = " bgblue ",
    accountInfo = { idaccount: 0 },
}) {
    const [showhide, setShowHide] = useState({
        hide: ["sharedfromjob"],
        show: [],
    });
    if (!data)
        return (
            <div className="grid">
                <div className=" flex gap-3">
                    <h3>account id: {accountInfo.idaccount}</h3>
                </div>
                <table className={"basic-table report_table " + color}>
                    <thead>
                        <tr>
                            <td>...</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>NO DATA</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    if (!data.length)
        return (
            <div className="grid">
                <div className=" flex gap-3">
                    <h3>account id: {accountInfo.idaccount}</h3>
                </div>
                <table className=" basic-table report_table">
                    <thead>
                        <tr>
                            <td>NO DATA</td>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    let tmp = isNaN(colIndex) ? 0 : colIndex;
    const clickColName = Object.keys(data)[tmp];
    return (
        <div className="grid">
            <div className=" flex gap-3">
                <h3>account id: {accountInfo.idaccount}</h3>
                {showhide.show.map((ele1) => (
                    <button
                        onClick={() => {
                            let ind = showhide.show.findIndex(
                                (ele) => ele === ele1
                            );
                            let removed = showhide.show.splice(ind, 1)[0];
                            showhide.hide.push(removed);
                            setShowHide({
                                hide: showhide.hide,
                                show: showhide.show,
                            });
                        }}
                        key={ele1}
                        className=" bg-green-200 outline outline-green-800 text-green-800 "
                    >
                        {ele1}
                    </button>
                ))}
                {showhide.hide.map((ele2) => (
                    <button
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
                        key={ele2}
                        className=" bg-red-200 line-through  "
                    >
                        {ele2}
                    </button>
                ))}
            </div>
            <table className={"basic-table report_table " + color}>
                {/* <thead> */}
                {/* </thead> */}
                <tbody>
                    <tr>
                        {Object.keys(data[0])?.map((key, ind) => (
                            <th
                                className=" bg-blue-400"
                                key={key + "header" + ind}
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                    {data
                        ?.filter((ele) => !showhide.hide.includes(ele.reason))
                        ?.map((obj, ind) => (
                            <tr
                                onClick={() => {
                                    onRowClickIndex &&
                                        onRowClickIndex(obj[clickColName]);
                                    rowObjectUp && rowObjectUp(obj);
                                }}
                                key={"body row" + ind}
                            >
                                {Object.keys(obj)?.map((key, ind) => (
                                    <td
                                        className={
                                            key == "reason"
                                                ? "reason-" + obj[key]
                                                : "-"
                                        }
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
    );
}
