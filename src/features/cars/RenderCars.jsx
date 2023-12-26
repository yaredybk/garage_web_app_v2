import BasicTable from "../../components/tables/BasicTable";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";

export default function RenderCars({
    url = "/api/getlist/car",
    openCar = () => null,
}) {
    const stateObj = useEffectStateArrayData(url);
    function manageBsicRowclick(car) {
        openCar(car?.idcar);
    }
    return stateObj?.list1 ? (
        <div className="grid">
            <BasicTable
                rowObjectUP={manageBsicRowclick}
                colIndex={0}
                data={stateObj?.list1}
                color="bgblue"
            />
        </div>
    ) : null;
}
