import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import BasicDialog from "./dialog/BasicDialog";
import NewClient from "../../features/clients/NewClient";
// import FoldedSection from "./FoldedSection";
// import RenderClients from "../features/clients/RenderClients";
import NewCar from "../../features/cars/NewCar";
// import RenderCars from "../features/cars/RenderCars";
import RenderClient from "../../features/clients/RenderClient";
import RenderCar from "../../features/cars/RenderCar";
import { openCloseModal } from "../../utils/userInterface";
import BasicDialog from "../../components/dialog/BasicDialog";
import PageList_v2 from "../../layout/PageList_v2";
export default function ListCar({ path }) {
    ///////////////////////////////////////////////////
    function openModal(id, modalid) {
        // console.log("carid:", id);
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setInfo({ ...infoo, idcar: id });
        else setInfo({ ...infoo, clientId: id });
        openCloseModal(idd, "open");
    }
    ///////////////////////////////////////////////////
    const jobTabs = ["appt", "pending", "finished", "next"];
    let curloc = new URL(document.location.href);
    const navigate = useNavigate();
    const [infoo, setInfo] = useState({
        car:undefined,
        clientId: null,
        idcar: null,
        status: curloc.searchParams.get("status") || "pending",
        h4: curloc.searchParams.get("status")
            ? curloc.searchParams.get("status") == "pending"
                ? "created"
                : curloc.searchParams.get("status")
            : "created",
    });
    const [activecar, setactivecar] = useState(undefined);
    const baseurl1 = `/api/getlist?from=cars_view&cols=idcar,idclient,phoneno,code,region,plate,name,make,model,color`;
    const [url, setUrl] = useState("");
    // const { data, refetchData } = useEffectStateSingleData(url);
    const [fresh, reFresh] = useState(undefined);

    function alterSearchQuery(name, value) {
        let tmploc = new URL(document.location.href);
        if (tmploc.searchParams.has(name)) tmploc.searchParams.set(name, value);
        else tmploc.searchParams.append(name, value);
        window.history.replaceState(null, document.title, tmploc);
    }
    function plateChange(e) {
        // let tmpval = url;
        let tmpval = url.replace("&filter=plate='", "").replace("'", "");
        let { name, value } = e.target;
        if (name == "Pre") {
            tmpval = tmpval ? tmpval?.replace(/^[a-zA-Z]*/, value) : value;
        } else if (name == "Plate") {
            tmpval = tmpval ? tmpval?.replace(/[0-9]*$/, value) : value;
        } else return;
        setUrl(tmpval ? `&filter=plate='${tmpval}'` : "");
    }

    return (
        <main className="cars_list">
            <NewCar
            className = "mx-auto w-fit"
                open={path == "register"}
                onClear={() => {
                    setUrl("");
                }}
                onChange={plateChange}
                openCar={(id, car) => {
                    setInfo({ ...infoo, idcar: id,car:undefined });
                    openCloseModal("carwindow", "open");
                }}
                onNewRegistration={(insertId) => {
                    //used to get the list of cars ... to include the new one
                    reFresh(Date.now());
                }}
            />
            <BasicDialog id="newclient">
                <NewClient openClient={openModal} />
                {/* <FoldedSection title="recent clients">
                    <RenderClients openClient={openModal} />
                </FoldedSection> */}
            </BasicDialog>
            <BasicDialog id="clientwindow">
                {infoo.clientId && (
                    <RenderClient
                        minimal="tiny"
                        clientid={infoo.clientId}
                        key={infoo.clientId}
                    />
                )}
            </BasicDialog>
            <BasicDialog
                id="carwindow"
                onClose={() => setInfo({ ...infoo, idcar: null })}
            >
                {infoo.idcar && (
                    <RenderCar
                        // key={Date.now()}
                        onChange={()=>reFresh(Date.now())}
                        carinfoin={infoo.car}
                        minimal={false}
                        idcar={infoo?.idcar}
                    />
                )}
            </BasicDialog>
            <PageList_v2
                url={baseurl1 + url}
                info={{
                    h1: "name",
                    pre: "V",
                    h2: "idcar",
                    h3: "make",
                    h32: "model",
                    h4: infoo.h4,
                }}
                display="icon"
                onClick={(car) => {
                    setInfo({ ...infoo, idcar: car?.idcar,car });
                    openCloseModal("carwindow", "open");
                }}
                refresh={fresh}
            />
        </main>
    );
}
