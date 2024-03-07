import React from "react";

export default function MainContainer({ children,className="", ...props }) {
    return (
        <main
            className={
                " bg-white  printgrid   gap-1  p-2 grid    max-w-[24cm]  mx-auto " + className
            }
        >
            {children}
        </main>
    );
}
