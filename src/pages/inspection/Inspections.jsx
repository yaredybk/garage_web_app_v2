import { useState } from "react";
// import "./jobs.css";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import BasicTable from "../../components/tables/BasicTable";
import { useNavigate } from "react-router-dom";
import OverFlowAuto from "../../components/OverFlowAuto";
import { ManageClientAndCar } from "../../components/ManageCarAndClient";
import ClockBig from "../../components/ClockBig";
import RenderPlate3 from "../../components/RenderPlate3";
import RenderPlateJobs from "../../components/RenderPlateJobs";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import IconSmall from "../../components/IconSmall";
import BasicDialog from "../../components/dialog/BasicDialog";
import NewCar from "../../features/cars/NewCar";
import FoldedSection from "../../components/FoldedSection";
import RenderCars from "../../features/cars/RenderCars";
import RenderCarWithInspection from "../../features/cars/RenderCarWithInspection";
import { openCloseModal } from "../../utils/userInterface";
import RenderPlateInspection from "../../components/RenderPlateInspection";

export default function Inspections() {
    const jobTabs = ["appt", "pending", "finished", "next"];
    let curloc = new URL(document.location.href);
    const navigate = useNavigate();
    const [infoo, setInfo] = useState({
        clientId: null,
        idcar: null,
        status: curloc.searchParams.get("status") || "pending",
    });

    const { list1 } = useEffectStateArrayData(
        "/api/getlist/inspections?status=" + infoo.status
    );
    function onChangeFilter(e) {
        let { name, value } = e.target;
        alterSearchQuery(name, value);
        setInfo({ ...infoo, [name]: value });
    }
    function alterSearchQuery(name, value) {
        let tmploc = new URL(document.location.href);
        if (tmploc.searchParams.has(name)) tmploc.searchParams.set(name, value);
        else tmploc.searchParams.append(name, value);
        window.history.replaceState(null, document.title, tmploc);
    }
    const [carInfo, setcarInfo] = useState({
        idcar: undefined,
        region: 2,
        code: 1,
        plate: "00000",
        year: "",
        odo: "",
        seats: "",
        color: "",
        make: "",
        model: "",
    });
    function openModal(id, modalid) {
        // console.log("carid:", id);
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setcarInfo({ ...carInfo, idcar: id });
        else setcarInfo({ ...carInfo, clientId: id });
        openCloseModal(idd, "open");
    }
    return (
        <>
            <BasicDialog id="newcar">
                <NewCar
                    openCar={(id) => {
                        setcarInfo({ ...carInfo, idcar: id });
                        openCloseModal("carwindow", "closeopen", "newcar");
                    }}
                />
                {/* <FoldedSection title="recent cars">
                    <RenderCars
                        openCar={(id) => {
                            setcarInfo({ ...carInfo, idcar: id });
                            openCloseModal("carwindow", "closeopen", "newcar");
                        }}
                    />
                </FoldedSection> */}
            </BasicDialog>
            <BasicDialog id="carwindow">
                {carInfo.idcar && (
                    <RenderCarWithInspection
                        minimal={false}
                        key={carInfo?.idcar}
                        idcar={carInfo?.idcar}
                    />
                )}
            </BasicDialog>
            <div className="checkin min-[1024px]:p-2 grid    max-w-[63rem]  mx-auto ">
                <div className="grid place-items-center max-sm:grid-cols-1 grid-cols-2 ">
                    <ClockBig />
                    <ButtonSubmit onClick={() => openModal(null, "newcar")}>
                        <IconSmall src="/public/images/caricon.svg"></IconSmall>
                        + car
                    </ButtonSubmit>
                </div>
                <div className=" flex  gap-1 bg-gray-400 py-1  justify-center flex-wrap">
                    {list1?.map((obj, ind) => (
                        <RenderPlateInspection
                            datein={
                                infoo.status == "pending"
                                    ? obj.created
                                    : obj[infoo.status]
                            }
                            display1=" grid   bg-gray-300 "
                            key={`withdate  ${ind} ${obj?.idjob}`}
                            plateobj={obj}
                        />
                    ))}
                </div>
            </div>
        </>
    );
    function openCheckinEditor(checkinId) {
        navigate("/nav/job/" + checkinId);
    }
}
