import { useContext } from "react"
import { GlobalState } from "../context/GlobalContext"
import "./cardplateno_v1.css"

export default function CardPlateNo_v1({plate={},fontSize=""}) {
    const {list_region} = useContext(GlobalState)
  return list_region && (
    <div style={{fontSize}} className={`cardplateno_v1 code${plate.code} region${plate.region}`} >
        <span className="code">{plate.code}</span>
        <span className="region">{list_region[plate?.region-1]?.am||""}</span>
        <span className="rec"></span>
        <span className="plate">{plate.plate}</span>
        <span className="region">{list_region[plate?.region-1]?.en||""}</span>
    </div>
  )
}
