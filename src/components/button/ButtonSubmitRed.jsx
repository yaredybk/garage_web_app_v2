import React, { useContext } from "react";
import { LoadingState } from "../../context/LoadingContext";
import "./button.css";

export default function ButtonSubmitRed({
    children,
    title,
    className = "",
    ...props
}) {
    const { load } = useContext(LoadingState);
    return (
        <button
            {...props}
            disabled={load}
            className={
                "mybtn red  px-4  flex items-center justify-center gap-2 " +
                className
            }
        >
            {children}
            {title} {load ? "..." : ""}
        </button>
    );
}
