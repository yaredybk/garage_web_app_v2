import { useParams } from "react-router-dom";
import BigCarImage from "./BigCarImage";

export default function ManagePointsOnCar() {
    const { carType } = useParams();
    // console.log(carType);
    return <BigCarImage onClickUp={addnewdefect} editMode={true} />;
    function addnewdefect(id) {
        alert(id);
    }
}
