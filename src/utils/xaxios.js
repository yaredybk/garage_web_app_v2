import axios from "axios";
import { openCloseMiniPop } from "./userInterface";

const { hostname, protocol, host, port } = window.location;
const devport = "3030";
const devSecurePort = "5005";
let devlinktmp = protocol + "//" + hostname + ":5100";
const baseurl = process.env.NODE_ENV === "development" ? devlinktmp : "";
export const baseurl2 = baseurl;
export async function GetData(url, setloading = () => null) {
    // loadingReducer?.dispatch(true);
    // const { load } = useContext(LoadingState);
    // console.log(load);
    return new Promise((resolve, reject) => {
        setloading(true);
        if (status == "local") {
            axios
                .get(baseurl + url)
                .then((res) => {
                    // console.log(res.data);
                    resolve(res.data);
                })
                .catch((err) => {
                    console.log(url, err?.response);
                    openCloseMiniPop(
                        "fail! " +
                            (err?.response?.data?.sqlMessage
                                ? err?.response?.data?.sqlMessage
                                : "E0"),
                        "open",
                        "red",
                        5000
                    );
                    reject(err);
                })
                .finally(() => {
                    setloading(false);
                });
        } else {
            axios
                .get(baseurl + url)
                .then((res) => {
                    // console.log(res.data);
                    resolve(res.data);
                })
                .catch((err) => {
                    console.log(url, err?.response);
                    openCloseMiniPop(
                        "fail! " + (err.response?.data?.sqlMessage || "E0"),
                        "open",
                        "red",
                        5000
                    );
                    reject(err);
                })
                .finally(() => {
                    setloading(false);
                });
        }
    });
}
// please pass the set loading function
async function post(url, data, setloading = () => null) {
    return new Promise((resolve, reject) => {
        var buttons = document.querySelectorAll("button:enabled");
        for (var i = 0; i < buttons.length; i++) {
            // Disable the button
            buttons[i].disabled = true;
        }
        // const { load, setLoad } = useContext(LoadingState);
        // if (load) r]eturn reject({ msg: "loading data please try again" });
        setloading(true);
        axios
            .post(baseurl + url, data)
            .then((res) => {
                let data = res.data;
                // console.log(data);
                resolve(data);
                openCloseMiniPop(
                    "sucess! " +
                        (res.data?.sqlMessage ? res.data?.sqlMessage : ""),
                    "open",
                    "green"
                );
            })
            .catch((err) => {
                console.log(url, err?.response);
                setloading(false);
                openCloseMiniPop(
                    "fail! " +
                        (err?.response?.data?.sqlMessage
                            ? err?.response?.data?.sqlMessage
                            : "E0"),
                    "open",
                    "red",
                    6000
                );
                reject(err);
            })
            .finally(() => {
                setloading(false);
                for (var i = 0; i < buttons.length; i++) {
                    // Disable the button
                    buttons[i].disabled = false;
                }
            });
    });
}
async function delete_(url, data, setloading = () => null) {
    return new Promise((resolve, reject) => {
        var buttons = document.querySelectorAll("button:enabled");
        for (var i = 0; i < buttons.length; i++) {
            // Disable the button
            buttons[i].disabled = true;
        }
        // const { load, setLoad } = useContext(LoadingState);
        // if (load) r]eturn reject({ msg: "loading data please try again" });
        setloading(true);
        axios
            .delete(baseurl + url, data)
            .then((res) => {
                let data = res.data;
                // console.log(data);
                resolve(data);
                openCloseMiniPop(
                    "sucess! " +
                        (res.data?.sqlMessage ? res.data?.sqlMessage : ""),
                    "open",
                    "green"
                );
            })
            .catch((err) => {
                console.log(url, err?.response);
                setloading(false);
                openCloseMiniPop(
                    "fail! " +
                        (err?.response?.data?.sqlMessage
                            ? err?.response?.data?.sqlMessage
                            : "E0"),
                    "open",
                    "red",
                    6000
                );
                reject(err);
            })
            .finally(() => {
                setloading(false);
                for (var i = 0; i < buttons.length; i++) {
                    // Disable the button
                    buttons[i].disabled = false;
                }
            });
    });
}
const xaxios = { post, GetData, delete: delete_ };
export default xaxios;
