import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    advanced_search_1,
    searchForOptions,
    usingOptions,
} from "./searchFunction.js";
import BasicTable from "../../components/tables/BasicTable";
import RenderCar from "../../features/cars/RenderCar.jsx";
import FoldedSection from "../../components/FoldedSection.jsx";
import RenderCars from "../../features/cars/RenderCars.jsx";
import RenderClients from "../../features/clients/RenderClients.jsx";
import BasicDialog from "../../components/dialog/BasicDialog.jsx";
import RenderClient from "../../features/clients/RenderClient.jsx";
import { GlobalState } from "../../context/GlobalContext.jsx";
import { LoadingState } from "./../../context/LoadingContext";
import { openCloseModal } from "../../utils/userInterface.js";

export default function AdvancedSearch({}) {
    const [infoo, setInfo] = useState({ clientId: null, idcar: null });
    function openModal(id, modalid) {
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setInfo({ ...infoo, idcar: id });
        else setInfo({ ...infoo, clientId: id });
        setShowWindow(idd);
        openCloseModal(idd, "open");
    }
    const { list_region, list_carmake } = useContext(GlobalState);
    const { load } = useContext(LoadingState);
    // console.log(downPreset);
    const navigate = useNavigate();
    // const searchForOptions = ["cars", "owners", "jobs"];
    // const usingOptions = [["car_id", "plate_no","owner_id"], ["owner_id", "phone_no","owner_name"], ["job_id","car_id",]];
    const whereCols = {
        0: {
            // car_id:0,
            // ingarage: [
            //     { id: -1, code: "all" },
            //     { id: 0, code: "In garage" },
            //     { id: 1, code: "Out" },
            // ],
            // code: [
            //     { id: -1, code: "all", desc: "all" },
            //     ...downPreset?.plateCodes,
            // ],
            region: [{ idregion: -1, en: "all" }, ...list_region],
            // make: [{ id: -1, code: "all" },],
            // model: [{ id: -1, code: "all" }],
            // car_type: [{ id: -1, code: "all" }],
            // plate_no:0,
            // owner_id: [{id:-1,code:"all"}],
            // vin: [{id:-1,code:"all"}],
            // updated: [{id:-1,code:"all"}],
            // created: [{id:-1,code:"all"}],
        },
        1: {
            // "owner_id": 0,
            // "owner_name": "UNKNOWN",
            gender: [
                { id: -1, en: "all" },
                { id: "M", en: "M" },
                { id: "F", en: "F" },
            ],
            // "phone_no": 0,
            // "updated": "2023-04-19T20:26:31.000Z",
            // "created": "2023-03-29T09:31:37.000Z"
        },
        2: {
            // job_id:[{id:-1,code:"all"}],
            // car_id:[{id:-1,code:"all"}],
            // km:[{id:-1,code:"all"}],
            // delivered_date:[{id:-1,code:"all"}],
            // created:[{id:-1,code:"all"}],
            // updated:[{id:-1,code:"all"}],
            // total: [{ id: -1, en: "all" }],
            // paid: [{ id: -1, en: "all" }],
            // loan: [{ id: -1, en: "all" }],
            reportid: [{ id: -1, en: "all" }],
            technician: [
                { id: -1, en: "all" },
                // ...downPreset?.list_technician,
            ],
        },
    };
    const [searchParams, setSearchParams] = useState({
        searchfor: "0",
        searchValue: "",
        using: "0",
        where: {},
    });
    const [showWindow, setShowWindow] = useState(0);
    const [list, setlist] = useState(null);
    const [waiting, setwaiting] = useState(0);
    const [changed, setchanged] = useState(true);
    // let waiting = false;
    // let changed;
    async function advanced_search() {
        // console.log(searchParams);
        advanced_search_1({ ...searchParams })
            .then((data) => {
                setlist([...data]);
                // console.log(data);
            })
            .catch((err) => {
                console.warn(err);
            });
        // console.log(await result);
        // setlist(result);
        setchanged(false);
        if (waiting)
            setTimeout(() => {
                if (waiting === 2) setwaiting(3);
                else setwaiting(2);
            }, 1000);
    }
    function throttle() {
        if (waiting) {
            setchanged(true);
            return;
        }
        setwaiting(1);
        setTimeout(() => {
            setwaiting(2);
        }, 500);
    }
    useEffect(() => {
        if (waiting)
            if (searchParams?.searchValue != "") {
                if (changed || waiting === 1) advanced_search();
                else if (waiting !== 0) setwaiting(0);
            } else {
                setwaiting(0);
            }

        return () => {};
    }, [waiting]);
    function render_using() {
        return searchParams?.searchfor ? (
            <div className="pt-2 grid border-black bg-white border-t-4">
                <label
                    className="block text-center font-bold text-xl "
                    htmlFor="searchfor"
                >
                    Using
                </label>
                <select
                    value={searchParams?.using}
                    onChange={(e) => {
                        setSearchParams({
                            ...searchParams,
                            using: e.target.value,
                            searchValue: "",
                        });
                    }}
                    className=" py-1 px-2 bg-blue-200 rounded-md "
                    name="using"
                    id="using"
                >
                    {usingOptions[searchParams?.searchfor].map((val, ind) => (
                        <option key={val + ind} value={ind}>
                            {val}
                        </option>
                    ))}
                </select>
            </div>
        ) : null;
    }
    function render_where() {
        return searchParams?.searchfor ? (
            <div className="pt-2 grid border-black bg-slate-200 border-t-4">
                <span
                    className="block text-center font-bold text-xl "
                    htmlFor="searchfor"
                >
                    Where
                </span>
                {Object.keys(whereCols[searchParams?.searchfor]).map(
                    (key, ind) => (
                        <div
                            key={key}
                            className="mt-2 grid border-gray-500 bg-slate-200 border-t-2"
                        >
                            <label
                                className="block text-center text-gray-500 font-bold text-lg "
                                htmlFor="searchfor"
                            >
                                {key}
                            </label>
                            <select
                                // value={searchParams?.using}
                                onChange={(e) => {
                                    if (e.target.value == -1) {
                                        let tmp1 = {};
                                        let tmp2 = {};
                                        tmp1 = searchParams?.where;
                                        delete tmp1[e.target.name];
                                        setSearchParams({
                                            ...searchParams,
                                            where: { ...tmp2 },
                                        });
                                        setchanged(true);
                                        throttle();
                                    } else {
                                        setSearchParams({
                                            ...searchParams,
                                            where: {
                                                ...searchParams?.where,
                                                [key]: e.target.value,
                                            },
                                        });
                                    }
                                    // console.log(searchParams?.where);
                                }}
                                className=" py-1 px-2 bg-blue-200 rounded-md "
                                name={key}
                                id={key}
                            >
                                {whereCols[searchParams?.searchfor][key].map(
                                    (obj, ind) => (
                                        <option
                                            key={
                                                obj?.en
                                                    ? obj?.en + ind
                                                    : obj?.name + ind
                                            }
                                            value={
                                                obj?.id
                                                    ? obj?.id
                                                    : obj?.idregion
                                            }
                                        >
                                            {obj?.en ? obj?.en : obj?.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )
                )}
            </div>
        ) : null;
    }
    function rowClick(rowObject, uselessdata, objj = null) {
        console.log(rowObject, uselessdata, objj);
        // if (!objj) return;
        switch (searchParams?.searchfor) {
            case "0":
                openModal(rowObject.idcar, "carwindow");
                // setInfo({...infoo,idcar:rowObject.idcar})
                // navigate("/advancedsearch?carid=" + objj?.car_id);
                // openCloseModal("car");

                break;
            case "1":
                openModal(rowObject.idclient, "clientwindow");
                // setInfo({...infoo,clientId:rowObject.idcar})
                // navigate("/advancedsearch?ownerid=" + objj?.owner_id);
                // openCloseModal("owner");
                break;
            case "2":
                // navigate("/advancedsearch");
                // openCloseModal(objj?.job_id);
                break;

            default:
                break;
        }
    }
    // function openCloseModal(state) {
    //     if (state) {
    //         // navigate("?carid=" + state);
    //         setShowWindow(state);
    //         document.getElementById("tempModal").showModal();
    //         return;
    //     }
    //     setShowWindow(0);
    //     document.getElementById("tempModal").close();
    //     navigate("/advancedsearch");
    // }
    return (
        <div className=" advancedsearch max-md:absolute inset-0 z-50 bg-slate-100  ">
            <div
                style={{ gridTemplateColumns: "min-content auto" }}
                className="search parametrs grid  grid-cols-2 gap-2 h-full"
            >
                <div className=" border-r border-r-gray-500">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-red-400 w-full h-12 text-2xl"
                    >
                        EXIT
                    </button>

                    <div className="border">
                        <label
                            className="block text-center font-bold text-xl "
                            htmlFor="searchfor"
                        >
                            Search For
                        </label>
                        <select
                            value={searchParams?.searchfor}
                            onChange={(e) => {
                                setSearchParams({
                                    ...searchParams,
                                    searchfor: e.target.value,
                                    where: {},
                                    searchValue: "",
                                });
                            }}
                            className=" py-1 px-2 bg-blue-200 rounded-md "
                            name="searchfor"
                            id="searchfor"
                        >
                            {/* <option value="" disabled>
                                Select here
                            </option> */}
                            {searchForOptions.map((val, ind) => (
                                <option key={val + ind} value={ind}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>
                    {render_using()}
                    {render_where()}
                </div>
                <div className=" max-h-screen overflow-auto">
                    <div className="search-box z-50 grid  sticky top-0 ">
                        <div className="m-1 relative  mx-auto  rounded-full  ">
                            <div className="grid absolute top-0 left-0 -translate-y-1/2">
                                <img
                                    onClick={() =>
                                        document
                                            .getElementById("searchValue")
                                            .focus()
                                    }
                                    className=" h-7 opacity-40 p-1  "
                                    src="/public/images/search.svg"
                                    alt="search"
                                />
                            </div>
                            <input
                                autoCapitalize="off"
                                autoCorrect="off"
                                autoFocus
                                autoComplete="off"
                                pattern="[A-Za-z0-9()_\-,. ]*"
                                type="text"
                                placeholder={`Search ${
                                    searchForOptions[searchParams?.searchfor]
                                } here`}
                                value={searchParams?.searchValue}
                                onChange={(e) => {
                                    setSearchParams({
                                        ...searchParams,
                                        searchValue: e.target.value,
                                    });
                                    throttle();
                                }}
                                className=" py-2 pl-8 pr-10 bg-green-100 m-0 border w-80 max-md:w-60 border-blue-800  rounded-full "
                                name="searchValue"
                                id="searchValue"
                            />
                            <div className="grid absolute  right-[1px] place-y-center">
                                <button
                                    onClick={() => {
                                        throttle();
                                        document
                                            .getElementById("searchValue")
                                            .focus();
                                    }}
                                    className=" grid place-items-center rounded-full bg-blue-800 mr-[2px] font-bold text-white p-0   m-0 pr-0  right-0 w-7 h-7  "
                                >
                                    GO
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="search-result grid">
                        {list ? (
                            <div className=" overflow-auto">
                                <BasicTable
                                    rowObjectUP={rowClick}
                                    colIndex={0}
                                    data={list}
                                />
                            </div>
                        ) : load ? (
                            <div className="bg-blue-200 p-1">searching ...</div>
                        ) : (
                            <div className="bg-red-200 p-1">
                                start typing to see results !
                            </div>
                        )}
                    </div>
                    <br />
                    <>
                        <BasicDialog id="clientwindow">
                            {infoo.clientId && (
                                <RenderClient
                                    clientid={infoo.clientId}
                                    key={infoo.clientId}
                                />
                            )}
                        </BasicDialog>
                        <BasicDialog id="carwindow">
                            {infoo.idcar && (
                                <RenderCar
                                    key={infoo?.idcar}
                                    idcar={infoo?.idcar}
                                />
                            )}
                        </BasicDialog>
                        <FoldedSection title="recent clients">
                            <RenderClients openClient={openModal} />
                        </FoldedSection>
                        <br />
                        <FoldedSection title="recent cars">
                            <RenderCars
                                openCar={(id) => {
                                    openModal(id, "carwindow");
                                }}
                            />
                        </FoldedSection>
                    </>
                </div>
            </div>
        </div>
    );
}
