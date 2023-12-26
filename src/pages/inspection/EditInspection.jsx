import { useContext, useEffect, useState } from "react";
import FoldedSection from "../../components/FoldedSection";
import BasicDialog from "../../components/dialog/BasicDialog";
import IconSmall from "../../components/IconSmall";
import { openCloseModal } from "../../utils/userInterface";
import RenderPlate3 from "../../components/RenderPlate3";
import { useParams } from "react-router-dom";
import carsystems from "./carsystems.json";
import xaxios from "../../utils/xaxios";
import { LoadingState } from "../../context/LoadingContext";
export default function EditInspection() {
    const ratingNameList = ["excellent", "good", "bad", "change"];
    const ratingColorList = ["purple", "blue", "yellow", "red"];
    const ratingPercentList = ["purple", "blue", "yellow", "red"];
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
    const [newinsp, setnewinsp] = useState({ ind: 0 });
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
                const { inspection = [], car = {}, client = {} } = fulljj;
                if (car) setcarInfo(car);
                if (inspection) setInspectionResult([...inspection]);
            });
    }, []);

    return (
        <div className="new-inspection px-1">
            <div className="new-inspection-header grid grid-cols-2 place-items-center bg-purple-200">
                <div>
                    <h1>Inspection </h1>
                    <div className=" bg-gray-400 p-1 w-fit rounded-l-md">
                        N<u>o</u>:{" "}
                        <span className="tiketnumber">
                            {id?.toString()?.padStart(5, "0")}
                        </span>
                    </div>
                </div>
                <RenderPlate3 plateobj={carInfo} />
            </div>
            <div className="grid gap-1">
                {carsystemsfilter
                    .filter((obj) => obj.enabled)
                    .map((obj1, ind) => (
                        <SectionT1
                            key={obj1.system}
                            ind={ind}
                            title={obj1.system}
                        />
                    ))}
            </div>
            <button
                onClick={() => openCloseModal("more systems", "open")}
                className=" bg-red-300 px-10"
            >
                more ...
            </button>
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
        </div>
    );
    function SystemsSelector() {
        function changestatus(e, ind) {
            let { checked } = e.target;
            let tmp = carsystemsfilter;
            tmp[ind].enabled = checked;
            setcarsystemsfilter([...tmp]);
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
                            className=" max-w-xs font-bold"
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
        console.log(title,ind);
        if (ind == -1) return;
        setnewinsp({ ...newinsp, ind });
        console.log(ind);
        openCloseModal("new", "open");
    }
    function SectionT1({ title = "-", ind }) {
        return (
            <FoldedSection open title={"" + (ind + 1) + ". " + title}>
                <li>
                    {inspectionResult
                        .filter((obj2) => obj2.system == title)
                        .map((obj3, ind) => (
                            <li key={obj3?.system}>{obj3.system}</li>
                        ))}
                </li>
                <button
                    onClick={() => addnewresult(title)}
                    className=" bg-orange-400 m-1 p-1 px-6 w-fit"
                >
                    <IconSmall src="/public/images/add.svg" />
                </button>
            </FoldedSection>
        );
    }
    function SubSystemsSelector({ ind = 0 }) {
        const { system } = carsystems[ind];
        const [selectedSubsystems, setselectedSubsystems] = useState([
            ...inspectionResult.filter(
                (obj) => obj.system == carsystems[ind].system
            ),
        ]);
        function select1(ind, subsystem) {
            let tmp = selectedSubsystems;
            tmp.push([system, subsystem]);
            setselectedSubsystems([...tmp]);
        }
        function remove1(ind, subsystem) {
            let tmp = selectedSubsystems;
            let ind2 = tmp.findIndex((i) => i[1] == subsystem);
            tmp.splice(ind2, 1);
            setselectedSubsystems([...tmp]);
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
                                selectedSubsystems.findIndex(
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

// flex bg-green-400 rounded-md px-2 py-1
