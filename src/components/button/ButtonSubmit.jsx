import React, { useContext } from "react";
import { LoadingState } from "../../context/LoadingContext";
import "./button.css";

export default function ButtonSubmit({
    children,
    className = null,
    title,
    disableOnClick = false,
    disabled = false,
    ...props
}) {
    const { load, setLoad } = useContext(LoadingState);
    return (
        <button
            {...props}
            disabled={load || disabled}
            className={className || "btn-blue  "}
        >
            {children || title}
        </button>
    );
}
