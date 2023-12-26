import React, { useContext } from "react";
import { LoadingState } from "../../context/LoadingContext";
import "./button.css";

export default function ButtonGreen({ children, title, ...props }) {
    const { load } = useContext(LoadingState);
    return (
        <button
            {...props}
            disabled={load}
            className="mybtn green m-1 px-4  flex items-center justify-center gap-2"
        >
            {children}
            {title} {load ? "..." : ""}
        </button>
    );
}
