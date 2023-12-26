// import React  from 'react'
import "./input.css";
export default function InputContainer({
    children,
    htmlFor = "input",
    title = "",
    className = "",
    classNameSuper = "",
    ...props
}) {
    return (
        <fieldset
            className={"InputContainer border-faint  rounded-t-md " + className}
            {...props}
        >
            <legend>
                <label htmlFor={htmlFor}>{title ? title : htmlFor}</label>
            </legend>
            {children}
        </fieldset>
    );
}
