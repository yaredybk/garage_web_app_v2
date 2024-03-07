import { Link } from "react-router-dom";
import "./CardInfo1_v1.css";
import IconCar_v1 from "./IconCar_v1";
export default function CardInfoBtn2_v1({
    children,
    info = {
        h1: "Unknown",
        pre: "",
        h2: "---",
        h3: "Unknown",
        h32:"-",
        h4: "00/00",
    },
    fmid,
    fright,
    fleft,
    imgProp ={link:"/file/images/unknown.png"},
    ...props
}) {
    return (
        <button className="card info1 v1" {...props}>
            <div className="container">
                <div className="header1">{info.h1} {info.h12}</div>
                <div className="header2">
                    {info.pre}
                    {info.h2}
                </div>
                <div className="header b">
                    <span className="header3">{info.h3} {info.h32}</span>
                    <span className="header4">{info.h4}</span>
                </div>
                <IconCar_v1 {...imgProp} />
                <div className="footer1">
                    <span className="fleft">{fleft}</span>
                    <span className="fmid">{fmid}</span>
                    <span className="fright">{fright}</span>
                </div>
            </div>
        </button>
    );
}
