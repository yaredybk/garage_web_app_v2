import React from "react";
import { Link } from "react-router-dom";
import IconSmall from "../../components/IconSmall";

export default function Footer({ children,hide, id, ...props }) {
    const buttons = [
        {
            className: " flex gap-2 p-2 bg-yellow-300 rounded-md shadow-md",
            to: `/nav/inspections/edit/${id}`,
            src: "/public/images/edit.svg",
            key: "Edit",
        },
        {
            className: " flex gap-2 p-2 bg-yellow-300 rounded-md shadow-md",
            to: `/nav/inspections/payment/${id}`,
            src: "/public/images/transaction.png",
            key: "Payment",
        },
        {
            className: " flex gap-2 p-2 bg-green-300 rounded-md shadow-md",
            to: `/nav/inspections/preview/${id}`,
            src: "/public/images/print.svg",
            key: "Preview",
        },
    ];
    return (
        <div className="float-right mr-2 bottom-4 right-4 left-4 top-4 print:hidden sticky font-bold flex gap-2">
            {children}
            {buttons
                .filter((ele) => hide != ele.key)
                .map((ele, ind) => (
                    <Link {...ele}>
                        <IconSmall src={ele.src} />
                        {ele.key}
                    </Link>
                ))}
            
        </div>
    );
}
