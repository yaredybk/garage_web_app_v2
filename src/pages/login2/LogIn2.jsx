import { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import { baseurl2 } from "../../utils/xaxios";
import { openCloseMiniPop } from "../../utils/userInterface";
import { useNavigate } from "react-router-dom";

export default function LogIn2({ creddin, onSetCreed = () => null }) {
    const [credd, setCredd] = useState({
        message: null,
        isregistered: null,
        username: null,
        status: false,
        ...creddin,
    });
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    useEffect(() => {
        onSetCreed(credd);
    }, [credd]);

    useEffect(() => {
        let uname = localStorage.getItem("username");
        if (!uname) {
            setCredd({
                message: false,
                isregistered: false,
                username: false,
            });
            return;
        }
        if (process.env.NODE_ENV === "development")
            document.title = uname + "@" + document.location.host.split(".")[3];
        else document.title = uname;
        axios
            .post(baseurl2 + "/auth/login", {}, { timeout: 500 })
            .then((res) => {
                localStorage.setItem("status", "local");
                toggleOfflineInSW("local");
                setCredd({ ...credd, isregistered: true, status: "local" });
            })
            .catch((err) => {
                if (!err.response) {
                    localStorage.setItem("status", "noserver");
                    setCredd({
                        ...credd,
                        isregistered: true,
                        status: "noserver",
                    });
                } else if (err.response.status == 401) {
                    localStorage.setItem("status", "unauthorized");
                    setCredd({
                        ...credd,
                        isregistered: false,
                        status: "unauthorized",
                    });
                } else {
                    localStorage.setItem("status", "unknown");
                    setCredd({
                        ...credd,
                        isregistered: true,
                        status: "noserver",
                    });
                }
            })
            .finally(() => {});
    }, []);

    return (
        <div className="login1">
            <div id="login1con">
                <div className="headerpic">
                    <p>Daniel Garage DataBase</p>
                </div>
                {/* header urls */}
                {credd.isregistered ? (
                    <div className="flex gap-1 flex-wrap">
                        <a
                            className=" homebtn flex flex-1 items-center text-center gap-2  px-3 rounded-lg grid-cols-2"
                            href={"/"}
                        >
                            <img
                                className="   h-6 w-auto"
                                src="/public/images/home.svg"
                                alt="home"
                            />
                            <span className="  text-black">Home</span>
                        </a>
                    </div>
                ) : null}
                <form onSubmit={(e) => loginf(e)}>
                    <span className="title1">
                        {credd.isregistered ? "INFO" : "LOGIN"}
                    </span>
                    {credd.isregistered ? (
                        <>
                            <div className="input relative">
                                <img
                                    className="   translate-x-2 "
                                    src="/public/images/approved-profile.svg"
                                    alt="avatar"
                                />
                                &nbsp;
                                <input
                                    style={{ paddingRight: "1rem" }}
                                    readOnly
                                    className="  pt-0 "
                                    name="r_name"
                                    value={credd.username}
                                    // pattern="[A-Za-z0-9\\-_] {5,20}"
                                    // title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
                                />
                            </div>
                            <input
                                className=" bg-blue-200 m-2"
                                value="LogOut"
                                type="submit"
                            />
                        </>
                    ) : (
                        <>
                            <div className="input">
                                <img
                                    src="/public/images/unapproved-profile.svg"
                                    alt=""
                                />
                                &nbsp;
                                <input
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    id="username"
                                    required
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value);
                                    }}
                                    // pattern="[A-Za-z0-9\\-_] {5,20}"
                                    // title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
                                />
                                <br />
                                <label
                                    htmlFor="username"
                                    className={
                                        userName
                                            ? "placeholderup"
                                            : "placeholder"
                                    }
                                >
                                    UserName
                                </label>
                            </div>
                            <div className="input">
                                <img src="/public/images/password.svg" alt="" />
                                &nbsp;
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={pass}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                    }}
                                    required
                                />
                                <br />
                                <label
                                    htmlFor="password"
                                    className={
                                        pass ? "placeholderup" : "placeholder"
                                    }
                                >
                                    Password
                                </label>
                            </div>
                            <br />
                            <input
                                className=" login-btn"
                                value="LogIn"
                                type="submit"
                            />
                        </>
                    )}
                </form>
                <div className="contactme place-items-center">
                    <div>
                        <p className="m-0">Designed and deployed by </p>
                        <p className="m-0">
                            <b>Yared Bekuru</b>
                        </p>
                        <p className="m-0">
                            Contact :&nbsp; &nbsp;
                            <a href={`tel:+251933060604`}>
                                <>
                                    <img
                                        className="b-image h-6 inline"
                                        src="/public/images/phone.png"
                                        alt="call"
                                    />
                                    <span> +251933060604</span>
                                </>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
    /**
     * loginf - submits the login/logout form to the server
     * @param {event} e form event
     * @returns non
     */
    function loginf(e) {
        e.preventDefault();
        if (load) return;
        setLoad(true);
        const tempcred = {
            username: e.target?.username?.value,
            password: e.target?.password?.value,
        };
        // console.log(tempcred);
        let tmpurl = credd.isregistered ? "logout" : "login";
        axios
            .post(baseurl2 + `/auth/${tmpurl}`, tempcred)
            .then((res) => {
                //    console.log( res.headers,res)
                // console.log(res);
                if (res.status === 201) {
                    localStorage.setItem("username", tempcred.username);
                    setCredd({
                        ...credd,
                        isregistered: 1,
                        username: tempcred.username,
                    });
                    navigate("/nav/login/ok?user=" + tempcred.username, {
                        replace: true,
                    });
                } else {
                    navigate("/nav/login", { replace: true });
                    localStorage.removeItem("username");
                    setCredd({ ...credd, isregistered: null, username: null });
                }
            })
            .catch((err) => {
                if (err.response.status == 401) {
                    openCloseMiniPop(
                        "inccorect username or password",
                        "open",
                        "red"
                    );
                    localStorage.removeItem("username");
                    setCredd({ ...credd, isregistered: null, username: null });
                } else {
                    openCloseMiniPop("login Error", "open", "red");
                    console.log(err);
                }
                navigate("/nav/login", { replace: true });
            })
            .finally(() => {
                setLoad(false);
            });
    }
    // }
}
