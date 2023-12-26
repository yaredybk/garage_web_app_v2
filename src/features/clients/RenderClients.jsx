import BasicTable from "../../components/tables/BasicTable";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";

export default function RenderClients({
    url = "/api/getlist/client",
    openClient = () => null,
}) {
    const stateObj = useEffectStateArrayData(url);
    function clientClick(client) {
        openClient(client.idclient);
    }
    return stateObj?.list1 ? (
        <div className="grid">
            <BasicTable
                rowObjectUP={clientClick}
                data={stateObj?.list1}
                color="bgblue"
            />
        </div>
    ) : null;
}
