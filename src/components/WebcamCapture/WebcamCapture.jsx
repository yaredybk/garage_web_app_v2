import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
const WebcamComponent = () => <Webcam />;

export default function WebcamCapture({ width = 400, height = 400 }) {
    const videoConstraints = {
        width: width,
        height: height,
        facingMode: { exact: "environment" },
    };
    // facingMode: "user", //used for selfie
    const [picture, setPicture] = useState(null);
    const [mirrored, setMirrored] = useState(false);
    const webcamRef = useRef(null);
    const capture = useCallback(() => {
        const pictureSrc = webcamRef.current.getScreenshot();
        setPicture(pictureSrc);
    }, [webcamRef]);
    const getMicrophonePermission = async () => {
        // if ("MediaRecorder" in window) {
        if (navigator.mediaDevices) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
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

    return (
        <div>
            <h2 className="mb-5 text-center">Photo Capture</h2>
            <div>
                {picture ? (
                    <img src={picture} />
                ) : (
                    <Webcam
                        height={400}
                        width={400}
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        mirrored={mirrored}
                        screenshotQuality={0.9}
                    />
                )}
            </div>
            <div className="flex justify-center gap-4">
                <span className=" bg-slate-100 flex w-min rounded-md">
                    <input
                        className="  p-2"
                        id="mirrored"
                        name="mirrored"
                        type="checkbox"
                        checked={mirrored}
                        onChange={(e) => setMirrored(e.target.checked)}
                    />
                    <label className="  p-2" htmlFor="mirrored">
                        Mirror
                    </label>
                </span>

                <span>
                    {picture ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setPicture();
                            }}
                            className=" bg-red-400 rounded-md p-2 px-4"
                        >
                            Retake
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                capture();
                            }}
                            className=" bg-blue-400 flex gap-2 rounded-md p-2 "
                        >
                            <img
                                className="h-6 w-6"
                                src="/public/images/camera.svg"
                                alt="shoot"
                            />
                            Capture
                        </button>
                    )}
                </span>
            </div>
        </div>
    );
}
