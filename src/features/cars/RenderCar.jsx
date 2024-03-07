import { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import BreakLine from "../../components/BreakLine";
import FoldedSection from "../../components/FoldedSection";
import { LoadingState } from "../../context/LoadingContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { useNavigate } from "react-router-dom";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import NewClient from "../clients/NewClient";
import BasicDialog from "../../components/dialog/BasicDialog";
import IconSmall from "../../components/IconSmall";
import xaxios from "../../utils/xaxios";
import JobHistory from "../../pages/job/JobHistory";
import RenderClients from "../clients/RenderClients";
import RenderClient from "../clients/RenderClient";
import RenderPlate3 from "../../components/RenderPlate3";
import { openCloseModal } from "../../utils/userInterface";
import CardInfo1_v1 from "../../layout/CardInfo1_v1";
import CardPlateNo_v1 from "../../layout/CardPlateNo_v1";
import BoxColor_v1 from "../../layout/BoxColor_v1";
import RenderCars from "./RenderCars";

export default function RenderCar({
    inspection = undefined,
    onChange = undefined,
    idcar = null,
    minimal = false,
    ui = "all",
    uploadData = null,
    carinfoin = undefined,
}) {
    const tmp = inspection ? "inspection/" : "";
    let filteredData = null;
    const { setLoad, load } = useContext(LoadingState);
    const navigate = useNavigate();
    const { data, setData, refetchData } = useEffectStateSingleData(
        `/api/getsingle/${tmp}car?idcar=${idcar}`,
        [carinfoin],
        carinfoin ? false : true
    );
    useEffect(() => {
        // console.log("car", data);
        if (!filteredData) return;
        // console.log(filteredData);
        uploadData && uploadData(filteredData);
    }, [data]);

    const [infoo, setInfoo] = useState({ idclient: null });
    // if (load) return <div>Loading ...</div>;
    if (!data) return <div>NODATA</div>;
    filteredData = data[0];
    if (!filteredData) return <div>NODATA</div>;

    return (
        <div className=" grid gap-2 grid-cols-[2fr,1fr] max-sm:grid-cols-1 ">
            {minimal == "tiny" ? (
                <RenderPlate3 plateobj={filteredData} />
            ) : (
                <CardInfo1_v1
                    to={`/nav/cars/${filteredData.idcar}`}
                    info={{
                        h1: filteredData.make,
                        h12: filteredData.model,
                        pre: "V",
                        h2: filteredData.idcar,
                        h3: filteredData.idclient,
                        h32: filteredData.name,
                        h4: filteredData.phoneno || "No Client",
                    }}
                    imgProp={{
                        link: `/files/image/cars/${filteredData.make}/${filteredData.model}.webp`,
                    }}
                    fmid={<CardPlateNo_v1 plate={filteredData} />}
                    fleft={<BoxColor_v1 color={filteredData.color} />}
                />
            )}
            {minimal != "tiny" && (
                <>
                    <span className=" grid gap-1 items-center">
                        {filteredData.phoneno ? (
                            <>
                                <ButtonSubmit
                                    className=" bg-green-300 animate-ping-1"
                                    onClick={() =>
                                        openCloseModal("newcheckin_")
                                    }
                                >
                                    <IconSmall src="/public/images/spanner.svg" />{" "}
                                    New job
                                </ButtonSubmit>
                                <BasicDialog id="newcheckin_">
                                    <BasicForm

                                        formClass=" grid"
                                        onSubmit={addNewCheckIn}
                                        removeEmpty={true}
                                    >
                                        <span className=" gap-2 hidden">
                                            <InputContainer htmlFor="idcar">
                                                <input
                                                    type="text"
                                                    size={4}
                                                    readOnly
                                                    id="idcar"
                                                    name="idcar"
                                                    value={filteredData?.idcar}
                                                    required
                                                />
                                            </InputContainer>
                                            <InputContainer htmlFor="idclient">
                                                <input
                                                    type="text"
                                                    size={4}
                                                    readOnly
                                                    id="idclient"
                                                    name="idclient"
                                                    value={
                                                        filteredData.idclient
                                                    }
                                                    required
                                                />
                                            </InputContainer>
                                        </span>
                                        <InputContainer
                                            title="Odo Meter /Km"
                                            htmlFor="odo"
                                        >
                                            <input
                                                required
                                                type="number"
                                                name="odo"
                                                id="odo"
                                                autoComplete="off"
                                            />
                                        </InputContainer>
                                        <InputContainer
                                            title="expected due date"
                                            htmlFor="duedate"
                                        >
                                            <input
                                                type="date"
                                                name="duedate"
                                                id="duedate"
                                            />
                                        </InputContainer>
                                        <BreakLine />
                                        <ButtonSubmit className=" bg-green-300">
                                            <IconSmall src="/public/images/repair.png" />
                                            New job
                                        </ButtonSubmit>
                                    </BasicForm>
                                </BasicDialog>
                                <a
                                    href={"tel:" + filteredData.phoneno}
                                    className=" rounded-md px-4 py-1 justify-center print:hidden flex gap-4 items-center "
                                >
                                    <IconSmall
                                        src="/public/call_1.svg"
                                        alt="contact"
                                    />
                                    Call
                                </a>
                                <ButtonSubmit
                                    className=" bg-green-300"
                                    type="button"
                                    onClick={() => {
                                        navigate(
                                            `/nav/clients/${filteredData.idclient}`
                                        );
                                    }}
                                >
                                    <IconSmall src="/public/images/person2.png" />{" "}
                                    Open Client
                                </ButtonSubmit>
                            </>
                        ) : (
                            <>
                                <ButtonSubmit
                                    onClick={() => openCloseModal("addclient")}
                                >
                                    <IconSmall src="/public/images/add.svg" />
                                    Add client
                                </ButtonSubmit>
                                <ButtonSubmitRed
                                    onClick={() => {
                                        setInfoo({ ...infoo, idclient: 17 });
                                        openCloseModal(
                                            "clientwindow2",
                                            "closeopen",
                                            "addclient"
                                        );
                                    }}
                                >
                                    <IconSmall src="/public/images/unapproved-profile.svg" />
                                    link unknown client
                                </ButtonSubmitRed>
                                <BasicDialog id="clientwindow2">
                                    {infoo.idclient && (
                                        <>
                                            <RenderClient
                                                clientid={infoo.idclient}
                                                key={infoo.idclient}
                                                minimal={"tiny"}
                                            />
                                            <FoldedSection title="cars" open>
                                                <RenderCars
                                                    key={infoo?.idclient}
                                                    url={
                                                        "/api/getlist/car?idclient=" +
                                                        infoo.idclient
                                                    }
                                                />
                                            </FoldedSection>
                                        </>
                                    )}
                                    <div className="grid p-1 gap-2 ">
                                        <button
                                            className=" bg-green-500 flex items-center animate-ping-1 justify-center gap-2 text-white font-bold py-2 px-4 w-full my-2"
                                            onClick={() => attachClient()}
                                        >
                                            <IconSmall
                                                src="/public/images/link_1.svg"
                                                alt="link"
                                            />
                                            Link Client
                                        </button>
                                        {/* <button
                                    className=" bg-red-500 flex items-center justify-center gap-2 text-white font-bold py-2 px-4 w-full my-2"
                                    onClick={() => detachClient()}
                                >
                                    <IconSmall
                                        src="/public/images/unlink_1.svg"
                                        alt="unlinklink"
                                    />
                                    Unlink Client
                                </button> */}
                                    </div>
                                </BasicDialog>
                            </>
                        )}
                        <ButtonSubmit
                            className=" bg-green-300"
                            type="button"
                            onClick={() => {
                                alert(" featur not completed !!");
                                return;
                                // #fix-me #delete
                                newInspection();
                            }}
                        >
                            <IconSmall src="/public/images/Inspection.png" />{" "}
                            New Inspection
                        </ButtonSubmit>
                        <ButtonSubmit
                            className=" bg-green-300"
                            type="button"
                            onClick={() => {
                                if (filteredData.idcar)
                                    navigate(`/nav/cars/${filteredData.idcar}`);
                            }}
                        >
                            <IconSmall src="/public/images/caricon.svg" /> Open
                            Car
                        </ButtonSubmit>
                    </span>
                    <BasicDialog containerClass=" grid gap-2" id="addclient">
                        <NewClient
                            openClient={(id) => {
                                setInfoo({ ...infoo, idclient: id });
                                openCloseModal(
                                    "clientwindow2",
                                    "closeopen",
                                    "addclient"
                                );
                            }}
                        />
                        <FoldedSection title="recent clients">
                            <RenderClients
                                // key={info2?.idcar}
                                openClient={(id) => {
                                    setInfoo({ ...infoo, idclient: id });
                                    openCloseModal(
                                        "clientwindow2",
                                        "closeopen",
                                        "addclient"
                                    );
                                }}
                            />
                        </FoldedSection>
                    </BasicDialog>

                    <JobHistory idcar={idcar} />
                </>
            )}
        </div>
    );
    function addNewCheckIn(data) {
        // console.log(data);
        xaxios
            .post("/api/addnew/checkin", data, setLoad)
            .then((res) => {
                if (res.insertId) {
                    return navigate("/nav/jobs/edit/" + res.insertId, {
                        replace: true,
                    });
                }
                alert("error: unknown error");
            })
            .catch((err) => {
                alert("error: unable to add new check-in !!!");
            });
    }
    function newInspection() {
        xaxios
            .post(`/api/addnew/inspection?fromcarstable=1`, { idcar }, setLoad)
            .then((res) => {
                navigate(`/nav/inspections/edit/${res.insertId}`);
            });
    }
    function attachClient() {
        xaxios
            .post(
                "/api/update/car",
                {
                    where: { idcar: idcar },
                    idclient: infoo.idclient,
                },
                setLoad
            )
            .then((res) => {
                // console.log(res);
                if (carinfoin) {
                    refetchData();
                    onChange();
                } else refetchData();
                openCloseModal("clientwindow2", "close");
            })
            .catch(console.log);
    }
    // function detachClient() {
    //     xaxios
    //         .post(
    //             "/api/update/car",
    //             {
    //                 where: { idcar: idcar },
    //                 idclient: null,
    //             },
    //             setLoad
    //         )
    //         .then(refetchData)
    //         .catch(console.log);
    // }
}
