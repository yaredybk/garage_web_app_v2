import { useState } from "react";
import "./Inspection.css"
import InspectionHeader from "./InspectionHeader";

export default function Inspection() {
    const samplecar = {
        make: "Toyota",
        idcar: "255",
        model: "Hilux",
        code: 3,
        region: 2,
        plate: "A15446",
        color:"blue",
        Year:2018,
        Odo:15800,
        Seats:5
    };
    const [carInfo, setCarInfo] = useState()
    return (
        <div className=" inspection  ">
            <InspectionHeader carInfo={samplecar}/>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
               
            </p>
        </div>
    );
}
