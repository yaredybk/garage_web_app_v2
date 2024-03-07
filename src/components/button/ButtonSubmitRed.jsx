import React, { useContext } from "react";
import { LoadingState } from "../../context/LoadingContext";
import "./button.css";

export default function ButtonSubmitRed({
    children,
    title,
    disabled=false,
    className = "",
    ...props
}) {
    const { load } = useContext(LoadingState);
    return (
        <button
            {...props}
            disabled={load || disabled}
            className={
                "mybtn red  px-4 py-2  flex items-center justify-center gap-2 " +
                className
            }
        >
            {children}
            {title} {load ? "..." : ""}
        </button>
    );
}
