// import React  from 'react'
import { useContext } from "react";
import "./form.css";
import { LoadingState } from "../../context/LoadingContext";
export default function BasicForm({
    children,
    title = "form",
    className = "",
    onSubmit = null,
    onChange = (event)=>null,
    removeEmpty = false,
    formClass = "",
    ...props
}) {
    const { load, setLoad } = useContext(LoadingState);
    const className1 =
        "border-2 border-inherit  px-1  rounded-t-md  " + className;
    return (
        <fieldset className={className1}>
            {title != "form" &&<legend className=" px-2 font-bold">{title}</legend>}
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
                    if (onSubmit) onSubmit(data,e);
                    else {
                        console.log(data);
                    }
                }}
                {...props}
            >
                {children}
            </form>
        </fieldset>
    );
}
