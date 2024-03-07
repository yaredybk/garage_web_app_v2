import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import IconSmall from "../../components/IconSmall.jsx";

export default function AdvancedSearch({}) {
    const { typein } = useParams();
    const [infoo, setInfo] = useState({
        clientId: null,
        idcar: null,
        client: {},
        car: {},
    });
    function openModaltmp(id, modalid, datain) {
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setInfo({ ...infoo, idcar: id, ...datain });
        else setInfo({ ...infoo, clientId: id, ...datain });
        openCloseModal(idd, "open");
    }
    const { list_region, list_carmake } = useContext(GlobalState);
    const { load } = useContext(LoadingState);
    const navigate = useNavigate();
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
            region: [
                { val: "all" },
                ...list_region?.map((obj) => {
                    return { val: obj?.en };
                }),
            ],
            make: [
                { val: "all" },
                ...list_carmake?.map((obj) => {
                    return { val: obj.make };
                }),
            ],
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
        searchfor: searchForOptions.findIndex((val) => val == typein) || "0",
        // searchfor:"0",
        searchValue: "",
        using: "0",
        where: {},
    });
    const [list, setlist] = useState(null);
    const [waiting, setwaiting] = useState(0);
    const [changed, setchanged] = useState(true);
    async function advanced_search() {
        advanced_search_1({ ...searchParams })
            .then(setlist)
            .catch((err) => {
                console.warn(err);
            });
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
            if (changed || waiting === 1)
                // if (searchParams?.searchValue != "") {
                advanced_search();
            else if (waiting !== 0) setwaiting(0);
        // } else {
        // setwaiting(0);
        // }
    }, [waiting]);
    function render_using() {
        return searchParams?.searchfor ? (
            <div className="pt-2 grid border-black  border-t-4">
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
                        focusSearch();
                    }}
                    className=" py-1 px-2 bg-blue-200 rounded-md "
                    name="using"
                    id="using"
                >
                    {usingOptions[searchParams?.searchfor]?.map((val, ind) => (
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
            <div className="pt-2 grid border-black bg-slate-400 border-t-4">
                <span
                    className="block text-center font-bold text-xl "
                    htmlFor="searchfor"
                >
                    Where
                </span>
                {Object.keys(whereCols[searchParams?.searchfor] || {})?.map(
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
                                onChange={(e) => {
                                    let { name, value } = e.target;
                                    if (value == -1 || value == "all") {
                                        let tmp1 = {};
                                        tmp1 = searchParams?.where;
                                        delete tmp1[name];
                                        setSearchParams({
                                            ...searchParams,
                                            where: { ...tmp1 },
                                        });
                                        setchanged(true);
                                        throttle();
                                    } else {
                                        setSearchParams({
                                            ...searchParams,
                                            where: {
                                                ...searchParams?.where,
                                                [name]: value,
                                            },
                                        });
                                        setchanged(true);
                                        throttle();
                                    }
                                    focusSearch();
                                }}
                                className=" py-1 px-2 bg-blue-200 rounded-md "
                                name={key}
                                id={key}
                            >
                                {whereCols[searchParams?.searchfor][key]?.map(
                                    (obj, ind) => (
                                        <option
                                            key={
                                                key +
                                                searchParams?.searchfor +
                                                ind
                                            }
                                            value={obj?.val}
                                        >
                                            {obj?.val}
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
    function rowClick(rowObject) {
        // console.log(rowObject, uselessdata, objj);
        // if (!objj) return;
        if (searchParams?.searchfor == 0) {
            openModaltmp(rowObject.idcar, "carwindow", { car: rowObject });
        }
        if (searchParams?.searchfor == 1) {
            openModaltmp(rowObject.idclient, "clientwindow", {
                client: rowObject,
            });
        }
    }
    const [hidesidemenu, sethidesidemenu] = useState(null);
    function focusSearch() {
        document.getElementById("searchValue")?.focus();
    }
    return (
        <main className=" advancedsearch max-md:absolute inset-0 z-50 bg-slate-100 dark:bg-gray-800  ">
            <div className="search-box  flex gap-1 z-50   sticky top-0 ">
                <div className="hidden max-md:block">
                    <button
                        onClick={() => sethidesidemenu(!hidesidemenu)}
                        className="bg-blue-400    "
                    >
                        <IconSmall
                            style={{
                                transform: hidesidemenu
                                    ? "rotate(270deg)"
                                    : "rotate(90deg)",
                            }}
                            src="/public/images/arrowdobledown.svg"
                        />
                    </button>
                </div>
                <div className="m-1 relative bg-blue-800 gap-1  flex  items-center  mx-auto  rounded-full  ">
                    <img
                        onClick={focusSearch}
                        className=" h-7 -mr-8 opacity-40 p-1  "
                        src="/public/images/search.svg"
                        alt="search"
                    />
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
                            sethidesidemenu(true);
                        }}
                        className=" py-2 pl-8 pr-10 bg-green-100 dark:bg-gray-500 m-0 border w-80 max-md:w-60 max-sm:w-48 border-blue-800  rounded-full "
                        name="searchValue"
                        id="searchValue"
                    />

                    <IconSmall
                        onClick={() => {
                            throttle();
                            focusSearch();
                        }}
                        className=" h-8   rounded-full bg-blue-800 m-0 p-1 "
                        src="/public/images/arrowright.png"
                    />
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="bg-red-400   text-xl"
                >
                    <IconSmall src="/public/images/close.svg" />
                </button>
            </div>
            <div className="flex bg gap-2 p-2 max-md:p-1  ">
                {searchForOptions?.map((val, ind) => {
                    return (
                        <Link
                            role="button"
                            style={{ "--btn-active-bg": "blue" }}
                            key={val}
                            className={
                                searchParams.searchfor == ind
                                    ? "btn bg-blue-700 shadow-md shadow-blue-500 text-white  basis-16 flex-1  text-xl max-md:text-base  "
                                    : "btn hover:bg-blue-700 hover:text-white hover:shadow-blue-500  basis-16 flex-1 text-xl max-md:text-base shadow-md shadow-gray-500"
                            }
                            onClick={() => {
                                setSearchParams({
                                    ...searchParams,
                                    searchfor: `${ind}`,
                                    where: {},
                                    searchValue: "",
                                });
                                focusSearch();
                            }}
                            to={`/nav/search/${val}`}
                            replace
                        >
                            {val}
                        </Link>
                    );
                })}
            </div>
            <div
                style={{ gridTemplateColumns: "min-content auto" }}
                className="search parametrs grid  grid-cols-2 gap-2 h-full"
            >
                <div
                    className={
                        hidesidemenu
                            ? "max-md:w-2 overflow-x-hidden transition-all "
                            : "transition-all border-r border-r-gray-500 "
                    }
                >
                    <div className="border hidden">
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
                            {searchForOptions?.map((val, ind) => (
                                <option key={val + ind} value={ind}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>
                    {render_using()}
                    {render_where()}
                </div>
                <div className=" max-h-screen  overflow-auto">
                    <div className="search-result grid">
                        {list ? (
                            <div className=" overflow-auto">
                                <BasicTable
                                colsin = {["code","region","make","model","name","phoneno"]}
                                    rowObjectUP={rowClick}
                                    colIndex={0}
                                    data={list}
                                />
                            </div>
                        ) : load ? (
                            <div className="bg-blue-200 p-1">searching ...</div>
                        ) : (
                            <div className="bg-red-600 p-1">
                                start typing to see results !
                            </div>
                        )}
                    </div>
                    <br />
                    <>
                        <BasicDialog id="clientwindow">
                            {infoo.clientId && (
                                <RenderClient
                                    clientinfoin={infoo.client}
                                    clientid={infoo.clientId}
                                    key={infoo.clientId}
                                />
                            )}
                        </BasicDialog>
                        <BasicDialog id="carwindow">
                            {infoo.idcar && (
                                <RenderCar
                                    carinfoin={infoo.car}
                                    key={infoo?.idcar}
                                    idcar={infoo?.idcar}
                                />
                            )}
                        </BasicDialog>
                    </>
                </div>
            </div>
        </main>
    );
}
