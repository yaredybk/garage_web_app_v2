import React from "react";
import "./basictable.css";
/**
 * renders a basic table with row click
 * @param {Array} data array of objects
 * @param {function} onRowClickIndex called whene row clicked
 * @param {int} colIndex colument index used for row click
 * @param {string} color bgblue,bgred,bggreen
 * @returns a table
 */
export default function BasicTable({
    data,
    onRowClickIndex = null,
    rowObjectUP = null,
    colIndex = 0,
    color = " bgblue ",
    indexClicked = null,
}) {
    if (!(Array.isArray(data) && data.length))
        return (
            <table className=" basic-table bgred bg-red-300 text-red-800">
                <tbody>
                    <tr>
                        <td>NO DATA</td>
                    </tr>
                </tbody>
            </table>
        );
    let tmp = isNaN(colIndex) ? 0 : colIndex;
    let clickColName;
    if (tmp && data[0]) clickColName = Object.keys(data[0])[tmp];
    return (
        <table className={"basic-table " + color}>
            <thead>
                <tr>
                    {Object.keys(data[0])?.map((key, ind) => (
                        <th key={key + "header" + ind}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((obj, ind) => (
                    <tr
                        onClick={() => {
                            indexClicked && indexClicked(ind);
                            onRowClickIndex &&
                                onRowClickIndex(obj[clickColName]);
                            rowObjectUP && rowObjectUP(obj);
                        }}
                        key={"body row" + ind}
                    >
                        {Object.keys(obj)?.map((key, ind) => (
                            <td
                                className={" col-" + key}
                                key={key + "body td" + ind}
                            >
                                {obj[key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
