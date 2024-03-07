import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RenderClients from "../../features/clients/RenderClients";
import BasicDialog from "../../components/dialog/BasicDialog";
import NewClient from "../../features/clients/NewClient";
import RenderClient from "../../features/clients/RenderClient";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import RenderObject from "../../features/clients/RenderObject";
import BasicTable from "../../components/tables/BasicTable";
import xaxios from "../../utils/xaxios";
import { openCloseModal } from "../../utils/userInterface";
import ClockBig from "../../components/ClockBig";

export default function AppointmentPage() {
    const location = useLocation();
    const locationState = location.state;
    useEffect(() => {
        // console.log(location);
        if (locationState?.idclient) {
            openClient(locationState.idclient);
        }
    }, [locationState]);

    const newClientModalid = "newClientDialog";
    const newAppointmentModalid = "newAppointmentDialog";
    const viewAppointmentModalid = "viewAppointmentDialog";
    const [info, setInfo] = useState({ editId: 0, apptid: 0 });
    const [refreshlist, setrefreshlist] = useState(0);
    // const navigate = useNavigate();
    return (
        <main className="appointment grid gap-1">
            <ClockBig />
            <h2>Appointments</h2>
            <button
                onClick={() => {
                    // navigate("?newclient")
                    openCloseModal(newClientModalid, "open");
                }}
                className="btn-cyn"
            >
                + Add New Client
            </button>
            <BasicDialog id={newClientModalid}>
                <NewClient openClient={openClient} modal={newClientModalid} />
                <h2>registered clients</h2>
                <RenderClients openClient={openClient} />
            </BasicDialog>
            <BasicDialog id={newAppointmentModalid}>
                {info.editId && (
                    <RenderClient
                        key={info.editId}
                        clientid={info.editId}
                        modal={newAppointmentModalid}
                        openAppt={manageNewregistration}
                        userDataUp={userDataUp}
                    />
                )}
            </BasicDialog>
            <BasicDialog id={viewAppointmentModalid}>
                {info.apptid && (
                    <RenderAppt
                        key={info.apptid}
                        apptid={info.apptid}
                        modal={viewAppointmentModalid}
                    />
                )}
            </BasicDialog>
            <RenderApptList
                key={refreshlist}
                rowObjectUP={(obj) => openEditAppt(obj?.idappt)}
            />
        </main>
    );
    function openClient(clientid) {
        setInfo({ ...info, editId: clientid });
        // document.getElementById(newClientModalid)?.close();
        // openCloseModal(newClientModalid, "close");
        openCloseModal(newAppointmentModalid, "open");
    }
    function manageNewregistration(clientid) {
        setrefreshlist(refreshlist + 1);
        openEditAppt(clientid);
    }
    function openEditAppt(apptid) {
        setInfo({ ...info, editId: null, apptid });
        const dialogs = document.querySelectorAll("dialog");
        dialogs.forEach((dialog) => dialog.close());
        openCloseModal(viewAppointmentModalid, "open");
    }
    function userDataUp(datain) {
        // console.log(datain);return;
        xaxios
            .post("/api/addnew/appt", datain)
            .then((dd) => {
                if (dd.insertId) {
                    openEditAppt(dd.insertId);
                }
            })
            .catch(console.log);
    }
}

function RenderAppt({ apptid = null }) {
    const { data } = useEffectStateSingleData(
        "/api/getsingle/appt?id=" + apptid
    );
    let filteredData = data && data[0];
    return data && <RenderObject obj={filteredData} />;
}
function RenderApptList({ rowObjectUP = () => null }) {
    const { list1 } = useEffectStateArrayData("/api/getlist/appt");
    return (
        <BasicTable data={list1} rowObjectUP={rowObjectUP} color=" bgblue " />
    );
}
