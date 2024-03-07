import { baseurl2 } from "../utils/xaxios";
import "./iconcar_v1.css";
export default function IconCar_v1({
    imgClass = "",
    link = "/files/image/unknown.png",
    ...props
}) {
    return (
        <span className="icon1">
            <img
                onError={(e) => {
                    let { src } = e.currentTarget;
                    // car logo not found
                    if (src.includes("/cars/")) {
                        let make = src.match(/\/cars\/(.*)\//)[1];
                        e.currentTarget.src = `${baseurl2}/files/image/carlogos/${make.trimEnd()}-logo.png`;
                        e.currentTarget.className = "icon1 carlogo ";
                        return;
                    }
                    if (src.includes("/carlogos/-/")) {
                        e.currentTarget.className = "icon1 hidden ";
                        return;
                    }
                    if (src.includes("/carlogos/")) {
                        e.currentTarget.src = `${baseurl2}/files/image/carlogos/-/-.webp`;
                        e.currentTarget.className = "icon1";
                        return;
                    }
                    if (!src.includes("unknown.png")) {
                        e.currentTarget.src = `${baseurl2}/files/image/unknown.png`;
                        e.currentTarget.className = "icon1";
                        return;
                    }
                    e.currentTarget.className = " hidden ";
                }}
                className={`icon1 ${imgClass}`}
                src={`${baseurl2}${link}`}
                alt="icon"
                {...props}
            />
        </span>
    );
}
