import { useState, useRef, useEffect } from "react";

const mimeType = "audio/webm";
const AudioRecorder = () => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    useEffect(() => {
        // getMicrophonePermission();

        return () => {};
    }, []);

    const getMicrophonePermission = async () => {
        // if ("MediaRecorder" in window) {
        if (navigator.mediaDevices) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };
    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };
    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
        };
    };
    return (
        <div className="  grid place-items-center bg-white ">
            <div className="m-auto">
                <h2 className="m-auto font-bold text-center p-2 text-lg">
                    Audio Recorder
                </h2>
                <main className="grid gap-2">
                    {audio ? (
                        <div className="audio-container">
                            <audio src={audio} controls></audio>
                            <a
                                download
                                href={audio}
                                className=" bg-blue-400 flex gap-2 w-fit rounded-md  p-2 "
                            >
                                <img
                                    className="h-6 w-6"
                                    src="/public/images/download.svg"
                                    alt="mic"
                                />
                                Download Recording
                            </a>
                        </div>
                    ) : null}
                    <span className="audio-controls w-fit flex rounded-md overflow-hidden">
                        <span className="  flex gap-2  p-2 ">
                            <img
                                className="h-6 w-6"
                                src="/public/images/mic.svg"
                                alt="mic"
                            />
                        </span>
                        {!permission ? (
                            <button
                                className=" bg-blue-400 flex gap-2  p-2 "
                                onClick={getMicrophonePermission}
                                type="button"
                            >
                                <img
                                    className="h-6 w-6"
                                    src="/public/images/mic.svg"
                                    alt="mic"
                                />
                                Get Microphone
                            </button>
                        ) : null}
                        {permission && recordingStatus === "inactive" ? (
                            <button
                                className=" bg-green-400 flex gap-2  p-2 "
                                onClick={startRecording}
                                type="button"
                            >
                                <img
                                    className="h-6 w-6"
                                    src="/public/images/radio_button_checked.svg"
                                    alt="start"
                                />
                                {audio ? "Record again" : "Start Recording"}
                            </button>
                        ) : null}
                        {recordingStatus === "recording" ? (
                            <button
                                onClick={stopRecording}
                                type="button"
                                className=" bg-red-400 flex gap-2  p-2 "
                            >
                                <img
                                    className="h-6 w-6"
                                    src="/public/images/stop_circle.svg"
                                    alt="stop"
                                />
                                Stop Recording
                            </button>
                        ) : null}
                    </span>
                </main>
            </div>
        </div>
    );
};
export default AudioRecorder;
