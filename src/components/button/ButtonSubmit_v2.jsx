import React, { useContext } from "react";
import { LoadingState } from "../../context/LoadingContext";
import "./button.css";
import IconSmall from "../IconSmall";

export default function ButtonSubmit_v2({
    children,
    className = null,
    title,
    disableOnClick = false,
    disabled = false,
    imgProps=undefined,
    ...props
}) {
    const { load, setLoad } = useContext(LoadingState);
    return (
        <button
            {...props}
            disabled={load || disabled}
            className={className || "btn-blue  "}
        >
            {imgProps && <IconSmall {...imgProps}/>}
            {children || title}
        </button>
    );
}
