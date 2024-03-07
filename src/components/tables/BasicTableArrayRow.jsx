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
export default function BasicTableArrayRow({
    data,
    tableHeader,
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
    return (
        <table className={"basic-table " + color}>
            <thead>
                <tr>
                    {tableHeader?.map((key, ind) => (
                        <th key={key + "header" + ind}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.map((arra, ind) => (
                    <tr
                        onClick={() => {
                            indexClicked && indexClicked(ind);
                            onRowClickIndex &&
                                onRowClickIndex(arra[colIndex]);
                            rowObjectUP && rowObjectUP(arra);
                        }}
                        key={"body row" + ind}
                    >
                        {arra?.map((val, ind) => (
                            <td
                                className={" col-" + tableHeader[ind]}
                                key={val + "body td" + ind}
                            >
                                {val}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
