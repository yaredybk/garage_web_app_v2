import { useState } from "react";
import { openCloseModal } from "../utils/userInterface";
import BasicDialog from "./dialog/BasicDialog";
import NewClient from "../features/clients/NewClient";
import FoldedSection from "./FoldedSection";
import RenderClients from "../features/clients/RenderClients";
import NewCar from "../features/cars/NewCar";
import RenderCars from "../features/cars/RenderCars";
import RenderClient from "../features/clients/RenderClient";
import RenderCar from "../features/cars/RenderCar";
import ButtonSubmit from "./button/ButtonSubmit";
import IconSmall from "./IconSmall";

export function ManageClientAndCar({ minimal = false }) {
    const [infoo, setInfo] = useState({ clientId: null, idcar: null });
    function openModal(id, modalid) {
        // console.log("carid:", id);
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setInfo({ ...infoo, idcar: id });
        else setInfo({ ...infoo, clientId: id });
        openCloseModal(idd, "open");
    }
    return (
        <>
            <BasicDialog id="newclient">
                <NewClient openClient={openModal} />
                <FoldedSection title="recent clients">
                    <RenderClients openClient={openModal} />
                </FoldedSection>
            </BasicDialog>
            <BasicDialog id="newcar">
                <NewCar
                    openCar={(id) => {
                        setInfo({ ...infoo, idcar: id });
                        openCloseModal("carwindow", "closeopen", "newcar");
                    }}
                />
                <FoldedSection title="recent cars">
                    <RenderCars
                        openCar={(id) => {
                            setInfo({ ...infoo, idcar: id });
                            openCloseModal("carwindow", "closeopen", "newcar");
                        }}
                    />
                </FoldedSection>
            </BasicDialog>
            <BasicDialog id="clientwindow">
                {infoo.clientId && (
                    <RenderClient
                    minimal={"tiny"}
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
            <div className="grid grid-cols-2 gap-2 p-3 pb-0">
                <ButtonSubmit
                    onClick={() => {
                        openModal(null, "newclient");
                    }}
                >
                    <IconSmall src="/public/images/person2.png"></IconSmall>+
                    client
                </ButtonSubmit>
                <ButtonSubmit onClick={() => openModal(null, "newcar")}>
                    <IconSmall src="/public/images/caricon.svg"></IconSmall>+
                    car
                </ButtonSubmit>
            </div>
            <br />
            {!minimal && (
                <>
                    <FoldedSection title="recent clients">
                        <RenderClients openClient={openModal} />
                    </FoldedSection>
                    <br />
                    <FoldedSection title="recent cars">
                        <RenderCars
                            openCar={(id) => {
                                openModal(id, "carwindow");
                            }}
                        />
                    </FoldedSection>
                </>
            )}
        </>
    );
}
