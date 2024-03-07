import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { baseurl2 } from "../utils/xaxios";
import { useNavigate } from "react-router-dom";
import { openCloseMiniPop } from "../utils/userInterface";
let uname = localStorage.getItem("username");
let tmpuser = {
    username: uname,
    message: "",
    isregistered: true,
    setUser: () => null,
    status: false,
    role: "user",
};
if (uname) {
    tmpuser = {
        username: uname,
        message: "",
        isregistered: true,
        setUser: () => null,
        status: false,
        role: "user",
    };
} else {
    tmpuser = {
        username: "",
        message: false,
        isregistered: false,
        setUser: () => null,
        status: false,
        role: "user",
    };
}
export const AuthState = createContext(tmpuser);

export default function AuthContext({ children }) {
    // const [load, dispatch] = useReducer(loadingReducer, false);
    const navigate = useNavigate();
    const [user, setUser] = useState(tmpuser);
    useEffect(() => {
        if (!uname) {
            setUser({
                message: false,
                isregistered: false,
                username: "",
                status: false,
            });
            return;
        }
        if (process.env.NODE_ENV === "development")
            document.title = uname + "@" + document.location.host.split(".")[3];
        else document.title = uname;
        auth(15000);
    }, []);
    function auth(timeout = undefined) {
        axios
            .post(baseurl2 + "/api/auth/login")
            .then((res) => {
                localStorage.setItem("status", "local");
                // toggleOfflineInSW("local");
                let { username, role } = res.data;
                setUser({
                    ...user,
                    isregistered: true,
                    status: "local",
                    username,
                    role,
                });
            })
            .catch((err) => {
                console.warn(err);
                if (!err.response) {
                    localStorage.setItem("status", "noserver");
                    // toggleOfflineInSW("noserver");
                    setUser({
                        ...user,
                        isregistered: true,
                        status: "noserver",
                    });
                    let tt;
                    clearTimeout(timeout);
                    if (timeout)
                        tt = setTimeout(() => {
                            auth(timeout);
                        }, timeout);
                    return;
                }
                if (err.response.status == 401) {
                    // toggleOfflineInSW("local");
                    openCloseMiniPop(
                        " Unauthorized access ! ",
                        "open",
                        "red",
                        10000
                    );
                    localStorage.setItem("status", "unauthorized");
                    setUser({
                        ...user,
                        isregistered: false,
                        status: "unauthorized",
                    });
                    navigate("/nav/login", { replace: true });
                    return;
                }
                localStorage.setItem("status", "noserver");
                    // toggleOfflineInSW("noserver");
                    setUser({
                        ...user,
                        isregistered: true,
                        status: "noserver",
                    });
                    let tt;
                    clearTimeout(timeout);
                    if (timeout)
                        tt = setTimeout(() => {
                            auth(timeout);
                        }, timeout);
            })
            .finally(() => {});
    }
    return (
        <AuthState.Provider value={{ ...user, setUser }}>
            {children}
        </AuthState.Provider>
    );
}
