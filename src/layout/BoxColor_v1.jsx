import "./boxcolor_v1.css"
export default function BoxColor_v1({color=""}) {
    return color && (
        <div style={{ backgroundColor: color }} className="boxcolor_v1">
            <span>{color}</span>
        </div>
    );
}
