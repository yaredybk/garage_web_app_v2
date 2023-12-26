import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../../dbFunction";
import "./comp.css";
import "./login.css";
import axios from "axios";
import { axioslinks } from "../../preset/Var";
import Loading from "../Loading.jsx";
import { Link } from "react-router-dom";
export default function LogIn2Supabase() {
    const [credd, setCredd] = useState({
        message: null,
        isregistered: null,
        username: null,
        offline: false,
    });
    const [load, setLoad] = useState(true);
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [networkLocation, setnetworkLocation] = useState("local");
    const [credOnline, setCredOnline] = useState(null);
    useEffect(() => {
        get_user_online();
        let uname = localStorage.getItem("username");
        let tmp1 = localStorage.getItem("status");
                tmp1 = tmp1 ? JSON.parse(tmp1) : {};
                tmp1 = tmp1?.onlineStatus || tmp1?.localStatus ? tmp1 : {};
                if (!uname) {
                    setCredd({
                message: null,
                isregistered: null,
                username: null,
            });
            setLoad(false);
            return;
        }
        let ress = false;
                axios
            .post(axioslinks.devDbLink + "/login")
            .then((res) => {
                if (res.data?.name) {
                    uname= res.data?.name
                }
                setCredd({ ...credd, isregistered: 1, username: uname });
                    localStorage.setItem("username", uname);
                    localStorage.setItem(
                        "status",
                        JSON.stringify({ ...tmp1, localStatus: "authorized" })
                    );
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    setCredd({ ...credd, isregistered: null, username: null });
                    localStorage.setItem(
                        "status",
                        JSON.stringify({ ...tmp1, localStatus: "unauthorized" }))
                } else {
                    setCredd({ ...credd, isregistered: true, username: uname?uname:null ,offline:true});
                    localStorage.setItem(
                        "status",
                        JSON.stringify({ ...tmp1, localStatus: "offline" }))
                }
                
            })
            .finally(() => {
                setLoad(false);
            });
    }, []);

    return (
        <div className="login1">
            {load && <Loading />}
            <div id="login1con">
                <div className="headerpic">
                    <p>Wondwosen Garage DataBase</p>
                </div>
                {credd.isregistered ? (
                    <div className="grid grid-cols-3 gap-1 p-1 border-b border-black bg-gray-800">
                        <Link
                            className=" py-1 bg-blue-400 grid items-center place-items-center px-3 rounded-lg "
                            to={"/"}
                        >
                            <img
                                className="   h-6 w-auto"
                                src="/images/home.svg"
                                alt="home"
                            />
                        </Link>
                        <Link
                            className="  py-1 bg-blue-200 grid place-items-center overflow-hidden rounded-lg"
                            to={"/nav/active/Activejobs"}
                        >
                            <img
                                className=" overflow-hidden  h-6 w-auto"
                                src="/images/wgarage5.webp"
                                alt="Active"
                            />
                        </Link>
                        <Link
                            className=" py-1 bg-blue-400 grid items-center place-items-center px-3 rounded-lg "
                            to={"/advancedsearch"}
                        >
                            <img
                                className="   h-6 w-auto"
                                src="/images/search.svg"
                                alt="search"
                            />
                        </Link>
                    </div>
                ) : null}
                {load && <Loading />}
                <form onSubmit={(e) => login_local(e)}>
                    <div className="grid z-10">{load && <Loading />}</div>
                    <span className="title1 flex items-center gap-2">
                        <span className="p-1 px-4 rounded-md bg-gray-600 text-white text-sm font-bold">
                            {networkLocation}
                        </span>
                        <span className="p-1 px-4 rounded-md bg-gray-300 text-black text-sm font-bold">
                            {networkLocation === "local"
                                ? credd.isregistered
                                    ? "INFO"
                                    : "LOGIN"
                                : null}
                            {networkLocation === "online"
                                ? credOnline?.role === "authenticated"
                                    ? "INFO"
                                    : "LOGIN"
                                : null}
                        </span>
                    </span>
                    {networkLocation === "local" &&
                        (credd.isregistered ? (
                            <>
                                <div className="flex my-2  items-center gap-2">
                                    <img
                                        className=" "
                                        src="/images/approved-profile.svg"
                                        alt="avatar"
                                    />
                                    <input
                                        style={{ paddingRight: "1rem" }}
                                        readOnly
                                        className=" text-center pt-0 "
                                        name="r_name"
                                        value={credd.username}
                                    />
                                </div>
                                <input
                                // disabled={credd.offline}
                                    className=" bg-blue-200 m-2"
                                    value="LogOut"
                                    type="submit"
                                ></input>
                            </>
                        ) : (
                            <>
                                <div className="input">
                                    <img
                                        src="/images/unapproved-profile.svg"
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
                                        pattern="[A-Za-z0-9-_]{5,20}"
                                        title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
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
                                    <img src="/images/password.svg" alt="" />
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
                                            pass
                                                ? "placeholderup"
                                                : "placeholder"
                                        }
                                    >
                                        Password
                                    </label>
                                </div>
                                <input
                                    className=" login-btn"
                                    value="LogIn"
                                    type="submit"
                                />
                            </>
                        ))}
                    {networkLocation === "online" &&
                        (credOnline?.role === "authenticated" ? (
                            <>
                                <div className="flex my-2  items-center gap-2">
                                    <img
                                        className="  "
                                        src="/images/approved-profile.svg"
                                        alt="avatar"
                                    />
                                    <input
                                        readOnly
                                        className=" text-center pt-0 w-auto "
                                        name="r_name"
                                        value={credOnline?.email}
                                    />
                                </div>
                                <input
                                    className=" bg-blue-200 m-2"
                                    value="LogOut"
                                    type="submit"
                                />
                            </>
                        ) : (
                            <button
                                onClick={() => signinwithgoogle()}
                                className="p-2 w-full items-center justify-center gap-4 my-2 flex bg-white text-blue-700 font-bold "
                            >
                                <svg
                                    viewBox="0 0 48 48"
                                    width="21px"
                                    height="21px"
                                >
                                    <path
                                        fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                    ></path>
                                    <path
                                        fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                    ></path>
                                    <path
                                        fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                    ></path>
                                    <path
                                        fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                    ></path>
                                </svg>
                                Sign in with Google
                            </button>
                        ))}
                </form>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-400">
                    <button
                        onClick={() => setnetworkLocation("local")}
                        className={
                            networkLocation === "local"
                                ? "bg-orange-500 p-1 text-white font-bold text-xl relative"
                                : "bg-gray-300 p-1 text-black font-bold text-xl relative"
                        }
                    >
                        Local
                        <span className="absolute right-0 top-0">
                            <img
                                className={
                                    credd?.isregistered
                                        ? " h-7 w-7 bg-green-400 rounded-full "
                                        : " h-7 w-7 bg-red-500 rounded-full "
                                }
                                src={
                                    credd?.isregistered
                                        ? "/images/verified.svg"
                                        : "/images/close-circle.svg"
                                }
                                alt="status"
                            />
                        </span>
                    </button>
                    <button
                        onClick={() => setnetworkLocation("online")}
                        className={
                            networkLocation === "online"
                                ? "bg-orange-500 p-1 text-white font-bold text-xl relative"
                                : "bg-gray-300 p-1 text-black font-bold text-xl relative"
                        }
                    >
                        Online
                        <span className="absolute right-0 top-0">
                            <img
                                className={
                                    credOnline
                                        ? " h-7 w-7 bg-green-400 rounded-full "
                                        : " h-7 w-7 bg-red-500 rounded-full "
                                }
                                src={
                                    credOnline
                                        ? "/images/verified.svg"
                                        : "/images/close-circle.svg"
                                }
                                alt="status"
                            />
                        </span>
                    </button>
                </div>
                <div className="contactme place-items-center">
                    <div>
                        <p>Designed and deployed by </p>
                        <p>
                            <b>Yared Bekuru</b>
                        </p>
                        <div>
                            <a
                                className=" flex items-center gap-2"
                                href={`tel:+251933060604`}
                            >
                                <>
                                    <img
                                        className="b-image h-6 inline"
                                        src="/images/phone.png"
                                        alt="call"
                                    />
                                    <span> +251933060604</span>
                                </>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    function signinwithgoogle() {
        supabase.auth
            .signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.origin.toString(),
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            })
            .then((res) => {
                if (res.error) {
                    console.log(res.error);
                } else {
                    console.log(res.data);
                }
            });
    }
    function login_local(e) {
        function tmpfun2online(ss) {
            let tmp1 = localStorage.getItem("status");
            tmp1 = tmp1 ? JSON.parse(tmp1) : {};
            tmp1 = tmp1?.onlineStatus || tmp1?.localStatus ? tmp1 : {};
            localStorage.setItem(
                "status",
                JSON.stringify({ ...tmp1, onlineStatus: ss })
            );
        }
        if (load) return;
        setLoad(true);
        if (e === "signup_online") {
            const tempcred = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
            };
            supabase.auth
                .signUp(tempcred, {
                    resizeTo: window.location.origin.toString(),
                })
                .then((res) => {
                    if (res?.error) {
                    } else if (res.data) {
                        setCredOnline(res.data?.user);
                    }
                })
                .finally(() => {
                    setLoad(false);
                });
            return;
        }
        e.preventDefault();
        if (networkLocation === "local") {
            const tempcred = {
                username: e.target?.username?.value,
                password: e.target?.password?.value,
            };
            let tmpurl = credd.isregistered ? "logout" : "login";
            axios
                .post(`${axioslinks.devDbLink}/${tmpurl}`, tempcred)
                .then((res) => {
                    localStorage.setItem("username", tempcred.username);
                    setCredd({
                        ...credd,
                        isregistered: 1,
                        username: tempcred.username,
                    });
                })
                .catch((err) => {
                    if (err.response.status == 401) {
                        localStorage.removeItem("username");
                        setCredd({
                            ...credd,
                            isregistered: null,
                            username: null,
                        });
                    } else console.log(err);
                })
                .finally(() => {
                    setLoad(false);
                });
        } else {
            if (credOnline) {
                supabase.auth
                    .signOut().finally(()=>{
                        tmpfun2online("unauthorized")
                        console.log(error);
                        setCredOnline(null);
                        setLoad(false);
                    })
                return;
            }
            const tempcred = {
                email: e.target?.email?.value,
                password: e.target?.password?.value,
            };
            supabase.auth
                .signInWithPassword(tempcred)
                .then((res) => {
                    if (res.error) {
                        setCredOnline(null);
                    }
                    setCredOnline(res.data?.user);
                })
                .finally(() => {
                    setLoad(false);
                });
        }
    }

    function get_user_online() {
        function tmpFun(ss) {
            let tmp1 = localStorage.getItem("status");
            tmp1 = tmp1 ? JSON.parse(tmp1) : {};
            tmp1 = tmp1?.onlineStatus || tmp1?.localStatus ? tmp1 : {};
            localStorage.setItem(
                "status",
                JSON.stringify({ ...tmp1, localStatus: ss })
            );
        }
        setLoad(true);
        supabase.auth
            .getUser()
            .then((res) => {
                if (res.error) {
                    console.log(res.error);
                } else {
                    setCredOnline(res.data?.user);
                    tmpFun(res.data?.user?.role);
                }
            })
            .finally(() => {
                setLoad(false);
            });
    }
}
