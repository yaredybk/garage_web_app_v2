import React, { useContext, useEffect } from "react";
import ClockBig from "../../components/ClockBig";
import ContactMe from "../../components/ContactMe";
import { Link } from "react-router-dom";
import "./home.css";
// import { ManageClientAndCar } from "../../components/ManageCarAndClient";
import globalnav from "../../globalNavList.json";
import { AuthState } from "../../context/AuthContext";
import { baseurl2 } from "../../utils/xaxios";
export default function HomePage({ page = "/" }) {
    const navitems = globalnav[page];
    const credd = useContext(AuthState);
    return (
        <main className="homepage ">
            <ClockBig />
            <NoServerButton />
            <div
                className={
                    credd.isregistered ? "home-nav" : ` home-nav unregistered `
                }
            >
                <LoginButton />
                {navitems.map((item, index) => {
                    return (
                        <Link
                            to={credd.isregistered ? item.link : "/"}
                            key={index}
                        >
                            {item.img && <img src={item.img} alt={item.name} />}
                            {item.name}
                        </Link>
                    );
                })}
                <TestingButton />
                <GetCert />
            </div>

            <ContactMe />
        </main>
    );
    function NoServerButton() {
        return (
            credd?.status == "noserver" && (
                <>
                    <div className=" bg-red-200 text-red-800 border-3  border-solid font-bold border-red-800 px-6 py-2 rounded-full animate-ping-1 mx-auto w-fit">
                        garage server is not available !
                    </div>
                    <br />
                    <a
                        href="/"
                        className=" block bg-green-200 text-red-800 border-3  border-solid font-bold border-green-800 px-6 py-2 rounded-full  mx-auto w-fit"
                    >
                        click here to reload
                    </a>
                </>
            )
        );
    }
    function LoginButton() {
        return (
            // process.env.NODE_ENV != "development" &&
            !credd.isregistered && (
                <Link className="login" to={"/nav/login"}>
                    <img
                        className="  animate-bounce "
                        src="/public/images/log-in.svg"
                        alt=""
                    />
                    login
                </Link>
            )
        );
    }
}

function TestingButton() {
    return (
        process.env.NODE_ENV === "development" && (
            <Link
                to={"/nav/test"}
                className=" basis-48 h-20 flex-grow gap-3 flex  items-center justify-center  font-bold text-2xl p-4 bg-blue-50 rounded-lg m-1 "
            >
                <img src="/public/images/experiment.svg" />
                <span>experimental</span>
            </Link>
        )
    );
}
function GetCert() {
    return process.env.NODE_ENV === "development" && (
        <a
            href={`${baseurl2}/api/cert/rootCA.crt`}
            download
            className=" bg-red-200 text-red-700 p-4"
        >
            get certificate
        </a>
    );
}
//  <ManageClientAndCar />
