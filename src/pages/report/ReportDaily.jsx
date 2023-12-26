import { useContext, useEffect, useState } from "react";
import ReportTable from "../../components/tables/ReportTable";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import PrintButton from "./../../components/button/PrintButton";
import { LoadingState } from "../../context/LoadingContext";
import { json, useNavigate } from "react-router-dom";
import { openCloseMiniPop } from "../../utils/userInterface";
import "./report.css";
import xaxios from "../../utils/xaxios";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { _utilFunction } from "../../utils/_utilFunctions";
import IconSmall from "../../components/IconSmall";
const sendtobutton = localStorage.getItem("username") !== "daniel";
export default function ReportDaily() {
    let curloc = new URL(document.location.href);
    let today = _utilFunction.today();
    let rr = curloc.searchParams.get("range") || "number";
    let vv = curloc.searchParams.get("value") || (rr == "number" ? 0 : today);
    const [info, setInfo] = useState({
        date: rr == "number" ? today : vv,
        range: rr || "number",
        value: vv || "0",
        number: rr == "number" ? vv : null,
        idmax: 0,
    });
    const reportdata = useEffectStateSingleData(
        `/api/getlist/report/transactions?range=${info.range}&value=${info.value}`
    );
    function sendReportDataToAdmin() {
        xaxios
            .post(
                `/api/getlist/report/sendtoadmin?date=${info.date}&range=${info.range}`
            )
            .then((res) => {
                alert("data sent to admin");
            })
            .catch((err) => {
                console.warn(err);
                alert("FAILED !!!");
            });
    }
    const [filteredInternal, setFilteredInternal] = useState(null);
    const [filteredAgent, setFilteredAgent] = useState(null);
    const [filteredEmployee, setFilteredEmployee] = useState(null);
    const [filteredAll, setFilteredAll] = useState(null);
    const [filter, setfilter] = useState(
        JSON.parse(
            localStorage.getItem("reportFilter") ||
                JSON.stringify({
                    all: { name: "all", show: true },
                    general: { name: "general", show: true },
                    internal: { name: "internal", show: true },
                    employee: { name: "employee", show: true },
                    agent: { name: "agent", show: true },
                })
        )
    );
    const [expanded, setExpanded] = useState(
        localStorage.getItem("reportExpanded") || "retracted"
    );
    useEffect(() => {
        if (!reportdata.data) return;
        const { payLoad, reportinfo } = reportdata.data;
        // console.log(datatmp);
        if (payLoad) {
            let name = ["tmp"];
            let internaldata = {};
            payLoad?.internal.forEach((arra, ind) => {
                let nn = arra[1] == "admin" ? "secretary" : arra[1];
                if (nn)
                    if (name.includes(nn)) {
                        internaldata[nn].push(arra);
                    } else {
                        name.push(nn);
                        internaldata[nn] = [arra];
                    }
                // if (ind + 1 >= payLoad?.internal?.length) {
                //     setFilteredInternal(internaldata);
                // }
            });
            if (Object.keys(internaldata)?.length)
                setFilteredInternal(internaldata);
            else setFilteredInternal(null);
            setFilteredEmployee(payLoad.employee);
            setFilteredAgent(payLoad.agent);
            setFilteredAll(payLoad.all);
            if (localStorage.getItem("status") === "local")
                openCloseMiniPop("latest report", "open", "green");
        }
        if (reportinfo) {
            setInfo({ ...info, ...reportinfo });
        }
        // else console.warn("invalid report data");
    }, [reportdata.data]);
    const navigate = useNavigate();
    function handleRowClick(rowArra) {
        if (Array.isArray(rowArra))
            if (rowArra[rowArra.length - 1])
                navigate("/nav/job/" + rowArra[rowArra.length - 1]);
    }
    const { load, setLoad } = useContext(LoadingState);
    function onChangeFilter(e) {
        let { name, value } = e.target;
        if (name == "range" && value == "number") {
            setInfo({ ...info, [name]: value, value: info.number });
            alterSearchQuery(name, value);
            alterSearchQuery("value", info.number);
        } else if (name == "range") {
            alterSearchQuery(name, value);
            alterSearchQuery("value", info.date);
            setInfo({ ...info, [name]: value, value: info.date });
        } else {
            setInfo({ ...info, [name]: value, value });
            alterSearchQuery("value", value);
        }
    }
    function alterSearchQuery(name, value) {
        let tmploc = new URL(document.location.href);
        if (tmploc.searchParams.has(name)) tmploc.searchParams.set(name, value);
        else tmploc.searchParams.append(name, value);
        window.history.replaceState(null, document.title, tmploc);
    }
    function onFilterClick(e) {
        let { name, checked } = e.target;
        if (name === "all") {
            let tmp = {
                all: { name: "all", show: checked },
                general: { name: "general", show: checked },
                internal: { name: "internal", show: checked },
                employee: { name: "employee", show: checked },
                agent: { name: "agent", show: checked },
            };
            localStorage.setItem("reportFilter", JSON.stringify(tmp));
            setfilter(tmp);
        } else {
            let tmp = {
                ...filter,
                [name]: { name, show: checked },
                all: { name, show: false },
            };
            setfilter(tmp);
            localStorage.setItem("reportFilter", JSON.stringify(tmp));
        }
    }
    return (
        <div
            id="report_page"
            className={
                "  grid  gap-2  py-2     max-w-[30cm] print:w-full  mx-auto " +
                expanded
            }
            // <div className=" bg-white  gap-2   p-1 grid static printgrid colsminauto grid-cols-[min-content,1fr] max-md:grid-cols-1   print:max-w-[95wv] print:grid-cols-[min-content,auto]    ">
        >
            <div className=" print:justify-center flex gap-2 items-center justify-center  col-span-full flex-wrap   w-fit mx-auto text-center ">
                <h2>REPORT : </h2>
                <select
                    className=" text-xl h-9"
                    name="range"
                    id="range"
                    onChange={onChangeFilter}
                    value={info.range}
                >
                    {["number", "day", "week", "month"].map((rr) => (
                        <option key={rr} value={rr}>
                            {
                                {
                                    number: "number",
                                    day: "daily",
                                    week: "weekly",
                                    month: "monthly",
                                }[rr]
                            }
                        </option>
                    ))}
                </select>
                <select
                    className=" text-xl h-9"
                    name="number"
                    id="number"
                    onChange={onChangeFilter}
                    value={info.number}
                    disabled={info.range != "number"}
                >
                    <option value="0">0</option>
                    {[...Array(Math.min(20, info?.idmax))].map((num, ind) => (
                        <option
                            key={info?.idmax - ind}
                            value={info?.idmax - ind}
                        >
                            {info?.idmax - ind}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    className=" text-xl  h-8 "
                    name="date"
                    id="date"
                    disabled={info.range == "number"}
                    onChange={onChangeFilter}
                    value={info.date}
                />
            </div>

            {/* {filter.general.show && (
                <CustomRenderTable
                    handleRowClick={handleRowClick}
                    datain={filteredAll}
                    accountInfo={{ name: "general" }}
                />
            )} */}
            {filteredInternal ? (
                <>
                    {filteredInternal.secretary && (
                        <CustomRenderTable
                            handleRowClick={handleRowClick}
                            datain={filteredInternal.secretary}
                            accountInfo={{ name: "secretary" }}
                        />
                    )}
                    {/* {filteredInternal.admin && (
                        <CustomRenderTable
                            handleRowClick={handleRowClick}
                            datain={filteredInternal.admin}
                            accountInfo={{ name: "admin" }}
                        />
                    )} */}
                    {/* {filteredInternal.stock && (
                            <CustomRenderTable
                                handleRowClick={handleRowClick}
                                datain={filteredInternal.stock}
                                accountInfo={{ name: "stock" }}
                            />
                        )} */}
                    {/* {filteredInternal.garage && (
                        <CustomRenderTable
                            handleRowClick={handleRowClick}
                            datain={filteredInternal.garage}
                            accountInfo={{ name: "garage" }}
                        />
                    )} */}
                </>
            ) : (
                <div className=" px-4 my-1 bg-red-200 text-red-700  text-left pl-10">
                    NO internal transaction in the range
                </div>
            )}
            {/* {filter.employee.show && (
                <CustomRenderTable
                    handleRowClick={handleRowClick}
                    datain={filteredEmployee}
                    accountInfo={{ name: "employee" }}
                />
            )}
            {filter.agent.show && (
                <CustomRenderTable
                    handleRowClick={handleRowClick}
                    datain={filteredAgent}
                    accountInfo={{ name: "agent" }}
                />
            )} */}
            <div className="  gap-2 items-center grid grid-cols-2 print:hidden col-span-full mx-auto w-fit bg-gray-200 p-2  ">
                {/* {["all", "general", "internal", "employee", "agent"].map(
                    (catt) => {
                        let ff = filter[catt];
                        return (
                            <label className="" key={catt} htmlFor={catt}>
                                <input
                                    checked={ff.show}
                                    // onClick={onFilterClick}
                                    onChange={onFilterClick}
                                    type="checkbox"
                                    name={catt}
                                    id={catt}
                                />
                                {catt}
                            </label>
                        );
                    }
                )} */}
                <label
                    className="bg-white m-1 py-1 px-2   w-fit rounded-md print:hidden"
                    htmlFor="expanded"
                >
                    <input
                        checked={expanded == "expanded"}
                        onChange={(e) => {
                            localStorage.setItem(
                                "ReportExpanded",
                                e.target.checked ? "expanded" : "retracted"
                            );
                            setExpanded(
                                e.target.checked ? "expanded" : "retracted"
                            );
                        }}
                        type="checkbox"
                        name="expanded"
                        id="expanded"
                    />
                    show more
                </label>
                <ButtonSubmit onClick={makeAreport}>
                    {info.range == "number" && info.number == "0"
                        ? "Make a Report"
                        : "goto unreported"}
                </ButtonSubmit>
            </div>
            {sendtobutton && (
                <div className="flex flex-wrap gap-4 print:hidden">
                    <PrintButton />
                    <ButtonSubmit
                        onClick={unduLastTransaction}
                        className=" py-2 m-1  bg-red-300 outline-1 outline outline-red-800 text-red-800 font-bold"
                    >
                        <IconSmall src="/public/images/refresh.svg" />
                        UNDU LAST TRANSACTION
                    </ButtonSubmit>
                    <ButtonSubmit
                        onClick={sendReportDataToAdmin}
                        className=" py-2 m-1  bg-red-200 outline-1 outline outline-red-600 text-red-600 font-bold"
                    >
                        SEND TO ADMIN
                    </ButtonSubmit>
                    <button
                        disabled={load}
                        className="  p-1 bg-green-300   "
                        onClick={() => {
                            reportdata.refetchData();
                        }}
                    >
                        <img
                            className={
                                load ? " animate-spin w-8 h-8" : " w-8 h-8"
                            }
                            src="/public/images/refresh.svg"
                            alt="refresh"
                        />
                    </button>
                </div>
            )}
        </div>
    );
    function unduLastTransaction() {
        let ans = confirm("are you sure, you want to undu last transaction?");
        if (ans) {
            xaxios
                .delete("/api/delete/lasttransaction")
                .then(() => {
                    reportdata.refetchData();
                })
                .catch(console.warn);
        }
    }
    function makeAreport() {
        if (info.range != "number" || info.number != "0") {
            setInfo({ ...info, range: "number", number: 0, value: 0 });
            return;
        }
        let ans = confirm("make a report?");
        if (ans)
            xaxios.post("/api/addnew/report").then(() => {
                navigate(
                    `/nav/report/today?range=number&value=${info.idmax + 1}`
                );
                setInfo({
                    ...info,
                    range: "number",
                    value: info.idmax + 1,
                    number: info.idmax + 1,
                    idmax: info.idmax + 1,
                });
            });
    }
}
function CustomRenderTable({ datain, handleRowClick, accountInfo }) {
    const colNames =
        accountInfo?.name == "general"
            ? ["id", "*", "desc", "plate No", "IN", "EX", "j_id"]
            : ["id", "*", "desc", "plate No", "IN", "EX", "balance", "j_id"];

    return datain ? (
        <ReportTable
            colNames={colNames}
            rowObjectUp={handleRowClick}
            data={datain}
            accountInfo={accountInfo}
        />
    ) : (
        <div className=" px-4 my-1 bg-red-200 text-red-700  text-left pl-10">
            NO <em className=" text-black"> {accountInfo.name} </em>transaction
            in the range
        </div>
    );
}
