import React from "react";

export default function MainContainer({ children, ...props }) {
    return (
        <div
            className={
                " bg-white  printgrid   gap-1  p-2 grid    max-w-[24cm]  mx-auto "
            }
        >
            {children}
        </div>
    );
}
