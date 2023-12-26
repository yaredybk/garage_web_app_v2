import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RenderCar from "../../features/cars/RenderCar";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import RenderClient from "../../features/clients/RenderClient";
import FoldedSectionFlex from "../../components/FoldedSectionFlex";
import BigCarImage from "./BigCarImage";
import { GlobalState } from "../../context/GlobalContext";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import BasicDataList from "../../components/data/BasicDatalist";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
// import BreakLine from "../../components/BreakLine";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import FoldedSection from "../../components/FoldedSection";
// import OverFlowContainer from "../../components/OverFlowHidden";
import OverFlowAuto from "../../components/OverFlowAuto";
import IconSmall from "../../components/IconSmall";
import xaxios from "../../utils/xaxios";
import "../../App.css";
import BigCarImagePrint from "./BigCarImagePrint";
import { LoadingState } from "../../context/LoadingContext";
import { BreakLine2 } from "../job/ManageJob";
import RenderPlate2 from "../../components/RenderPlate2";

export default function NewCheckIn() {
    const { id } = useParams();
    const { data, refetchData } = useEffectStateSingleData(
        "/api/getsingle/checkin/" + id
    );
    let obj1 = {};
    const [newdefectinfo, setNewdefectinfo] = useState({ partid: null });
    const [listofDefects, setListofDefects] = useState([]);
    function editListOfDefects(data, ind, action) {
        // if (action == "add" || action == "new") {
        //     return setListofDefects([...listofDefects, data]);
        // }
        if (action === "remove" || action === "delete") {
            if (isNaN(ind)) return alert("invalid index");
            let listtmp = listofDefects;
            listtmp.splice(ind, 1);
            setListofDefects(listtmp);
            setNoteSaved(true);
        } else if (data) {
            setListofDefects([...listofDefects, data]);
            setNoteSaved(true);
        }
        openCloseModal("all", "close");
    }
    const { list_carbodyparts } = useContext(GlobalState);
    const [jobinfo, setJobinfo] = useState({
        idcar: null,
        idjob: null,
        idclient: null,
        odo: null,
        created: null,
        finished: null,
        total: null,
        unpaid: null,
        duedate: null,
    });
    const [noteSaved, setNoteSaved] = useState(false);
    const [compData, setCompData] = useState({});
    function getComponentData(compname, data) {
        setCompData({ ...compData, [compname]: data });
    }
    useEffect(() => {
        setTimeout(() => {
            const temp = document.getElementById("checkin_details");
            temp?.removeAttribute("open");
        }, 2000);
    
      return () => {
        
      }
    }, [])
    
    useEffect(() => {
        if (data && data[0]) {
            // console.log(data);
            setJobinfo({ ...jobinfo, ...data[0] });
            setListofDefects(data[0].checkin ? data[0].checkin : []);
        }
    }, [data]);
    const { load, setLoad } = useContext(LoadingState);
    function removeDefect(ind) {
        let li1 = listofDefects;
        let removed = li1.splice(ind, 1);
        // console.log(removed);
        setNewdefectinfo(removed[0]);
        openCloseModal("addnewdefect", "open");
        setListofDefects([...li1]);
        setNoteSaved(true);
    }
    function uploadDefects() {
        setLoad(true);
        // console.log(listofDefects);
        xaxios.post("/api/update/checkin/" + id, listofDefects).then((res) => {
            // console.log(res);
            refetchData();
            setNoteSaved(false);
        });
    }
    // default return
    return (
        <div className=" max-w-4xl mx-auto bg-white bg-opacity-25 pb-10">
            <div className="  printgrid   px-1 min-[1024px]:px-4  grid  grid-cols-[min-content,auto] max-md:grid-cols-1  max-w-[24cm] print:grid-cols-[min-content,auto] mx-auto  ">
                <details
                    open
                    id="checkin_details"
                    className="  mb-4 job_info bg-blue-100 bg-opacity-90  print:bg-transparent 2  col-span-full "
                >
                    <summary className=" p-1 bg-blue-400 tracking-widest text-white font-bold text-sm -mx-2">
                        checkin details
                        <b className=" px-2 ">( checkin ID: {id} )</b>
                    </summary>
                    <div className=" flex flex-wrap items-center justify-around gap-2  col-span-full">
                        <div className="bg-gray-300 w-1  h-full  max-md:hidden"></div>
                        <div className="bg-gray-300 w-1  h-full  max-md:hidden"></div>
                    </div>
                    <span className="grid grid-cols-2 max-sm:grid-cols-1">
                        {jobinfo.idcar && (
                            <RenderPlate2
                                uploadData={(data) => {
                                    getComponentData("car", data);
                                }}
                                minimal={true}
                                nobuttons={true}
                                carid={jobinfo.idcar}
                            />
                        )}
                        {jobinfo.idclient && (
                            <RenderClient
                                uploadData={(data) => {
                                    getComponentData("client", data);
                                }}
                                minimal={true}
                                clientid={jobinfo.idclient}
                            />
                        )}
                    </span>
                </details>
            </div>

            {/* <BigCarImagePrint defectsListin={listofDefects} /> */}
            <div
                // className=" grid grid-cols-2"
                className=" items-start bg-white  p-1 px-0 rounded-t-md grid print:grid-cols-2 max-[500px]:grid-cols-1 grid-cols-2 gap-2"
            >
                {/* <legend className=" ml-4 px-2">Check List</legend> */}
                <OverFlowAuto className=" grid ">
                    <table className="defectstable  " border={1}>
                        <thead>
                            <tr>
                                <th>{/* <RenderCheckBox val={-1} /> */}</th>
                                <th>part</th>
                                <th>position</th>
                                <th>defect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listofDefects?.map(
                                (obj, ind) =>
                                    ind <= listofDefects.length / 2 && (
                                        <RenderFualt
                                            onClick={() => removeDefect(ind)}
                                            key={ind + obj?.id}
                                            defetData={obj}
                                        />
                                    )
                            )}
                        </tbody>
                    </table>
                </OverFlowAuto>
                {listofDefects?.length > 2 && (
                    <OverFlowAuto className=" grid ">
                        <table className="defectstable  " border={1}>
                            <thead>
                                <tr>
                                    <th>{/* <RenderCheckBox val={-1} /> */}</th>
                                    <th>part</th>
                                    <th>position</th>
                                    <th>defect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listofDefects?.map(
                                    (obj, ind) =>
                                        ind > listofDefects.length / 2 && (
                                            <RenderFualt
                                                onClick={() =>
                                                    removeDefect(ind)
                                                }
                                                key={ind + obj?.id}
                                                defetData={obj}
                                            />
                                        )
                                )}
                            </tbody>
                        </table>
                    </OverFlowAuto>
                )}
            </div>
            <br />
            <span className="  grid grid-cols-2 mx-auto max-w-xl gap-2 px-1">
                <ButtonSubmit
                    type="button"
                    onClick={() => openCloseModal("tableselect")}
                >
                    <img
                        className=" max-h-full"
                        src={"/public/images/plus.svg"}
                    />
                    Add new defect #TABLE
                </ButtonSubmit>
                <ButtonSubmitRed
                    type="button"
                    onClick={() => openCloseModal("bigcarimage")}
                >
                    <img
                        className=" max-h-full"
                        src={"/public/images/plus.svg"}
                    />
                    Add new defect #IMAGE
                </ButtonSubmitRed>
            </span>
            <ButtonSubmit
                onClick={uploadDefects}
                type="button"
                disabled={!noteSaved}
                className={
                    noteSaved
                        ? " animate-ping-1  min-w-[9rem] justify-center bg-green-400 m-4 text-2xl mx-auto "
                        : "  min-w-[9rem] justify-center bg-green-400 m-4 text-2xl mx-auto "
                }
            >
                <img height="20px" src={"/public/images/upload2.svg"} />
                Save
            </ButtonSubmit>
            <BreakLine2 />
            <BasicDialog id="bigcarimage">
                <BigCarImage
                    onClickUp={handleBodyPartClick}
                    carTypein="sedan"
                    editMode={false}
                />
            </BasicDialog>
            <BasicDialog id="tableselect">
                <BigCarImage
                    tableOnly={true}
                    onClickUp={handleBodyPartClick}
                    carTypein="sedan"
                    editMode={false}
                />
            </BasicDialog>
            <BasicDialog id="addnewdefect">
                <EditDefect
                    key={newdefectinfo?.partid}
                    datadown={newdefectinfo}
                    dataup={editListOfDefects}
                />
            </BasicDialog>
            <br />
        </div>
    );
    function handleBodyPartClick(partid) {
        const tmpbody = list_carbodyparts?.find((obj1) => obj1.id == partid);
        setNewdefectinfo(tmpbody);
        // openCloseModal("all", "close");
        openCloseModal("addnewdefect");
    }
}
export function EditDefect({ datadown, dataup = () => null }) {
    if (!datadown.bodyname) return <h1>NO BODY NAME PROVIDED</h1>;
    const [newDefetData, setNewDefetData] = useState({
        // -1:not checked , 0:missing , 1:present
        status: datadown.status ? datadown.status : -1,
        bodyname: datadown.bodyname,
        id: datadown.id,
        positions: datadown.positions ? datadown.positions : [],
        defects: datadown.defects ? datadown.defects : [],
        dataversion: 1,
    });
    const statusValueList = [
        [-1, "not checked", <> &#10067;</>, " bg-yellow-400 p-1 rounded-md"],
        [0, "missing", <>&#10006;</>, " bg-red-400 p-1 rounded-md"],
        [1, "present", <>&#10004;</>, " bg-green-400 p-1 rounded-md"],
    ];
    const positionList = [
        "front",
        "rear",
        "LHS",
        "RHS",
        "middle",
        "all",
        "top",
        "bottom",
        "and",
    ];
    const defectList = [
        "scrached",
        "dented",
        "broken",
        "not functioning",
        "cracked",
        "missing",
        "full",
        "empty",
        "high",
        "medium",
        "low",
    ];
    useEffect(() => {
        setNewDefetData({
            status: datadown.status ? datadown.status : -1,
            bodyname: datadown.bodyname,
            id: datadown.id,
            positions: datadown.positions ? datadown.positions : [],
            defects: datadown.defects ? datadown.defects : [],
            dataversion: 1,
        });
    }, [datadown]);

    function clearFunction(inputid) {
        const vall = document.getElementById(inputid);
        const namee = vall.name;
        if (vall.value === "") {
            return setNewDefetData({ ...newDefetData, [namee]: [] });
        }
        vall.value = "";
    }
    function addFunction(inputid, namein, valin) {
        const vall = inputid && document.getElementById(inputid);
        const namee = namein ? namein : vall.name;
        const valuee = valin ? valin : vall.value;
        const present = newDefetData[namee]?.find((str) => str === valuee);
        if (present) return alert(valuee + " already reistered!");

        const newDefects = [...newDefetData[namee], valuee];
        setNewDefetData({
            ...newDefetData,
            [namee]: newDefects,
        });
        if (vall) vall.value = "";
    }
    function uploadData(e) {
        e.preventDefault();
        // console.log(newDefetData);
        setNewDefetData({ ...newDefetData, positions: [], defects: [] });
        dataup(newDefetData);
    }
    return (
        <div>
            <div className="flex gap-4 mx-auto items-center justify-center my-1">
                <b className=" text-red-500">{datadown.bodyname}</b>
                <select
                    onChange={(e) => {
                        setNewDefetData({
                            ...newDefetData,
                            status: Number(e.target.value),
                        });
                    }}
                    value={newDefetData.status}
                    className={statusValueList[newDefetData.status + 1][3]}
                >
                    {statusValueList.map((subarra) => (
                        <option key={subarra[0]} value={subarra[0]}>
                            {subarra[2]}&nbsp;&nbsp;
                            {subarra[1]}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-3 gap-1 px-1">
                {newDefetData.status == -1 &&
                    statusValueList.map((subarra) => (
                        <button
                            onClick={(e) => {
                                setNewDefetData({
                                    ...newDefetData,
                                    status: subarra[0],
                                });
                            }}
                            className={subarra[3]}
                            key={subarra[0]}
                            value={subarra[0]}
                        >
                            {subarra[2]}&nbsp;&nbsp;
                            {subarra[1]}
                        </button>
                    ))}
            </div>
            {newDefetData.status !== -1 && (
                <div className="grid p-1 gap-1">
                    <OverFlowAuto className=" grid ">
                        <table className="defectstable" border={1}>
                            <thead>
                                <tr>
                                    <th>status</th>
                                    <th>part</th>
                                    <th>position</th>
                                    <th>defect</th>
                                </tr>
                            </thead>
                            <tbody>
                                <RenderFualt defetData={newDefetData} />
                            </tbody>
                        </table>
                    </OverFlowAuto>
                    <div className="grid grid-cols-2 max-sm:grid-cols-1">
                        <fieldset className="flex gap-1 flex-wrap p-1 m-0">
                            <legend>Posisions</legend>
                            {positionList.map((val, ind) => (
                                <button
                                    onClick={() =>
                                        addFunction(null, "positions", val)
                                    }
                                    type="button"
                                    className=" bg-purple-800 text-white justify-center  p-2  flex-grow basis-1/5 text-center "
                                    key={"pos" + val}
                                >
                                    {val}
                                </button>
                            ))}
                            <button
                                className=" bg-red-600 justify-center  p-2  flex-grow basis-1/5 text-center "
                                type="button"
                                onClick={() => clearFunction("positions")}
                            >
                                clear
                            </button>
                        </fieldset>
                        <fieldset className="flex gap-1 items-stretch flex-wrap p-1 m-0">
                            <legend>Defects</legend>
                            {defectList.map((val, ind) => (
                                <button
                                    onClick={() =>
                                        addFunction(null, "defects", val)
                                    }
                                    type="button"
                                    className=" bg-purple-800 text-white justify-center  p-2  flex-grow basis-1/5 text-center "
                                    key={"pos" + val}
                                >
                                    {val}
                                </button>
                            ))}
                            <button
                                className=" bg-red-600 justify-center  p-2  flex-grow basis-1/5 text-center "
                                type="button"
                                onClick={() => clearFunction("defects")}
                            >
                                clear
                            </button>
                        </fieldset>
                    </div>
                    <form onSubmit={uploadData}>
                        <FoldedSection title="NEW DEFECT FORM">
                            <div className="grid gap-1 ">
                                <InputContainer title="position">
                                    <span className="flex gap-3 items-center">
                                        <input
                                            list="positionslist"
                                            size={10}
                                            type="text"
                                            name="positions"
                                            id="positions"
                                            pattern="[a]{0}"
                                            title="add or clear input field"
                                        />
                                        <BasicDataList
                                            id="positionslist"
                                            list={positionList}
                                        />
                                        <ButtonSubmitRed
                                            type="button"
                                            onClick={() =>
                                                clearFunction("positions")
                                            }
                                        >
                                            clear
                                        </ButtonSubmitRed>
                                        <ButtonSubmit
                                            type="button"
                                            onClick={() =>
                                                addFunction("positions")
                                            }
                                        >
                                            add
                                        </ButtonSubmit>
                                    </span>
                                </InputContainer>
                            </div>
                            <div className="grid gap-1 ">
                                <InputContainer
                                    title="defects"
                                    htmlFor="defects"
                                >
                                    <span className="flex gap-3 items-center">
                                        <input
                                            list="defectslist"
                                            size={10}
                                            type="text"
                                            name="defects"
                                            id="defects"
                                            pattern="[a]{0}"
                                            title="add or clear input field"
                                        />
                                        <BasicDataList
                                            id="defectslist"
                                            list={defectList}
                                        />
                                        <ButtonSubmitRed
                                            type="button"
                                            onClick={() =>
                                                clearFunction("defects")
                                            }
                                        >
                                            clear
                                        </ButtonSubmitRed>
                                        <ButtonSubmit
                                            type="button"
                                            onClick={() =>
                                                addFunction("defects")
                                            }
                                        >
                                            add
                                        </ButtonSubmit>
                                    </span>
                                </InputContainer>
                            </div>
                        </FoldedSection>
                        <br />
                        <span className="grid mx-auto  w-full max-w-md ">
                            <ButtonSubmit className=" bg-blue-400 p-5">
                                &#10004; APPEND ! &#10004;
                            </ButtonSubmit>
                        </span>
                    </form>
                </div>
            )}
        </div>
    );
}
function RenderCheckBox({ val }) {
    let urll = "";
    switch (val) {
        case -1:
            urll = "/public/images/checkbox-unchecked.svg";
            break;
        case 0:
            urll = "/public/images/close-rect.svg";
            break;
        case 1:
            urll = "/public/images/checkbox-checked.svg";
            break;

        default:
            break;
    }
    return (
        <img
            className=" h-7 -my-2 bg-cover object-cover border-none"
            src={urll}
        />
    );
}
export function RenderFualt({ defetData, ...props }) {
    return (
        defetData && (
            <tr
                {...props}
                className={
                    defetData.status === 0 ? "bg-red-200 px-2  " : " px-2  "
                }
            >
                <td>
                    <RenderCheckBox val={defetData.status} />
                </td>
                <td className=" px-1">{defetData.bodyname}</td>
                <td className=" px-1">
                    <span className="">
                        {defetData.positions &&
                            defetData.positions?.map((strr, ind) => (
                                <span key={strr + "pos"}>{strr} </span>
                            ))}
                    </span>
                </td>
                <td className="  gap-1 px-1 ">
                    <span className=" separatebycoma">
                        {defetData.defects &&
                            defetData.defects?.map((strr, ind) => (
                                <span key={strr + "defect"}>{strr}</span>
                            ))}
                    </span>
                </td>
            </tr>
        )
    );
}
