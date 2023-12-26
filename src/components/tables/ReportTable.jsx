import { useEffect, useState } from "react";
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
export default function ReportTable({
    data,
    onRowClickIndex = null,
    rowObjectUp = null,
    colIndex = 0,
    color = " bgblue ",
    accountInfo = { idaccount: 0, name: "unknown" },
    show = [],
    hide = ["sharedfromjob"],
    colNames = ["id", "name", "desc", "IN", "EX"],
}) {
    function calculateNet(datain) {
        if (!datain || !datain.length) return { IN: 0, EX: 0 };
        let IN = 0,
            EX = 0,
            desc = "SUB TOTAL",
            advance = 0;
        // console.log();
        datain.forEach((ele) => {
            if (!isNaN(ele[5])) IN += Number(ele[5]);
            if (!isNaN(ele[6])) EX += Number(ele[6]);
            if (ele[1] == "secretary") {
                advance = ele[7];
            }
        });
        return { IN, EX, desc, advance };
    }
    const [total, setTotal] = useState({
        desc: "SUB TOTAL",
        IN: 0,
        EX: 0,
        advance: 0,
    });
    useEffect(() => {
        const tmp = calculateNet(data);
        // console.log({ ...tmp });
        setTotal({ ...total, ...tmp });
    }, [data]);

    const [showhide, setShowHide] = useState({
        hide,
        show,
    });
    if (!data || !data.length)
        return (
            <div className=" px-4 my-1 bg-red-200 text-red-700  text-left pl-10">
                NO <em className=" text-black"> {accountInfo.name} </em>
                transaction in the range
            </div>
        );
    let tmp = isNaN(colIndex) ? 0 : colIndex;
    const clickColName = Object.keys(data[0])[tmp];
    function trClick(arra) {
        // onRowClickIndex && onRowClickIndex(arra[clickColName]);
        rowObjectUp && rowObjectUp(arra);
    }
    return (
        // <div className=" bg-white  gap-2   p-1 grid static printgrid colsminauto grid-cols-[min-content,1fr] max-md:grid-cols-1   print:max-w-[95wv] print:grid-cols-[min-content,auto]    ">
        <div className={" mb-4 bg-white mx-auto       " + accountInfo?.name}>
            <div className="  top-0      sticky  gap-2 overflow-hidden ">
                {/* {showhide.show.map((ele1) => (
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
                    ))} */}
            </div>
            <div className="  max-w-full overflow-auto ">
                <table
                    className={
                        "basic-table report_table overflow-x-auto    max-w-full  " +
                        color
                    }
                >
                    <tbody>
                        <tr className=" print:static  max-md:top-[3rem]">
                            {colNames.map((val, ind) => (
                                <th
                                    className={
                                        " bg-blue-300   bg-opacity-90 col-" +
                                        val
                                    }
                                    key={val + "header" + ind}
                                >
                                    {val}
                                </th>
                            ))}
                        </tr>
                        {data
                            ?.filter((ele) => !showhide.hide.includes(ele[3]))
                            ?.map((arra, ind) => (
                                <tr
                                    onClick={()=>trClick(arra)}
                                    className={`reason-${arra[3]} name-${arra[1]} `}
                                    key={"body row" + ind}
                                >
                                    {arra
                                        ?.filter((val, ind) => ind !== 3)
                                        ?.map((val, ind) => (
                                            <td
                                                className={` reason-${arra[3]}  col-${ind}`}
                                                key={val + "body td" + ind}
                                            >
                                                {val}
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        <tr className=" text-green-700 text-right bg-gray-300 opacity-100 border-0 border-t-4 border-double print:static  max-md:top-[3rem]">
                            {colNames.map((val, ind) => (
                                <th
                                    className=" border-none "
                                    key={val + "header" + ind}
                                >
                                    {total[val]}
                                </th>
                            ))}
                        </tr>
                        <tr className=" text-red-700 text-right bg-gray-200 border-t-2  opacity-100  border-0 border-solid  print:static  max-md:top-[3rem]">
                            {colNames.map((val, ind) => (
                                <th
                                    className=" border-none "
                                    key={val + "header" + ind}
                                >
                                    {
                                        {
                                            desc: "NET",
                                            IN: `${total.IN - total.EX}`,
                                        }[val]
                                    }
                                </th>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <b className=" p-1  text-blue-700 border-solid border-0 border-b-2  ">
                {accountInfo.idaccount || accountInfo.name} Advance :
                <em>{total.advance} birr</em>
            </b>
        </div>
    );
}
