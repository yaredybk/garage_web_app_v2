import React from "react";
import { Link } from "react-router-dom";
import xaxios, { baseurl2 } from "../../utils/xaxios";
import IconSmall from "./../../components/IconSmall";
import { openCloseModal } from "../../utils/userInterface";

export default function More() {
    const links = [
        {
            url: "/nav/notification/list",
            title: "Notification",
            icon: "/public/images/notification.svg",
        },
        {
            url: "/nav/accounts/history",
            title: "Transaction history",
            icon: "/public/images/history.svg",
        },
        {
            url: "/nav/advancedsearch",
            title: "Search",
            icon: "/public/images/search.svg",
        },
        {
            url: "/nav/appt",
            title: "Appointments",
        },
        {
            url: "/nav/check-in/modifypoints/sedan",
            title: "Edit car image points",
        },
        {
            url: "/nav/accounts/new-registration",
            title: "Account managment",
            icon: "/public/images/account.svg",
        },
        {
            url: "/nav/stocks/new-registration",
            title: "Stock management",
            icon: "/public/images/stock2.png",
        },
        {
            url: "/nav/login",
            title: "Login Page",
            icon: "/public/images/log-in.svg",
        },
        // {
        //     url: "/nav/transaction/new",
        //     title: "make transfer",
        // },
    ];
    const iconHeight = "40px";
    return (
        <div className=" flex flex-wrap items-strech justify-center">
            {process.env.NODE_ENV === "development" && (
                <>
                    {/* <a
                            href={`${baseurl2}/api/cert/rootCA.crt`}
                            download
                            className=" bg-red-200 text-red-700 p-4"
                        >
                            get certificate
                        </a> */}
                    <Link
                        to={"/nav/test"}
                        className=" basis-48 h-20 flex-grow gap-3 flex  items-center justify-center  font-bold text-2xl p-4 bg-blue-50 rounded-lg m-1 "
                    >
                        <IconSmall
                            height={iconHeight}
                            src="/public/images/experiment.svg"
                        />
                        <span>testing</span>
                    </Link>
                </>
            )}

            <Link
                to={"/nav/transaction/new"}
                className="flex-grow  basis-48 h-20  justify-center items-center flex font-bold text-2xl p-4 bg-yellow-300 rounded-lg m-1 "
            >
                Transact
            </Link>
            {links.map((obj, ind) => (
                <Link
                    key={ind}
                    to={obj.url}
                    className=" basis-48 h-20 flex-grow gap-3 flex  items-center justify-center  font-bold text-2xl p-4 bg-blue-100 rounded-lg m-1 "
                >
                    {obj.icon && (
                        <IconSmall height={iconHeight} src={obj?.icon} />
                    )}
                    <span>{obj.title}</span>
                </Link>
            ))}

            <span className=" basis-48 h-20 flex-grow gap-3 flex  items-center justify-center  font-bold text-2xl p-4 bg-green-300 rounded-lg m-1 ">
                <img
                    onClick={() => {
                        openCloseModal("calculator", "open");
                        document.getElementById("result-panel")?.focus();
                    }}
                    className=" max-h-full"
                    src="/public/images/calculate.svg"
                    alt="c"
                />
                Calculator
            </span>
            <Link
                className=" basis-48 h-20 flex-grow gap-3 flex  items-center justify-center  font-bold text-2xl p-4 bg-green-300 rounded-lg m-1 "
                onClick={() => {
                    xaxios.post("/api/dumpdb");
                }}
            >
                <IconSmall
                    height={iconHeight}
                    src="/public/images/download.svg"
                />
                BACKUP DATA
            </Link>
        </div>
    );
}
