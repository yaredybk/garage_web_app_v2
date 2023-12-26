import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import AudioRecorder2 from "../../components/AudioRecorder/AudioRecorder2";
import WebcamCapture from "../../components/WebcamCapture/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture/WebcamCapture2";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";
import Inspection from "../inspection/Inspection";
import Inspections from "../inspection/Inspections";
import NewInspection from "../inspection/EditInspection";
import JobHistory from "../job/JobHistory";

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
    return (
        <div className=" grid   place-items-center ">
            <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
            Inspections
            </div>
            {/* <JobHistory /> */}
            <Inspections/>
            <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
            NewInspection
            </div>
            {/* <NewInspection/> */}
            <div className=" print:hidden bg-black w-full text-center font-bold text-white p-1">
            Inspection 
            </div>
            <Inspection />
            <div className="test_buttons hidden ">
                <PopTestButton />

                <button
                    className="p-4"
                    onClick={() => openCloseModal("webcam1")}
                >
                    webcam1
                </button>
                <button
                    className="p-4"
                    onClick={() => openCloseModal("webcam2")}
                >
                    webcam2
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
            {/* <BasicDialog id="webcam2"><WebcamCapture2 /></BasicDialog> */}
            {/* <BasicDialog id="record2"><AudioRecorder2 /></BasicDialog> */}
            {/* <BasicDialog id="record1"><AudioRecorder /></BasicDialog> */}
        </div>
    );
}
