import { useContext, useEffect, useState } from "react";
import "./Inspection.css"
import InspectionHeader from "./InspectionHeader";
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

export default function Inspection() {
    const ratingNameList = ["excellent", "good", "bad", "change"];
    const ratingColorList = ["purple", "blue", "yellow", "red"];
    const ratingPercentList = ["purple", "blue", "yellow", "red"];
    const [carInfo, setcarInfo] = useState();
    
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
        <main className=" inspection preview ">
            <InspectionHeader carInfo={carInfo}/>

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
            <Footer id={id} hide={"Preview"} />
        </main>
    );
}




