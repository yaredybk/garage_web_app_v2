// import React  from 'react'
import "./input.css";
export default function InputContainer_v2({
    children,
    htmlFor = "input",
    title = "",
    className = "",
    classNameSuper = "",
    ...props
}) {
    return (
        <div className={"Forminput flex flex-wrap items-center p-1 gap-1 " + className} {...props}>
            <label
                className=" flex-1 w-[6rem] max-w-[6rem]  bg-black text-white -ml-6 p-2 px-3"
                htmlFor={htmlFor}
            >
                {title ? title : htmlFor}
            </label>
            {children}
        </div>
    );
}
