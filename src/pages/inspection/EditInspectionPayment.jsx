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
import { SectionT1 } from "./EditInspection";
import Footer from "./Footer";
export default function EditInspectionPayment() {
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
    const [save, setSave] = useState(false);
    const [inspectionResult, setInspectionResult] = useState([]);
    const [carsystemsfilter, setcarsystemsfilter] = useState([
        ...carsystems.map((obj6) => {
            return { system: obj6.system, enabled: obj6.enabled };
        }),
    ]);
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
    const inspCols = [
        "syatem",
        "subsystem",
        "position/defect",
        "scale/unit",
        "rating",
        "status",
        "recommendation",
        "cost",
    ];

    return (
        <main className="inspection payment">
            <div className="new-inspection-header grid grid-cols-2 place-items-center bg-purple-200">
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
                            inspectionResultin={inspectionResult}
                            key={obj1.system}
                            ind={ind}
                            title={obj1.system}
                        />
                    ))}
            </div>
            <Footer id={id} hide={"Payment"} />
        </main>
    );
}
