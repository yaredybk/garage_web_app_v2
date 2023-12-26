import React, { useEffect, useState } from "react";
export default function ClockBig() {
    const [clock, setClock] = useState({ full: "", date: "" });
    useEffect(() => {
        let dd = new Date();
        setClock({
            full: dd.toLocaleTimeString(["fr-FR"], {
                hour: "2-digit",
                minute: "2-digit",
                second:"2-digit",
                // hour12: true,
                hourCycle: "h12",
            }),
            date:
                    dd.toLocaleDateString([], {weekday:"short",month:"short",day:"2-digit",year:"numeric"}) 
            });
        const timeInterval1 = setInterval(() => {
            let dd = new Date();
            setClock({
                full: dd.toLocaleTimeString(["fr-FR"], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second:"2-digit",
                    // hour12: true,
                    hourCycle: "h12",
                }),
                date:
                    dd.toLocaleDateString([], {weekday:"short",month:"short",day:"2-digit",year:"numeric"}) 
            });
        }, 500);
        return () => {
            clearInterval(timeInterval1);
        };
    }, []);

    return (
        <div className=" grid justify-center p-2  ">
            <div className="clock-box flex px-2 bg-emerald-200 border-0 border-b-0 border-solid border-emerald-900 rounded-t-lg font-bold justify-center text-3xl uppercase font-sans ">
                {clock.full}
            </div>
            <div className="flex justify-center px-2 bg-lime-900 border-0 items-center border-t-0 border-solid border-lime-400 rounded-b-lg text-green-200 font-bold">
                {clock.date}
            </div>
        </div>
    );
}
