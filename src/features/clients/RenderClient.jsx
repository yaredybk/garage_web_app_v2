import React, { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import xaxios from "../../utils/xaxios";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import { Link, useLocation } from "react-router-dom";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { LoadingState } from "../../context/LoadingContext";
import BasicDialog from "../../components/dialog/BasicDialog";
import NewCar from "../cars/NewCar";
import FoldedSection from "../../components/FoldedSection";
import RenderCars from "../cars/RenderCars";
import RenderCar from "../cars/RenderCar";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import IconSmall from "../../components/IconSmall";
import ButtonGreen from "../../components/button/ButtonGreen";
import BreakLine from "../../components/BreakLine";
import { openCloseModal } from "../../utils/userInterface";

export default function RenderClient({
    clientid = 0,
    modal = null,
    openAppt = null,
    userDataUp = () => null,
    minimal = false,
    uploadData = () => null,
    noCreatedat = false,
}) {
    let filteredData = null;
    const [info2, setInfo] = useState({ clientId: null, idcar: null });
    const { data } = useEffectStateSingleData(
        "/api/getsingle/client?Id=" + clientid
    );
    const { load } = useContext(LoadingState);
    useEffect(() => {
        if (!data) return;
        //   const filteredData = data[0];
        if (!filteredData) return;
        uploadData(filteredData);
    }, [data]);

    // if (load) return <div>Loading ...</div>;
    if (!data) return <div>NODATA</div>;
    filteredData = data[0];
    if (!filteredData) return <div>NODATA</div>;

    function openModal(id, modalid) {
        if (id) {
            setInfo({ ...info2, idcar: id });
            // car selected ... close list of cars
            document.getElementById("addcar")?.close();
            openCloseModal("rendercardialog", "open");
            return;
        }
        if (modalid) {
            // const dialogs = document.querySelectorAll("dialog");
            // dialogs.forEach((dialog) => dialog.close());
            document.getElementById(modalid)?.showModal();
        }
    }
    return (
        <div className=" client grid gap-2">
            {minimal == "tiny" ? (
                <span className="grid gap-1">
                    <b>
                        ({filteredData?.idclient}) {filteredData?.name}
                    </b>
                    <a
                        href={"tel:" + filteredData?.phoneno}
                        className=" bg-white px-2 rounded-md outline-1 outline outline-blue-600 "
                    >
                        {filteredData?.phoneno}
                    </a>
                </span>
            ) : (
                <BasicForm
                    onSubmit={userDataUp}
                    formClass=" grid  gap-1  justify-center "
                    className=" bg-opacity-20 max-w-fit   "
                    title={
                        <span className="flex items-center gap-1">
                            <IconSmall src="/public/images/person2.png"></IconSmall>
                            Client info
                        </span>
                    }
                >
                    <div className=" grid grid-cols-[1fr,3fr] gap-1 w-fit mx-auto ">
                        <InputContainer htmlFor="id">
                            <input
                                type="text"
                                name="idclient"
                                className="  bg-white w-10 text-black border-none"
                                value={filteredData.idclient}
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer htmlFor="name">
                            <input
                                name="name"
                                type="text"
                                className="  bg-white text-black border-none"
                                value={filteredData.name}
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer className=" col-span-2" htmlFor="phone">
                            <a
                                href={"tel:" + filteredData.phoneno}
                                className=" flex-1 px-4 py-1  print:hidden  justify-center flex gap-2 items-center "
                            >
                                <IconSmall
                                    src="/public/call_1.svg"
                                    alt="contact"
                                />
                                {filteredData.phoneno}
                            </a>
                        </InputContainer>
                    </div>
                    <BreakLine />
                    {/* <ButtonSubmit>Get cars</ButtonSubmit> */}

                    <FoldedSection title="New Appointment">
                        <InputContainer htmlFor="apptdate">
                            <input
                                type="date"
                                name="apptdate"
                                id="apptdate"
                                required
                            />
                        </InputContainer>
                        <InputContainer htmlFor="appttime">
                            <input
                                type="time"
                                name="appttime"
                                id="appttime"
                                defaultValue="08:00"
                            />
                        </InputContainer>
                        <InputContainer htmlFor="note">
                            <textarea
                                rows={3}
                                cols={30}
                                name="note"
                                id="note"
                            />
                        </InputContainer>
                        <button
                            type="submit"
                            className="btn-blue h-fit my-auto"
                        >
                            + Add New Appointment
                        </button>
                    </FoldedSection>
                </BasicForm>
            )}

            {!minimal && (
                <FoldedSection title={filteredData?.name + "'s cars"}>
                    <RenderCars
                        key={info2?.idcar}
                        url={"/api/getlist/car?idclient=" + clientid}
                        openCar={(id) => {
                            openModal(id, "carwindow");
                        }}
                    />
                </FoldedSection>
            )}
            <ButtonSubmit onClick={() => openModal(null, "addcar")}>
                + Add car
            </ButtonSubmit>
            {minimal != "tiny" && (
                <BasicDialog id="addcar">
                    <NewCar
                        openCar={(id) => {
                            openModal(id, "carwindow");
                        }}
                    />
                    <FoldedSection title="recent cars">
                        <RenderCars
                            key={info2?.idcar}
                            openCar={(id) => {
                                openModal(id, "carwindow");
                            }}
                        />
                    </FoldedSection>
                </BasicDialog>
            )}
            <BasicDialog id="rendercardialog">
                {info2.idcar && (
                    <RenderCar
                        key={info2.idcar}
                        minimal={true}
                        ui={"nolink"}
                        idcar={info2.idcar}
                    />
                )}
                <div className="">
                    <ButtonGreen className=" " onClick={attachCar}>
                        <IconSmall src="/public/images/link_1.svg" alt="" />
                        Link Client
                    </ButtonGreen>
                    <ButtonSubmitRed className="" onClick={dettachCar}>
                        <IconSmall src="/public/images/unlink_1.svg" alt="" />
                        Unlink Client
                    </ButtonSubmitRed>
                </div>
            </BasicDialog>
        </div>
    );
    function attachCar() {
        xaxios
            .post("/api/update/car", {
                where: { idcar: info2.idcar },
                idclient: clientid,
            })
            .then((res) => {
                // console.log(res);
                setInfo({ ...info2, idcar: null });
                openCloseModal("rendercardialog", "close");
            })
            .catch(console.log);
    }
    function dettachCar() {
        xaxios
            .post("/api/update/car", {
                where: { idcar: info2.idcar },
                idclient: null,
            })
            .then((res) => {
                // console.log(res);
                setInfo({ ...info2, idcar: null });
                openCloseModal("rendercardialog", "close");
            })
            .catch(console.log);
    }
}
