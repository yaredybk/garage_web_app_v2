import React, { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import xaxios from "../../utils/xaxios";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import RenderClient2 from "./RenderClient2";
import ButtonAddCar from "./../../components/button/ButtonAddCar";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";

export default function RenderClient({
    clientid = 0,
    modal = null,
    openAppt = null,
    userDataUp = () => null,
    minimal = false,
    uploadData = undefined,
    noCreatedat = false,
    clientinfoin = undefined,
}) {
    const navigate = useNavigate();
    let filteredData = null;
    const [info2, setInfo] = useState({ clientId: null, idcar: null });
    const { data } = useEffectStateSingleData(
        !clientinfoin && "/api/getsingle/client?Id=" + clientid,
        [clientinfoin],
        !clientinfoin
        );
    useEffect(() => {
        if (!data || !uploadData) return;
        //   const filteredData = data[0];
        if (!filteredData) return;
        uploadData(filteredData);
    }, [data]);

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
                <RenderClient2 clientobj={filteredData} />
            ) : (
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2  px-1  ">
                    <RenderClient2 clientobj={filteredData} />
                    <div className="grid gap-1">
                        <ButtonSubmit
                            className=" bg-blue-200"
                            onClick={() => openModal(null, "new appointment")}
                        >
                            <IconSmall src="/public/images/appointment.png" />
                            New appointment
                        </ButtonSubmit>
                        {minimal != "tiny" && (
                            <ButtonAddCar
                                title="add new car"
                                className="bg-blue-200"
                                onClick={() => openModal(null, "addcar")}
                            />
                        )}
                        {!minimal && (
                            <Link
                                role="button"
                                to={`/nav/clients/${filteredData.idclient}`}
                                className="  bg-blue-200 "
                            >
                                <IconSmall src="/public/images/more.svg" />
                                Open
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {!minimal && (
                <FoldedSection open title={filteredData?.name + "'s cars"}>
                    <RenderCars
                        key={info2?.idcar}
                        url={"/api/getlist/car?idclient=" + clientid}
                        openCar={(id) => {
                            openModal(id, "carwindow");
                        }}
                    />
                </FoldedSection>
            )}
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
                        minimal={"tiny"}
                        ui={"nolink"}
                        idcar={info2.idcar}
                    />
                )}
                <div className=" grid gap-2 grid-cols-2">
                    <ButtonGreen className=" " onClick={attachCar}>
                        <IconSmall
                            className=" animate-bounce"
                            src="/public/images/link_1.svg"
                            alt=""
                        />
                        Link
                    </ButtonGreen>
                    <ButtonSubmitRed className="" onClick={dettachCar}>
                        <IconSmall src="/public/images/unlink_1.svg" alt="" />
                        Unlink
                    </ButtonSubmitRed>
                </div>
            </BasicDialog>
            <BasicDialog id="new appointment">
                <BasicForm
                    onSubmit={_addnewappointment}
                    formClass=" grid grid-cols-[auto,auto] w-fit"
                >
                    <InputContainer className="hidden" title="id">
                        <input
                            type="number"
                            name="idclient"
                            id="idclient"
                            value={clientid}
                            readOnly
                            className=" w-12"
                        />
                    </InputContainer>
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
                    <InputContainer className=" col-span-2" htmlFor="note">
                        <textarea rows={3} cols={30} name="note" id="note" />
                    </InputContainer>
                    <button
                        type="submit"
                        className="btn-blue col-span-2 h-fit my-auto"
                    >
                        + Add New Appointment
                    </button>
                </BasicForm>
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
    function _addnewappointment(datain) {
        // console.log(datain);return;
        xaxios
            .post("/api/addnew/appt", datain)
            .then((dd) => {
                if (dd.insertId) {
                    navigate("/nav/jobs?status=appt");
                }
            })
            .catch(console.log);
    }
}
