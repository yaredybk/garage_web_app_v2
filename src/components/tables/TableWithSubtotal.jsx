import { useEffect, useState } from "react";
import "./basictable.css";
import BasicTable from "./BasicTable";
/**
 * renders a basic table with row click
 * @param {Array} data array of objects
 * @param {function} onRowClickIndex called whene row clicked
 * @param {int} colIndex colument index used for row click
 * @param {string} color bgblue,bgred,bggreen
 * @param {string} subtotalColName the column to be calculated
 * @returns a table
 */
export default function TableWithSubtotal({
    data,
    nodatamessage="No data",
    onRowClickIndex = undefined,
    rowObjectUP = ()=>null,
    colIndex = 0,
    color = " bgblue ",
    indexClicked = null,
    subtotalColName = undefined,
    colsin=[]
}) {
    const [subtotal, setsubtotal] = useState(undefined);
    useEffect(() => {
        if (!(data && data.length)) return;
        if (!subtotalColName) return;
        let net = 0;
        data.forEach((obj) => {
            net += Number(obj[subtotalColName]);
        });
        setsubtotal(net);
    }, [data]);
    return (
        <div className=" grid gap-0    ">
            <BasicTable
                data={data}
                onRowClickIndex={onRowClickIndex}
                rowObjectUP={rowObjectUP}
                colIndex={colIndex}
                color={color}
                indexClicked={indexClicked}
                colsin = {colsin}
                nodatamessage={nodatamessage}
            />
            {subtotalColName && data?.length != 0 && (
                <div className="flex    ">
                    <span className="  flex-grow pr-4 text-right ">
                        subtotoal
                    </span>
                    =
                    <span className="  flex-grow-0  text-right underline min-w-[5rem] px-4">
                        {subtotal} birr
                    </span>
                </div>
            )}
        </div>
    );
}
