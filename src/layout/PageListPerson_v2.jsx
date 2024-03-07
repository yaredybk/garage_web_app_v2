import { useEffect, useState } from "react";
import { useEffectStateSingleData } from "../hooks/EffectStateSingleData";
import BoxColor_v1 from "./BoxColor_v1";
import "./pagelist.css";
import CardPhoneNo_v1 from "./CardPhoneNo_v1";
import { RenderPagination } from "./RenderPagination";
import {
    useCountWithGroupFunctions,
    useSubTotalFunctions,
} from "./../hooks/useGroupFunctions";
import CardInfoLink2_v1 from "./CardInfoLink2_v1";
import CardInfoBtn2_v1 from "./CardInfoBtn2_v1";
export default function PageListPerson_v2({
    info = {
        h1: "name",
        h12: "",
        pre: "C",
        h2: "idclient",
        h3: "make",
        h32: "model",
        h4: "created",
    },
    openurl = "",
    id = "",
    pagetype = "person",
    display = "icon",
    onClick,
    url = "",
    refresh = undefined,
    nopaginate = false,
    totalcols = { show: false, cols: [], display: [] },
}) {
    const [settings, setSettings] = useState({ display: display });
    useEffect(() => {
        if (refresh) refetchData();
    }, [refresh]);
    const [pagination, setPagination] = useState({
        maxpages: 0,
        min: 0,
        pageno: 0,
        cursor: ["", 0],
        nopaginate,
    });
    const [listurl, setlisturl] = useState(url);
    const { data, setData, refetchData } = useEffectStateSingleData(listurl);
    const { net1, count1 } = useSubTotalFunctions(
        totalcols.show && data?.payLoad,
        totalcols.cols
    );
    useEffect(() => {
        if (!data) return;
        let { cursor, maxpages } = data;
        if (cursor && Array.isArray(cursor)) {
            let num = Number(cursor[1]);
            if (num) setPagination({ ...pagination, maxpages, cursor });
        }
    }, [data?.cursor]);

    if (!data?.payLoad?.length)
        return (
            <div className="pagelist v1">
                <RenderPagination {...pagination} setCurrent={changePage} />
                <span className=" warnning red"> NO ITEMS HERE!</span>
            </div>
        );

    function changePage(pageno) {
        let { cursor } = pagination;
        setPagination({ ...pagination, pageno });
        setlisturl(`${url}&cursor=${cursor[0]}=${cursor[1]}&pageno=${pageno}`);
    }
    return (
        <div className="pagelist v1">
            {totalcols?.show && (
                <section className="flex flex-wrap gap-2 justify-center col-span-full">
                    {totalcols?.display?.map((val, ind) => (
                        <div
                            className=" warnning green max-md:text-base text-lg gap-2 flex justify-between font-bold "
                            key={val}
                        >
                            <span>{val}:</span>
                            <span>{net1[ind]}</span>{" "}
                        </div>
                    ))}
                </section>
            )}
            {!nopaginate && pagination.maxpages > 0 && (
                <RenderPagination {...pagination} setCurrent={changePage} />
            )}
            {settings.display == "icon" ? (
                <>
                    {onClick &&
                        data?.payLoad?.map((obj, ind) => (
                            <CardInfoBtn2_v1
                                info={{
                                    h1: obj[info.h1],
                                    h12: obj[info.h12],
                                    pre: info.pre,
                                    h2: obj[info.h2],
                                    h3: obj[info.h3],
                                    h32: obj[info.h32],
                                    h4: obj[info.h4],
                                }}
                                key={obj[info.h2]}
                                imgProp={{
                                    className: " h-16",
                                    src: "/public/images/person2.png",
                                }}
                                fmid={<CardPhoneNo_v1 phoneno={obj.phoneno} />}
                                fleft={<BoxColor_v1 color={obj.color} />}
                                onClick={() => {
                                    onClick && onClick(obj);
                                }}
                            />
                        ))}
                    {!onClick &&
                        data?.payLoad?.map((obj, ind) => (
                            <CardInfoLink2_v1
                                info={{
                                    h1: obj[info.h1],
                                    h12: obj[info.h12],
                                    pre: info.pre,
                                    h2: obj[info.h2],
                                    h3: obj[info.h3],
                                    h32: obj[info.h32],
                                    h4: obj[info.h4],
                                }}
                                key={obj[info.h2]}
                                imgProp={{
                                    className: " h-16",
                                    src: "/public/images/person2.png",
                                }}
                                fmid={<CardPhoneNo_v1 phoneno={obj.phoneno} />}
                                fleft={<BoxColor_v1 color={obj.color} />}
                                to={
                                    obj[id] && openurl && `${openurl}${obj[id]}`
                                }
                            />
                        ))}
                </>
            ) : (
                <table className=" pagelist v1 ">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>{info.h1}</th>
                            <th>{info.h3}</th>
                            <th>{info.h4}</th>
                            <th>phone no</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.payLoad?.map((obj, ind) => (
                            <tr
                                className=" "
                                onClick={() => {
                                    onClick && onClick(obj);
                                }}
                                key={"body row" + ind}
                            >
                                <td className=" ">{obj[info.h2]}</td>
                                <td>
                                    {obj[info.h1]}
                                    {obj[info.h12]}
                                </td>
                                <td>
                                    {obj[info.h3]}
                                    {obj[info.h32]}
                                </td>
                                <td>{obj[info.h4]}</td>
                                <td>{obj.phoneno}</td>
                                {/* <td>{obj[info.h2]}</td>
                <td>{obj[info.h2]}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            ;
        </div>
    );
}
