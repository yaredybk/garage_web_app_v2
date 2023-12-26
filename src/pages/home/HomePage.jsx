import React, { useEffect } from "react";
import ClockBig from "../../components/ClockBig";
import ContactMe from "../../components/ContactMe";
// import { ManageClientAndCar } from "../../components/ManageCarAndClient";

export default function HomePage({ credd }) {
    return (
        <div className="homepage ">
            <div className="min-h-[90dvh] . ">
                <ClockBig />
                {credd?.status == "noserver" && (
                    <>
                        <div className=" bg-red-200 text-red-800 border-3  border-solid font-bold border-red-800 px-6 py-2 rounded-full animate-ping-1 mx-auto w-fit">
                            garage server is not available !
                        </div>
                        <br />
                        <a
                            href="/"
                            className=" block bg-green-200 text-red-800 border-3  border-solid font-bold border-green-800 px-6 py-2 rounded-full  mx-auto w-fit"
                        >
                            click here to reload
                        </a>
                    </>
                )}
            </div>
            <ContactMe />
            {/* <ManageClientAndCar /> */}
        </div>
    );
}
