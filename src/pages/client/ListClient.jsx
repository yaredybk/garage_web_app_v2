import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
// import BasicDialog from "./dialog/BasicDialog";
import NewClient from "../../features/clients/NewClient";
// import FoldedSection from "./FoldedSection";
// import RenderClients from "../features/clients/RenderClients";
import NewCar from "../../features/cars/NewCar";
// import RenderCars from "../features/cars/RenderCars";
import RenderClient from "../../features/clients/RenderClient";
import RenderCar from "../../features/cars/RenderCar";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import IconSmall from "../../components/IconSmall";
import { openCloseModal } from "../../utils/userInterface";
import BasicDialog from "../../components/dialog/BasicDialog";
import PageList_v1 from "../../layout/PageList_v1.jsx";
import FoldedSection from "../../components/FoldedSection";
import RenderClients from "../../features/clients/RenderClients";
import RenderCars from "../../features/cars/RenderCars";
import PageList_v2 from "../../layout/PageList_v2";
import PageListPerson_v2 from "../../layout/PageListPerson_v2";

export function ListClient({ path }) {
    const [infoo, setInfo] = useState({
        clientId: null,
        idcar: null,
        client: {},
    });
    function openclient(id, client) {
        if (!id) return;
        let idd = "clientwindow";
        setInfo({ ...infoo, clientId: id, client });
        openCloseModal(idd, "open");
    }
    const [fresh, reFresh] = useState(undefined);
    let url = `/api/getlist?from=clients_view&cols=idclient,name,gender,phoneno`;
    return (
        <main>
            {path == "register" && (
                <NewClient
                    onNewRegistration={(insertId) => reFresh(Date.now())}
                    openClient={openclient}
                />
            )}
            <BasicDialog id="clientwindow">
                {infoo.clientId && (
                    <RenderClient
                        clientinfoin={infoo.client}
                        clientid={infoo.clientId}
                        key={infoo.clientId}
                    />
                )}
            </BasicDialog>
            <BasicDialog id="carwindow">
                {infoo.idcar && (
                    <RenderCar
                        minimal={false}
                        key={infoo?.idcar}
                        idcar={infoo?.idcar}
                    />
                )}
            </BasicDialog>
            <PageListPerson_v2
                refresh={fresh}
                pagetype="person"
                url={url}
                info={{
                    h1: "name",
                    pre: "C",
                    h2: "idclient",
                    h3: "",
                    h32: "model",
                    h4: infoo.h4,
                }}
                display="list"
                onClick={(obj) => {
                    openclient(obj.idclient, obj);
                }}
            />
        </main>
    );
}
