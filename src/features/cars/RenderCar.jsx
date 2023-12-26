import { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import BreakLine from "../../components/BreakLine";
import FoldedSection from "../../components/FoldedSection";
import { LoadingState } from "../../context/LoadingContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import NewClient from "../clients/NewClient";
import BasicDialog from "../../components/dialog/BasicDialog";
import IconSmall from "../../components/IconSmall";
import xaxios from "../../utils/xaxios";
import JobHistory from "../../pages/job/JobHistory";
import RenderClients from "../clients/RenderClients";
import RenderClient from "../clients/RenderClient";
import RenderPlate2 from "../../components/RenderPlate2";
import RenderPlate3 from "../../components/RenderPlate3";
import { openCloseModal } from "../../utils/userInterface";

export default function RenderCar({
    idcar = null,
    minimal = false,
    ui = "all",
    uploadData = () => null,
}) {
    let filteredData = null;
    const { setLoad, load } = useContext(LoadingState);
    const { pathname } = useLocation();
    const patheslist = ["/nav/appt", "/nav/check-in", "/nav/job"];
    const navigate = useNavigate();
    const [refreshdata, setRefreshdata] = useState(1);
    const { data } = useEffectStateSingleData(
        "/api/getsingle/car?idcar=" + idcar,
        setRefreshdata
    );
    useEffect(() => {
        // console.log("car", data);
        if (!filteredData) return;
        // console.log(filteredData);
        uploadData(filteredData);
    }, [data]);

    const [infoo, setInfoo] = useState({ idclient: null });
    // if (load) return <div>Loading ...</div>;
    if (!data) return <div>NODATA</div>;
    filteredData = data[0];
    if (!filteredData) return <div>NODATA</div>;

    return (
        <div className=" flex flex-wrap  gap-2">
            {minimal == "tiny" ? (
                <RenderPlate3 plateobj={filteredData} />
            ) : (
                <BasicForm
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="bg-blue-300 bg-opacity-20 flex-col w-fit"
                    title={
                        <span className="flex items-center gap-1">
                            <IconSmall src="/public/images/caricon.svg"></IconSmall>
                            Car Info
                        </span>
                    }
                >
                    <div className="grid  gap-2">
                        <span className="flex">
                            <RenderPlate3 plateobj={filteredData} />
                        </span>
                        {filteredData.phoneno ? (
                            <a
                                href={"tel:" + filteredData.phoneno}
                                className=" px-4 py-1 justify-center print:hidden flex gap-2 items-center "
                            >
                                <IconSmall
                                    src="/public/call_1.svg"
                                    alt="contact"
                                />
                                Contact Client
                            </a>
                        ) : (
                            <b className=" mx-auto text-red-500">
                                No client details
                            </b>
                        )}
                        {!minimal && (
                            <FoldedSection title="more">
                                <div className="grid grid-cols-3 max-md:grid-cols-2">
                                    {filteredData &&
                                        Object.keys(filteredData)?.map(
                                            (key, ind) => (
                                                <InputContainer
                                                    key={key + ind}
                                                    htmlFor={key}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type="text"
                                                        className=" bg-blue-200 text-black border-none"
                                                        name={key}
                                                        id={key}
                                                        size={10}
                                                        placeholder={key}
                                                        readOnly
                                                        disabled={
                                                            key == "idclient"
                                                                ? false
                                                                : true
                                                        }
                                                        value={
                                                            filteredData[key]
                                                                ? filteredData[
                                                                      key
                                                                  ]
                                                                : ""
                                                        }
                                                    />
                                                </InputContainer>
                                            )
                                        )}
                                </div>
                            </FoldedSection>
                        )}
                    </div>
                </BasicForm>
            )}
            {filteredData.phoneno ? (
                <>
                    <ButtonSubmit onClick={() => openCloseModal("newcheckin_")}>
                        + New Check-In
                    </ButtonSubmit>
                    <BasicDialog id="newcheckin_">
                        <BasicForm
                            formClass=" grid"
                            onSubmit={addNewCheckIn}
                            removeEmpty={true}
                            title="New Check-in"
                        >
                            <span className=" flex gap-2">
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
                                        value={filteredData.idclient}
                                        required
                                    />
                                </InputContainer>
                            </span>
                            <InputContainer title="Odo Meter /Km" htmlFor="odo">
                                <input
                                    required
                                    type="number"
                                    name="odo"
                                    id="odo"
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
                            <ButtonSubmit id="newCheckIn">
                                + New Check-In
                            </ButtonSubmit>
                        </BasicForm>
                    </BasicDialog>
                </>
            ) : (
                <span className=" grid gap-1">
                    <ButtonSubmitRed
                        onClick={() => openCloseModal("addclient")}
                    >
                        + Add client
                    </ButtonSubmitRed>
                    <ButtonSubmit type="button" onClick={newInspection}>
                        + New Inspection
                    </ButtonSubmit>
                    <BasicDialog id="clientwindow2">
                        {infoo.idclient && (
                            <RenderClient
                                clientid={infoo.idclient}
                                key={infoo.idclient}
                                // minimal={true}
                            />
                        )}
                        <div className="grid p-1 gap-2 ">
                            {/* {button !== "unlink" && ( */}
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
                            {/* )} */}
                            {/* {button !== "link" && ( */}
                            <button
                                className=" bg-red-500 flex items-center justify-center gap-2 text-white font-bold py-2 px-4 w-full my-2"
                                onClick={() => detachClient()}
                            >
                                <IconSmall
                                    src="/public/images/unlink_1.svg"
                                    alt="unlinklink"
                                />
                                Unlink Client
                            </button>
                            {/* )} */}
                        </div>
                    </BasicDialog>
                </span>
            )}
            {minimal != "tiny" && (
                <BasicDialog id="addclient">
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
            )}
            <JobHistory idcar={idcar} />
        </div>
    );
    function openModal(id, modalid, closemodalid) {
        // setInfo({ ...info2, idcar: id });
        // car selected ... close list of cars
        if (closemodalid === "addclient") {
            setInfoo({ ...infoo, idclient: id });
        }
        document.getElementById(modalid)?.showModal();

        document.getElementById(closemodalid)?.close();
        return;
    }
    function addNewCheckIn(data) {
        // console.log(data);
        xaxios
            .post("/api/addnew/checkin", data, setLoad)
            .then((res) => {
                if (res.insertId) {
                    return navigate("/nav/job/" + res.insertId, {
                        replace: true,
                    });
                }
                alert("error: unknown error");
            })
            .catch((err) => {
                alert("error: unable to add new check-in !!!");
            });
    }
    function switchForm(path) {
        return;
    }
    function newInspection() {
        xaxios
            .post(`/api/addnew/inspection`, { idcar }, setLoad)
            .then((res) => {
                navigate(`/nav/job/${res.insertId}`);
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
                refreshdata();
                // console.log(res);
                // setInfoo({ ...infoo, idcar: null });
            })
            .catch(console.log);
    }
    function detachClient() {
        xaxios
            .post(
                "/api/update/car",
                {
                    where: { idcar: idcar },
                    idclient: null,
                },
                setLoad
            )
            .then((res) => {
                refreshdata();
                // console.log(res);
                // setInfoo({ ...infoo, idcar: null });
            })
            .catch(console.log);
    }
}
