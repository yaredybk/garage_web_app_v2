import { useState, useEffect, useContext } from "react";
import "./login.css";
import axios from "axios";
import { baseurl2 } from "../../utils/xaxios";
import { openCloseMiniPop } from "../../utils/userInterface";
import { AuthState } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ContactMe from "../../components/ContactMe";
import IconSmall from "../../components/IconSmall";

export default function LogIn2({ creddin, onSetCreed = () => null }) {
    const credd = useContext(AuthState);
    const [load, setLoad] = useState(false);
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    return (
        <main className="login1 bg-image">
            <div id="login1con">
                <div className="headerpic">
                    <p>Daniel Garage System</p>
                </div>
                {/* header urls */}
                {credd.isregistered ? (
                    <div className="flex gap-1 flex-wrap">
                        <Link
                            className=" homebtn flex flex-1 items-center text-center gap-2  px-3 rounded-lg grid-cols-2"
                            to="/"
                            replace
                        >
                            <IconSmall
                                className="   h-6 w-auto"
                                src="/public/images/home.svg"
                                alt="home"
                            />
                            <span className="  text-black">Home</span>
                        </Link>
                    </div>
                ) : null}
                <form onSubmit={(e) => loginf(e)}>
                    <span className="title1">
                        {credd.isregistered ? "USER INFO" : "LOGIN"}
                    </span>
                    {credd.isregistered ? (
                        <>
                            <div className="input">
                                <IconSmall
                                    src="/public/images/approved-profile.svg"
                                    alt="user"
                                />
                                <input
                                    readOnly
                                    className=" registered  "
                                    name="r_name"
                                    value={credd.username}
                                    // pattern="[A-Za-z0-9\\-_] {5,20}"
                                    // title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
                                />
                            </div>
                            <div className="input">
                                <IconSmall
                                    src="/public/images/accountgroup.svg"
                                    alt="role"
                                />
                                <input
                                    readOnly
                                    className=" registered  "
                                    name="r_name"
                                    value={credd.role}
                                    // pattern="[A-Za-z0-9\\-_] {5,20}"
                                    // title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
                                />
                            </div>
                            <button
                                className=" bg-blue-200 m-2"
                                value="LogOut"
                                type="submit"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="input">
                                <IconSmall
                                    src="/public/images/unapproved-profile.svg"
                                    alt=""
                                />
                                <input
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    value={credd.username}
                                    onChange={(e) => {
                                        credd.setUser({
                                            ...credd,
                                            username: e.target.value,
                                        });
                                    }}
                                    // pattern="[A-Za-z0-9\\-_] {5,20}"
                                    // title="Username must be between 5-20 characters and can only contain letters, numbers, underscores, hyphens or periods."
                                />
                                <label
                                    htmlFor="username"
                                    className={
                                        credd.username
                                            ? "placeholderup"
                                            : "placeholder"
                                    }
                                >
                                    user name
                                </label>
                            </div>
                            <div className="input">
                                <IconSmall
                                    src="/public/images/password.svg"
                                    alt=""
                                />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={pass}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                    }}
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className={
                                        pass ? "placeholderup" : "placeholder"
                                    }
                                >
                                    password
                                </label>
                            </div>
                            <br />
                            <button
                                className=" login-btn"
                                value="LogIn"
                                type="submit"
                            >
                                Login
                            </button>
                        </>
                    )}
                </form>
                <ContactMe />
            </div>
        </main>
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
        if (tmpurl === "login")
            axios
                .post(baseurl2 + `/api/auth/${tmpurl}`, tempcred)
                .then((res) => {
                    //    console.log( res.headers,res)
                    // console.log(res);
                    let { username, role } = res.data;
                    localStorage.setItem("username", tempcred.username);
                    credd.setUser({
                        ...credd,
                        isregistered: 1,
                        username,
                        role,
                    });
                    openCloseMiniPop("logged in !", "open", "green", 4000);
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 1000);
                })
                .catch((err) => {
                    if (err.response.status == 401) {
                        openCloseMiniPop(
                            "inccorect username or password",
                            "open",
                            "red",
                            10000
                        );
                        localStorage.removeItem("username");
                        credd.setUser({
                            ...credd,
                            isregistered: false,
                        });
                    } else {
                        openCloseMiniPop("login Error", "open", "red");
                        console.log(err);
                    }
                })
                .finally(() => {
                    setLoad(false);
                });
        else
            axios
                .post(baseurl2 + `/api/auth/${tmpurl}`, tempcred)
                .then((res) => {})
                .catch((err) => {
                    if (err.response.status == 401) {
                        openCloseMiniPop("logged out !", "open", "red", 10000);
                        localStorage.removeItem("username");
                        credd.setUser({
                            ...credd,
                            isregistered: false,
                            username: "",
                        });
                    } else {
                        openCloseMiniPop("login Error", "open", "red");
                        console.log(err);
                    }
                })
                .finally(() => {
                    setLoad(false);
                });
    }
    // }
}
