import { useContext, useEffect, useState } from "react";
import FoldedSection from "../../components/FoldedSection";
import BasicDialog from "../../components/dialog/BasicDialog";
import IconSmall from "../../components/IconSmall";
import { openCloseModal } from "../../utils/userInterface";
import RenderPlate3 from "../../components/RenderPlate3";
import { Link, useParams } from "react-router-dom";
import carsystems from "./carsystems.json";
import xaxios from "../../utils/xaxios";
import { LoadingState } from "../../context/LoadingContext";
import "./Inspection.css";
import AdvancedForm from "../../components/form/AdvancedForm";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import OverFlowAuto from "../../components/OverFlowAuto";
import InputContainer from "../../components/input/InputContainer";
import BasicDataList from "../../components/data/BasicDatalist";
import Footer from "./Footer";
const inspCols = [
    { name: "system", type: "text" },
    { name: "subsystem", type: "text" },
    { name: "defect", type: "text" },
    { name: "scale", type: "text" },
    { name: "%", type: "number", suffix: " %" },
    { name: "status", type: "text" },
    { name: "recomm...", type: "text" },
    { name: "cost", type: "number", suffix: " birr" },
    { name: "rating", type: "select" },
];
export default function EditInspection() {
    const ratingList = [
        { name: "excellent", color: "purple" },
        { name: "good", color: "blue" },
        { name: "not-good", color: "yellow" },
        { name: "bad", color: "red" },
        { name: "change", color: "red" },
    ];
    const [carInfo, setcarInfo] = useState({
        idcar: undefined,
        region: 2,
        code: 1,
        plate: "00000",
        year: "",
        odo: "",
        seats: "",
        color: "",
        make: "",
        model: "",
    });
    const [activecol, setActivecol] = useState({
        colname: undefined,
        value: undefined,
        system: undefined,
        subsystem: undefined,
        fields: [],
    });
    const [newinsp, setnewinsp] = useState({ ind: 0 });
    const [save, setSave] = useState(false);
    const [inspectionResult, setInspectionResult] = useState([]);
    const [carsystemsfilter, setcarsystemsfilter] = useState([
        ...carsystems.map((obj6) => {
            return { system: obj6.system, enabled: obj6.enabled };
        }),
    ]);
    function openModal(id, modalid) {
        // console.log("carid:", id);
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setcarInfo({ ...carInfo, idcar: id });
        else setcarInfo({ ...carInfo, clientId: id });
        openCloseModal(idd, "open");
    }
    const { id } = useParams();
    const { setLoad } = useContext(LoadingState);
    useEffect(() => {
        xaxios
            .GetData(`/api/getsingle/inspectioninfo_full/${id}`, setLoad)
            .then((data) => {
                let fulljj = data.full_inspectioninfo;
                if (!fulljj) return console.log("no data");
                const { inspection, car = {}, client = {} } = fulljj;
                if (car) setcarInfo(car);
                if (inspection.results)
                    setInspectionResult([...inspection.results]);
                if (inspection.filters)
                    setcarsystemsfilter([...inspection.filters]);
            });
    }, []);
    useEffect(() => {
        document.getElementById(activecol?.colname)?.focus();
    }, [activecol]);

    return (
        <div className="inspection edit">
            <div className="edit-inspection-header grid grid-cols-2 place-items-center bg-purple-200">
                <div>
                    <h1>Inspection </h1>
                    <div className=" bg-gray-400 p-1 w-fit rounded-l-md">
                        N<u>o</u>:{" "}
                        <span className="tiketnumber">
                            {id?.toString()?.padStart(6, "0")}
                        </span>
                    </div>
                </div>
                <RenderPlate3 inspection plateobj={carInfo} />
            </div>
            <div className="systems-list">
                {carsystemsfilter
                    .filter((obj) => obj.enabled)
                    .map((obj1, ind) => (
                        <SectionT1
                            key={obj1.system}
                            ind={ind}
                            title={obj1.system}
                            inspectionResultin={inspectionResult}
                            opensubsystemcolin={opensubsystemcol}
                            addnewresultup={addnewresult}
                        />
                    ))}
            </div>
            <button
                onClick={() => openCloseModal("more systems", "open")}
                className=" bg-red-300 px-10 m-2"
            >
                <IconSmall src="/public/images/add.svg" />
                more systems
                <IconSmall src="/public/images/add.svg" />
            </button>
            <Footer id={id} hide={"Edit"}>
                <SaveButton save={save} />
            </Footer>
            <BasicDialog id="more systems">
                <SystemsSelector />
            </BasicDialog>
            <BasicDialog
                onClose={() => {
                    save_subsystemchange();
                }}
                id="new"
                title={carsystems[newinsp?.ind].system}
            >
                <SubSystemsSelector ind={newinsp?.ind} />
            </BasicDialog>
            <BasicDialog title={activecol.colname} id="edit col">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        save_system_subsystem_colchange();
                    }}
                >
                    <h3>{activecol.colname}</h3>
                    {activecol?.col?.name == "rating" ? (
                        <select
                            name={`${activecol.colname}`}
                            id={`${activecol.colname}`}
                            value={activecol.value || ""}
                            onChange={(e) => {
                                setActivecol({
                                    ...activecol,
                                    value: e.target.value,
                                });
                            }}
                        >
                            <option value=""></option>
                            {ratingList.map((obj9, ind) => (
                                <option value={obj9.name} key={obj9.name}>
                                    {obj9.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            autoFocus
                            name={`${activecol.colname}`}
                            id={`${activecol.colname}`}
                            type={activecol?.col?.type}
                            value={activecol.value || ""}
                            onChange={(e) => {
                                setActivecol({
                                    ...activecol,
                                    value: e.target.value,
                                });
                            }}
                        />
                    )}
                    <br />
                    <div className="grid grid-cols-2 gap-2 p-2">
                        <ButtonSubmit>Save</ButtonSubmit>
                        <ButtonSubmitRed
                            type="button"
                            onClick={() => openCloseModal("edit col", "close")}
                        >
                            Close
                        </ButtonSubmitRed>
                    </div>
                </form>
            </BasicDialog>
            <BasicDialog id="Edit Defect">
                <EditDefect datadown={activecol} dataup={appendDefect} />
            </BasicDialog>
        </div>
    );
    function appendDefect(defectin) {
        // console.log(defectin);
        setSave(1);
        let value = "";
        defectin.positions?.forEach((ele) => {
            value = value.concat(" ", ele);
        });
        value = value.concat(" | ");
        defectin.defects?.forEach((ele) => (value = value.concat(" ", ele)));
        // setActivecol((prev)=>{return{...prev,value}});
        // console.log(activecol);
        save_system_subsystem_colchange(value);
    }
    function SaveButton({ save = false }) {
        function savechanges() {
            xaxios
                .post(`/api/update/inspection`, {
                    results: inspectionResult,
                    filters: carsystemsfilter,
                    where: { idinspection: id },
                })
                .then((data) => {
                    setSave(false);
                });
        }
        return (
            <label
                htmlFor="save"
                className={
                    save
                        ? "p-1 rounded-md bg-black  animate-ping-1  "
                        : "p-1 rounded-md bg-black "
                }
            >
                <ButtonSubmitRed
                    disabled={!save}
                    onClick={savechanges}
                    name="save"
                    id="save"
                >
                    SAVE !
                </ButtonSubmitRed>
            </label>
        );
    }
    function SystemsSelector() {
        function changestatus(e, ind) {
            let { checked } = e.target;
            let tmp = carsystemsfilter;
            tmp[ind].enabled = checked;
            setcarsystemsfilter([...tmp]);
            setSave(true);
        }
        return (
            <ul className=" grid gap-2 p-0">
                {carsystemsfilter.map((obj7, ind7) => (
                    <li
                        className={
                            obj7.enabled
                                ? " flex bg-green-400 rounded-md px-2 py-1"
                                : " flex bg-blue-300 rounded-md px-2 py-1"
                        }
                        key={obj7.system}
                    >
                        <label
                            className=" flex-1 max-w-xs font-bold"
                            htmlFor={"filter-" + obj7.system}
                        >
                            {obj7.system}
                            <br />
                            {/* <em className=" font-thin text-gray-600 text-xs " >{obj7.description}</em> */}
                        </label>
                        <input
                            className=" ml-auto"
                            type="checkbox"
                            onChange={(e) => changestatus(e, ind7)}
                            checked={obj7.enabled}
                            name={"filter-" + obj7.system}
                            id={"filter-" + obj7.system}
                        />
                    </li>
                ))}
            </ul>
        );
    }
    function addnewresult(title) {
        let ind = carsystems.findIndex((i) => i.system == title);
        // console.log(title, ind);
        if (ind == -1) return;
        setnewinsp({ ...newinsp, ind });
        // console.log(ind);
        openCloseModal("new", "open");
    }
    function opensubsystemcol({ system, subsystem, colname, value = "", col }) {
        if (!system || !subsystem || !colname) return;
        if (colname == "defect") {
            let tmp1 = value
            setActivecol({
                col,
                colname,
                value,
                system,
                subsystem,
                status: -1,
                bodyname: subsystem,
                id: undefined,
                positions: [],
                defects: [],
                dataversion: 1,
            });
            openCloseModal("Edit Defect", "open");
            return;
        }
        // let ind = inspectionResult.findIndex(
        //     (i) => i[0] == system && i[1] == subsystem
        // );
        // let ind3 = inspectionResult[ind].subsystems[ind2].results.findIndex((i) => i.colname == colname);
        // console.log(ind, ind2, ind3);
        setActivecol({ colname, value, system, subsystem, col });
        openCloseModal("edit col", "open");
    }
    function save_system_subsystem_colchange(value) {
        let ind = inspectionResult.findIndex(
            (i) => i[0] == activecol.system && i[1] == activecol.subsystem
        );
        let ind2 = inspCols.findIndex((i) => i.name == activecol.colname);
        inspectionResult[ind][ind2] = value || activecol.value ;
        console.log(activecol.value);
        setInspectionResult([...inspectionResult]);
        setSave(true);
        if (activecol.colname == "defect")
            return openCloseModal("Edit Defect", "close");
        openCloseModal("edit col", "close");
    }

    function SubSystemsSelector({ ind = 0 }) {
        const { system } = carsystems[ind];
        const [selectedSubsystems, setselectedSubsystems] = useState([
            ...inspectionResult.filter(
                (obj) => obj.system == carsystems[ind].system
            ),
        ]);
        function select1(ind, subsystem) {
            let tmp = inspectionResult;
            tmp.push([system, subsystem]);
            setInspectionResult([...tmp]);
            setSave(true);
        }
        function remove1(ind, subsystem) {
            let tmp = inspectionResult;
            let ind2 = tmp.findIndex((i) => i[1] == subsystem);
            tmp.splice(ind2, 1);
            setInspectionResult([...tmp]);
            setSave(true);
        }
        return (
            <div className=" grid items-start gap-2 grid-cols-2 min-h-80">
                <ul className=" grid gap-2 m-0  items-start p-0">
                    {carsystems[ind]?.subsystems
                        // ?.filter(
                        //     (i) =>
                        //         selectedSubsystems.findIndex(
                        //             (j) => j[1] == i
                        //         ) == -1
                        // )
                        .map((item, ind3) => {
                            let checked =
                                inspectionResult.findIndex(
                                    (j) => j[1] == item
                                ) != -1;
                            return (
                                <li
                                    onClick={() =>
                                        checked
                                            ? remove1(ind3, item)
                                            : select1(ind3, item)
                                    }
                                    role="button"
                                    className={
                                        checked
                                            ? "flex bg-green-400 rounded-md px-2 py-1 overflow-hidden"
                                            : "flex bg-gray-400 rounded-md px-2 py-1 overflow-hidden"
                                    }
                                    key={item + ind3}
                                >
                                    {JSON.stringify(item)}
                                    <input
                                        className=" ml-auto"
                                        type="checkbox"
                                        readOnly
                                        checked={checked}
                                    />
                                </li>
                            );
                        })}
                </ul>
            </div>
        );
    }
}

export function SectionT1({
    title = "-",
    ind,
    inspectionResultin,
    opensubsystemcolin = null,
    addnewresultup = null,
}) {
    return (
        <FoldedSection open title={"" + (ind + 1) + ". " + title}>
            <ul className="sub-system-list">
                {inspectionResultin
                    ?.filter((arr2) => arr2[0] == title)
                    ?.map((arr3, ind) => (
                        <li key={arr3[1]}>
                            {inspCols.map(
                                (col, ind) =>
                                    ind != 0 &&
                                    (opensubsystemcolin || arr3[ind]) && (
                                        <button
                                            onClick={() =>
                                                opensubsystemcolin({
                                                    system: title,
                                                    subsystem: arr3[1],
                                                    colname: col.name,
                                                    value: arr3[ind],
                                                    col,
                                                })
                                            }
                                            className={
                                                arr3[ind]
                                                    ? `${col.name} ${arr3[ind]}`
                                                    : "  font-bold outline-1 outline outline-black  text-green-700"
                                            }
                                            key={col.name}
                                        >
                                            {arr3[ind] || col.name}
                                            {col?.suffix}
                                        </button>
                                    )
                            )}
                        </li>
                    ))}
            </ul>
            {addnewresultup && (
                <button
                    onClick={() => addnewresultup(title)}
                    className=" bg-orange-400 m-1 p-1 px-6 w-fit"
                >
                    <IconSmall src="/public/images/add.svg" />
                </button>
            )}
        </FoldedSection>
    );
}
// flex bg-green-400 rounded-md px-2 py-1
export function EditDefect({
    datadown = {
        status: -1,
        bodyname: "unknown",
        id: undefined,
        positions: [],
        defects: [],
        dataversion: 1,
    },
    dataup = () => null,
}) {
    
    const [newDefetData, setNewDefetData] = useState(datadown);

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
        ", ",
    ];
    const defectList = [
        "scrached",
        "dented",
        "broken",
        "not functioning",
        "cracked",
        "missing",
        "not-checked",
        "full",
        "empty",
        "high",
        "medium",
        "low",
    ];
    useEffect(() => {
        setNewDefetData({
            ...newDefetData,...datadown
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
        let present = newDefetData[namee]?.find((str) => str === valuee);
        let noseparator = !newDefetData[namee]?.find(
            (str) => str == ", " || str == "and"
        );

        if (present && noseparator)
            return alert(valuee + " already reistered!");

        const newDefects = [...newDefetData[namee], valuee];
        setNewDefetData({
            ...newDefetData,
            [namee]: newDefects,
        });
        if (vall) vall.value = "";
    }
    function uploadData(e) {
        e.preventDefault();
        dataup(newDefetData);
        setNewDefetData({ ...newDefetData, positions: [], defects: [] });
    }
    return (
        !datadown.bodyname?
             <h1 className="warning red">ERROR: NO BODY NAME PROVIDED</h1>:
        <div>
            <div className="flex gap-4 mx-auto items-center justify-center my-1">
                <b className=" text-red-500">{datadown.bodyname}</b>
            </div>

            <div className="grid p-1 gap-1">
                <OverFlowAuto className=" grid ">
                    <table className="" border={1}>
                        <thead>
                            <tr>
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
                                        onClick={() => addFunction("positions")}
                                    >
                                        add
                                    </ButtonSubmit>
                                </span>
                            </InputContainer>
                        </div>
                        <div className="grid gap-1 ">
                            <InputContainer title="defects" htmlFor="defects">
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
                                        onClick={() => clearFunction("defects")}
                                    >
                                        clear
                                    </ButtonSubmitRed>
                                    <ButtonSubmit
                                        type="button"
                                        onClick={() => addFunction("defects")}
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
        </div>
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
                <td className=" px-1">{defetData.bodyname}</td>
                <td className=" px-1">
                    <span className="">
                        {defetData.positions &&
                            defetData.positions?.map((strr, ind) => (
                                <span key={strr + "pos" + ind}>{strr} </span>
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
