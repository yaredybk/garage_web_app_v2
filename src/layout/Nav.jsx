import { useLocation, useNavigate } from "react-router-dom";
import "./pageheader.css";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { LoadingState } from "../context/LoadingContext";

export default function Nav() {
    const max = 30; // max history length to track
    const navIcon = {
        jobs: "/public/images/spanner.svg",
        appt: "/public/images/call.svg",
        pending: "/public/images/spanner.svg",
        finished: "/public/images/doneall.svg",
        next: "/public/images/upload.svg",
    };
    const locc = useLocation();
    const [locationhis, setLocationhis] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // if (locationhis[max] == locc.pathname) return;
        if (locc.pathname == "/") {
            setLocationhis([]);
            return;
        }
        let tmp = [];
        tmp = locationhis;
        let mm = matchHis(locc.pathname);
        if (mm) {
            mm = -mm;
            for (let index = 0; index < mm; index++) {
                // if(tmp.length > max)
                tmp.pop();
                // tmp.unshift(null);
            }
            // }
            // else if (locationhis[2] == locc.pathname) {
            //     tmp = [null, tmp[0], tmp[1], tmp[2]];
        } else {
            if (tmp.length > max) tmp.shift();
            tmp.push(locc.pathname);
        }
        setLocationhis([...tmp]);
    }, [locc.pathname]);
    function matchHis(regexp) {
        let ind = locationhis.findIndex((his = "") => his?.endsWith(regexp));
        if (ind == -1) return null;
        ind = -(locationhis.length - ind - 1);
        return ind;
    }
    let navbtn = locc?.pathname
        ?.split("/")
        ?.slice(2, 4)
        .filter((val, ind) => val);
    return (
        <header id="pageheader">
            <div className="nav   ">
                <button className="back" onClick={() => navigate(-1)}>
                    <img className=" h-7" src="/public/images/arrowback.svg" />
                </button>
                <button
                    className={
                        locc.pathname == "/" ? "activenav home" : " home"
                    }
                    onClick={() => {
                        if (locationhis.at(-1) != "/") navigate("/");
                        else navigate(-locationhis.length);
                    }}
                >
                    <img src="/public/images/home.svg" />
                </button>
                {navbtn.map((path, ind4) => (
                    <button
                        className={
                            ind4 == 1 || locc.pathname.endsWith(path)
                                ? "activenav"
                                : ""
                        }
                        key={path}
                        onClick={() => {
                            let back = matchHis(path);
                            if (back == null) {
                                back = -locationhis.length;
                                window.history.go(back);
                            } else window.history.go(back);
                        }}
                    >
                        {navIcon[path] && <img src={navIcon[path]} />}
                        {path}
                        {ind4 == 1 &&
                            locc.pathname.split(path + "/")[1] &&
                            " / " + locc.pathname.split(path + "/")[1]}
                    </button>
                ))}
            </div>
        </header>
    );
}
