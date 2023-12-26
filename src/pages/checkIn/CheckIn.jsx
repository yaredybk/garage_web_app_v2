import { useState } from "react";
import "./checkin.css";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import BasicTable from "../../components/tables/BasicTable";
import { useNavigate } from "react-router-dom";
import OverFlowAuto from "../../components/OverFlowAuto";
import { ManageClientAndCar } from "../../components/ManageCarAndClient";

export default function CheckIn() {
    const navigate = useNavigate();
    const [infoo, setInfo] = useState({ clientId: null, idcar: null });
    const { list1 } = useEffectStateArrayData("/api/getlist/checkin");
    return (
        <div className="checkin">
            <ManageClientAndCar minimal={true} />
            <div className=" bg-white  printgrid   gap-1  p-2 grid    max-w-[24cm]  mx-auto ">
                <h2>Recent Check-in</h2>
                <OverFlowAuto className=" grid ">
                    <BasicTable
                        rowObjectUP={(obj) => openCheckinEditor(obj.idjob)}
                        data={list1}
                        // onRowClickIndex={openCheckinEditor}
                    />
                </OverFlowAuto>
            </div>
        </div>
    );
    function openCheckinEditor(checkinId) {
        // console.log(checkinId);
        navigate("newCheckIn/" + checkinId, { replace: true });
    }
    function openModal(id, modalid) {
        if (!(id || modalid)) return;
        let idd = modalid ? modalid : "clientwindow";
        if (modalid == "carwindow") setInfo({ ...infoo, idcar: id });
        else setInfo({ ...infoo, clientId: id });
        const dialogs = document.querySelectorAll("dialog");
        dialogs.forEach((dialog) => dialog.close());
        document.getElementById(idd)?.showModal();
    }
}
