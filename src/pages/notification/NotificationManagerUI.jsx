import React, { useEffect, useState } from "react";
import xaxios from "../../utils/xaxios";
import ClockBig from "../../components/ClockBig";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";

export default function NotificationManagerUI() {
    let nowtime = new Date().toISOString();
    const [myNotifications, setMyNotifications] = useState(null);
    const [lastUpdate, setlastUpdate] = useState(null);
    const [settingsisopen, setsettingsisopen] = useState(false);
    // .replace(/[-T:]/g,"").split(".")[0];

    useEffect(() => {
        xaxios
            .GetData("/api/notification/getupdate")
            .then((data) => {
                // last update
                setlastUpdate(data?.lastUpdate);
                setMyNotifications(data?.data);
            })
            .catch(console.warn);
    }, []);
    function openSettings(statee = 0) {
        if (statee) {
            // document.getElementById("notificationSettings").showModal();
            openCloseModal("notificationSettings", "open");
            setsettingsisopen(true);
        } else {
            openCloseModal("notificationSettings", "close");
            // document.getElementById("notificationSettings").close();
            setsettingsisopen(false);
        }
    }
    return (
        <div className=" bg-blue-400 grid mb-auto">
            <BasicDialog id="notificationSettings">
                <div className="relative bg-white ">
                    {settingsisopen ? <NotificationSettingsRender /> : null}
                </div>
            </BasicDialog>
            <div
                onClick={() => openSettings(1)}
                className="  flex flex-wrap gap-1 place-content-center items-stretch p-1"
            >
                <h3 className="flex bg-blue-500 rounded-md px-2">
                    Notifications
                </h3>
                {/* <img
                    className=" px-2 block  p-0 m-0"
                    src="/public/images/settings.svg"
                    alt="settings"
                /> */}
                <ClockBig />
            </div>
            <div className="h-1 border-t border-gray-700"></div>
            <div className="grid bg-blue-200">
                {myNotifications ? (
                    myNotifications.map((objj, ind) => <span key={ind}></span>)
                ) : (
                    <span className="bg-red-400 rounded-md px-4">
                        NO Notifications found
                    </span>
                )}
            </div>
            <BasicDialog id="notificationSettings">
                <div className="relative bg-white ">
                    {settingsisopen ? <NotificationSettingsRender /> : null}
                </div>
            </BasicDialog>
        </div>
    );
}
function NotificationSettingsRender() {
    useEffect(() => {
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notification");
            setPushstate(false);
        } else if (Notification.permission === "granted") {
            setPushstate(true);
        } else setPushstate(false);
    }, []);

    const [pushstate, setPushstate] = useState(null);
    const [subscriptionstate, setsubscriptionstate] = useState(null);
    async function subscribe_fun(which = "subscribe") {
        console.log(which);
        if (which === "unsubscribe") {
            let answer = window.confirm(
                "UnSubscribe from push notifications ?"
            );
            if (!answer) return;
            xaxios
                .GetData(`/api/notification/unsubscribe`)
                .then((data) => {
                    navigator.serviceWorker.getRegistration().then((reg) => {
                        reg.pushManager
                            .getSubscription()
                            .then((status) => {
                                status.unsubscribe();
                                setsubscriptionstate(false);
                            })
                            .catch((err) => {
                                console.log(err);
                                setsubscriptionstate(false);
                            });
                    });
                })
                .catch((err) => {
                    // window.alert("")
                    // console.log(err);
                    setsubscriptionstate(false);
                });

            return;
        } else if (which === "subscribe") {
            xaxios
                .GetData("/api/notification/getvapid")
                .then(async (data) => {
                    let vapid = data?.vapid;
                    if (!vapid) {
                        console.log(vapid);
                        return window.alert("Error: unable to get key !");
                    }
                    let answer = window.confirm(
                        "Subscribe to push notifications ?"
                    );
                    if (!answer) return;
                    let publicKey = urlBase64ToUint8Array(vapid);
                    const reg = await navigator.serviceWorker.ready;
                    // console.log("reg", reg);
                    reg.pushManager
                        .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: publicKey,
                        })
                        .then((subb) => {
                            sendSubInfo(subb);
                        })
                        .catch((error) => {
                            alert(
                                "unable to subscribe\n" + JSON.stringify(error)
                            );
                        });

                    return;
                })
                .catch((err) => {
                    console.log(err);
                    window.alert("Error: unable to get key !");
                });
            return;
        } else if (which === "check") {
            xaxios
                .GetData(`/api/notification/checksubscription`)
                .then((data) => {
                    // console.log(data);
                    navigator.serviceWorker.getRegistration().then((reg) => {
                        reg.pushManager
                            .getSubscription()
                            .then((status) => {
                                sendSubInfo(status);
                            })
                            .catch((err) => {
                                console.log(err);
                                setsubscriptionstate(false);
                            });
                    });
                })
                .catch((err) => {
                    // window.alert("")
                    // console.log(err);
                    navigator.serviceWorker.getRegistration().then((reg) => {
                        reg.pushManager
                            .getSubscription()
                            .then((status) => {
                                sendSubInfo(status);
                            })
                            .catch((err) => {
                                console.log(err);
                                setsubscriptionstate(false);
                            });
                    });
                    setsubscriptionstate(false);
                });
            return;
        } else if (which == "ask") {
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            } else {
                const status = Notification.permission;
                console.log(status);
                if (status === "granted") {
                    const notification = new Notification("Hi there!", {
                        tag: "check",
                    });
                } else if (status !== "denied") {
                    Notification.requestPermission()
                        .then((permission) => {
                            if (permission === "granted") {
                                setPushstate(true);
                                const notification = new Notification(
                                    "notification allowed",
                                    {
                                        title: "you have allowed notification from your garage system",
                                        tag: "check",
                                    }
                                );
                            } else {
                                console.warn("The user has denied permission.");
                            }
                        })
                        .catch((err) => {
                            console.warn("unable to request permission", err);
                        });
                } else console.warn("The user has denied permission.");
            }
        }
        // Notification.requestPermission().then(function (permission) {
        //     if (permission != "granted") {
        //         alert("Notification failed!");
        //         setPushstate(false);
        //         return;
        //     } else {
        //         setPushstate(true);
        //     }
        // });
    }
    function sendSubInfo(subbin) {
        let sub = JSON.stringify(subbin);

        xaxios
            .post("/api/notification/subscribe", {
                sub,
            })
            .then((data) => {
                setsubscriptionstate(true);
            })
            .catch((err) => {
                setsubscriptionstate(false);
                subbin.unsubscribe();
                return window.alert("Error: unable to subscribe !");
            });
    }
    function urlBase64ToUint8Array(base64String) {
        var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    return (
        <div className="p-3 grid gap-1 rounded-lg">
            <div className="grid grid-cols-2 p-1 bg-gray-300">
                <span>Allow notifications</span>
                {pushstate ? (
                    <button
                        onClick={() => subscribe_fun("off")}
                        className=" ml-auto h-6 overflow-hidden flex w-10 bg-black  rounded-xl items-center"
                    >
                        <img
                            className=" bg-green-500 h-10"
                            src="/public/images/toggle_on.svg"
                            alt="on"
                        />
                    </button>
                ) : (
                    <button
                        onClick={() => subscribe_fun("ask")}
                        className=" ml-auto h-6 overflow-hidden flex w-10 bg-black  rounded-xl items-center"
                    >
                        <img
                            className=" bg-red-500 h-10"
                            src="/public/images/toggle_off.svg"
                            alt="off"
                        />
                    </button>
                )}
            </div>
            {pushstate ? (
                <div className="grid grid-cols-2 p-1 bg-gray-200">
                    <span>Subscribe to push notifications</span>
                    <button
                        onClick={() =>
                            subscriptionstate === null
                                ? subscribe_fun("check")
                                : subscriptionstate === true
                                ? subscribe_fun("unsubscribe")
                                : subscribe_fun("subscribe")
                        }
                        className=" ml-auto h-5 overflow-hidden flex w-fit   rounded-lg items-center"
                    >
                        {subscriptionstate === null ? (
                            <span className="bg-blue-700 font-bold text-white px-2">
                                Check ?
                            </span>
                        ) : subscriptionstate === true ? (
                            <img
                                className=" bg-green-500 h-10"
                                src="/public/images/toggle_on.svg"
                                alt="on"
                            />
                        ) : (
                            <img
                                className=" bg-red-500 h-10"
                                src="/public/images/toggle_off.svg"
                                alt="off"
                            />
                        )}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
