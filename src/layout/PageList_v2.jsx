import { useContext, useEffect, useState } from "react";
import { useEffectStateSingleData } from "../hooks/EffectStateSingleData";
import BoxColor_v1 from "./BoxColor_v1";
import CardInfo1_v1 from "./CardInfo1_v1";
import CardInfo2_v1 from "./CardInfoLink2_v1";
import CardPlateNo_v1 from "./CardPlateNo_v1";
import "./pagelist.css";
import IconSmall from "../components/IconSmall";
import CardPhoneNo_v1 from "./CardPhoneNo_v1";
import { RenderPagination } from "./RenderPagination";
import CardInfoBtn1_v1 from "./CardInfoBtn1_v1";
import { useThrottleState } from "./../hooks/useThrottleState";
import { LoadingState } from "../context/LoadingContext";
import NoItems from "./NoItems";
export default function PageList_v2({
    info = {
        h1: "name",
        h12: "",
        pre: "V",
        h2: "idcar",
        h3: "make",
        h32: "model",
        h4: "created",
        u: "unknown",
    },
    openurl = "",
    id = "",
    pagetype = "cars",
    display = "icon",
    onClick,
    url = "",
    refresh = undefined,
    nopaginate = false,
}) {
    useEffect(() => {
        if (refresh) refetchData();
    }, [refresh]);
    const [pagination, setPagination] = useState({
        maxpages: 0,
        pageno: 0,
        cursor: ["", 0],
    });
    const { tstate, throttleTstate } = useThrottleState(url, 1200);
    let sampledata = {
        payLoad: [
            {
                idcar: "",
                idclient: "",
                phoneno: "",
                code: "",
                region: 2,
                plate: "-",
                name: null,
                make: "-",
                model: "-",
                color: null,
            },
        ],
    };
    sampledata = undefined;
    const { data, setData, refetchData } = useEffectStateSingleData(
        tstate,
        sampledata || {}
    );
    const { load } = useContext(LoadingState);
    useEffect(() => {
        if (!data) return;
        let { cursor, maxpages } = data;
        if (cursor && Array.isArray(cursor)) {
            let num = Number(cursor[1]);
            if (num) setPagination({ ...pagination, maxpages, cursor });
        }
    }, [data.cursor]);

    if (!data.payLoad?.length)
        return (
            <div className="pagelist v1 ">
                {!nopaginate && (
                    <RenderPagination {...pagination} setCurrent={changePage} />
                )}
                <NoItems/>
            </div>
        );
    const pagerender = {
        person: data?.payLoad?.map((obj, ind) => (
            <CardInfo2_v1
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
                to={obj[id] && openurl && `${openurl}${obj[id]}`}
            />
        )),
    };
    function changePage(pageno) {
        let { cursor } = pagination;
        setPagination({ ...pagination, pageno });
        throttleTstate(
            `${url}&cursor=${cursor[0]}=${cursor[1]}&pageno=${pageno}`
        );
    }
    return display == "icon" ? (
        onClick ? (
            <div className="pagelist v1">
                <RenderPagination {...pagination} setCurrent={changePage} />
                {pagerender[pagetype] ||
                    data?.payLoad?.map((obj, ind) => (
                        <CardInfoBtn1_v1
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
                                link: `/files/image/cars/${obj.make}/${obj.model}.webp`,
                            }}
                            fmid={<CardPlateNo_v1 plate={obj} />}
                            fleft={<BoxColor_v1 color={obj.color} />}
                            onClick={() => {
                                onClick && onClick(obj);
                            }}
                        />
                    ))}
            </div>
        ) : (
            <div className="pagelist v1">
                <RenderPagination {...pagination} setCurrent={changePage} />
                {pagerender[pagetype] ||
                    data?.payLoad?.map((obj, ind) => (
                        <CardInfo1_v1
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
                                link: `/files/image/cars/${obj.make}/${obj.model}.webp`,
                            }}
                            fmid={<CardPlateNo_v1 plate={obj} />}
                            fleft={<BoxColor_v1 color={obj.color} />}
                            onClick={() => {
                                onClick && onClick(obj);
                            }}
                            to={obj[id] && openurl && `${openurl}${obj[id]}`}
                        />
                    ))}
            </div>
        )
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
    );
}
