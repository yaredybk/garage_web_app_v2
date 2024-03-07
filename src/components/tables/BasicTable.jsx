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
    nodatamessage="No data!",
    onRowClickIndex = null,
    rowObjectUP = null,
    colIndex = 0,
    color = " bgblue ",
    indexClicked = null,
    colsin=[]
}) {
    if (!(Array.isArray(data) && data.length))
        return (
            <table className=" basic-table bgred bg-red-300 text-red-800">
                <tbody>
                    <tr>
                        <td>{nodatamessage}</td>
                    </tr>
                </tbody>
            </table>
        );
    let tmp = isNaN(colIndex) ? 0 : colIndex;
    let clickColName;
    if (tmp && data[0]) clickColName = Object.keys(data[0])[tmp];
    if(colsin.length){
        colsin = colsin.filter((val)=>Object.hasOwn(data[0],val))
    }
    else{
        colsin = Object.keys(data[0])
    }
    return (
        <table className={"basic-table " + color}>
            <thead>
                <tr>
                    {colsin?.map((key, ind) => (
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
                            rowObjectUP && rowObjectUP(obj,ind);
                        }}
                        key={"body row" + ind}
                    >
                        {colsin?.map((key, ind) => (
                            <td
                                className={"  col-" + key}
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
