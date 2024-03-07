import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import AudioRecorder2 from "../../components/AudioRecorder/AudioRecorder2";
import WebcamCapture from "../../components/WebcamCapture/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture/WebcamCapture2";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import Inspection from "../inspection/Inspection";
import Inspections from "../inspection/Inspections";
import NewInspection from "../inspection/EditInspection";
import JobHistory from "../job/JobHistory";
import { useContext, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import xaxios from "../../utils/xaxios";
import ButtonGreen from "../../components/button/ButtonGreen";
import CardInfo1_v1 from "../../layout/CardInfo1_v1";
import RenderPlateJobs from "../../components/RenderPlateJobs";
import RenderPlate3 from "../../components/RenderPlate3";
import CardPlateNo_v1 from "../../layout/CardPlateNo_v1";
import BoxColor_v1 from "../../layout/BoxColor_v1";
import { info } from "autoprefixer";
import RenderObject from "../../features/clients/RenderObject";
import { Link } from "react-router-dom";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import AdvancedForm_v2 from "../../components/form/AdvancedForm_v2";
import AccountSelector_v2 from "../../utils/AccountSelector_v2";
import { LoadingState } from "../../context/LoadingContext";
import TransactMethodSelector from './../../utils/TransactMethodSelector';
import TransactUniversal from "../../components/transaction/TransactUniversal";

export default function TestComponents() {
    function PopTestButton() {
        return (
            <>
                test pop window
                <button
                    onClick={() => {
                        const popnow =
                            document.getElementsByClassName("mini_pop_window");
                        const element = popnow[0];
                        if (element.className?.includes("open")) {
                            openCloseMiniPop("", "close");
                        } else
                            openCloseMiniPop(
                                "test text aeekrser eksr alirh ekrh skhlkhdsf hae kaehria ",
                                "open",
                                "green",
                                1000000
                            );
                        // }
                    }}
                >
                    flip
                </button>
            </>
        );
    }
    const car1 = {
        idjob: 356,
        name: "Mikiyas Debebe",
        idcar: 100,
        make: "mercedes",
        model: "amg-gt",
        code: "5",
        region: 12,
        plate: "B73640",
        odo: 25194,
        created: "09/01",
        finished: "09/01",
    };
    return (
        <div className=" grid   place-items-center ">
            {/* <RenderPlateJobs plateobj={car1} /> */}
            <button
                    className="p-4"
                    onClick={() => openCloseModal("webcam2")}
                >
                    webcam2
                </button>
                <ApiTest />
            <div className="test_buttons hidden ">
                <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
                    Inspections
                </div>
                {/* <JobHistory /> */}
                <Inspections />
                <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
                    NewInspection
                </div>
                {/* <NewInspection /> */}
                <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
                    Inspection
                </div>
                {/* <Inspection /> */}
                <PopTestButton />

                <button
                    className="p-4"
                    onClick={() => openCloseModal("webcam1")}
                >
                    webcam1
                </button>
               
                <button
                    className="p-4"
                    onClick={() => openCloseModal("record2")}
                >
                    record2
                </button>
                <button
                    className="p-4"
                    onClick={() => openCloseModal("record1")}
                >
                    record1
                </button>
            </div>
            {/* <BasicDialog id="webcam1"><WebcamCapture /></BasicDialog> */}
            <BasicDialog id="webcam2"><WebcamCapture2 /></BasicDialog>
            {/* <BasicDialog id="record2"><AudioRecorder2 /></BasicDialog> */}
            {/* <BasicDialog id="record1"><AudioRecorder /></BasicDialog> */}
        </div>
    );
}
function ApiTest() {
    const [data, setData] = useState(null);
    function sendReq({ url = "", method = "", payload = "" }) {
        if (!(method && url)) return;
        console.log(data);
        if (method == "get")
            xaxios
                .get(url)
                .then((res) => {
                    setData(res);
                    console.log(res);
                })
                .catch((err) => {
                    setData(null);
                    console.warn(err);
                });
        else
            xaxios
                .post(url, { payload, url })
                .then((res) => {
                    setData(res);
                    console.log(res);
                })
                .catch((err) => {
                    setData(null);
                    console.warn(err);
                });
    }
    return (
        <BasicForm formClass=" grid gap-2" onSubmit={sendReq}>
            <input type="text" name="url" id="url" className=" w-64" />
            <div className=" flex gap-2 items-stretch ">
                <select name="method" id="methid">
                    {["get", "post"].map((mm) => (
                        <option value={mm} key={mm}>
                            {mm}
                        </option>
                    ))}
                </select>
                <ButtonGreen>SEND</ButtonGreen>
            </div>
            <p>{JSON.stringify(data)}</p>
        </BasicForm>
    );
}

