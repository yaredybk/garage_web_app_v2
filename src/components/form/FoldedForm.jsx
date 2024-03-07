// import React  from 'react'
import { useContext } from "react";
import "./form.css";
import { LoadingState } from "../../context/LoadingContext";
import FoldedSection from "../FoldedSection";
export default function FoldedForm({
    children,
    title = "form",
    className = "",
    onSubmit = null,
    onChange = (event)=>null,
    removeEmpty = false,
    formClass = "",
    open=false,
    ...props
}) {
    const { load, setLoad } = useContext(LoadingState);
    const className1 =
        "border-2 border-inherit  px-1  rounded-t-md  " + className;
    return (
        <FoldedSection open={open} title={title}>
            <form
                id={title}
                className={formClass ? formClass : " flex flex-wrap gap-2"}
                onChange={(e) => {
                    if (onChange) onChange(e);
                }}
                onSubmit={(e) => {
                    // setLoad(true);
                    e.preventDefault();
                    if (load) return;
                    var formData = new FormData(e.target);
                    let data = {};
                    data = Object.fromEntries(formData);
                    if (removeEmpty) {
                        Object.keys(data).map((key) => {
                            let obj = data[key];
                            if (obj == null || obj == "") {
                                delete data[key];
                            }
                        });
                    }
                    if (onSubmit) onSubmit(data);
                    else {
                        console.log(data);
                    }
                }}
                {...props}
            >
                {children}
            </form>
        </FoldedSection>
    );
}
