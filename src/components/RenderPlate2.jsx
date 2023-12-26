import React, { useContext, useEffect, useState } from "react";
import "./comp.css";
import { GlobalState } from "../context/GlobalContext";
import xaxios, { baseurl2 } from "../utils/xaxios";
import { useNavigate } from "react-router-dom";
// import { axioslinks } from "../preset/Var";
/**
 *
 * @param {string objcopyect} plateobj plate objcopyect containing .code .prefix .pplate
 * @returns
 */
export default function RenderPlate2({
    display1 = "grid flex-wrap",
    plateobj = null,
    jobid = null,
    carid = null,
}) {
    const navigate = useNavigate();
    const { list_region } = useContext(GlobalState);
    const [objcopy, setobjcopy] = useState(plateobj);
    useEffect(() => {
        if (carid) {
            getCarInfo(carid, null);
        } else if (jobid) {
            getCarInfo(null, jobid);
        }
    }, [carid, jobid]);
    const colorcode = [
        " max-w-fit text-red-700  border-red-700 ",
        " max-w-fit text-blue-700  border-blue-700 ",
        " max-w-fit text-green-700  border-green-700 ",
        " max-w-fit text-black  border-black ",
        " max-w-fit text-red-500  border-red-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
        " max-w-fit text-sky-500  border-sky-500 ",
    ];
    function getCarInfo(caridin, jobidin = null) {
        if (!(caridin || jobidin)) {
            return;
        }
        let str = `/api/getsingle/car?idcar=${caridin}&jobid=${jobidin}`;
        // let str = caridin
        //     ? `${axioslinks.devDbLink}/find/CAR/id/${caridin} `
        //     : `${axioslinks.devDbLink}/find/CAR/jobid/${jobidin}`;
        xaxios
            .GetData(str)
            .then((data) => {
                if (data.length === 1) {
                    setobjcopy({
                        ...data[0],
                    });
                } else {
                    setobjcopy(null);
                }
            })
            .catch((err) => {
                console.warn(err);
                setobjcopy(null);
            });
    }
    function noplate() {
        return (
            <div
                className={
                    " flex border font-bold text-red-600 border-red-600   p-2 rounded-md"
                }
            >
                <div className="grid place-items-center w-7 h-8 leading-7 rounded-full border-2 border-inherit ">
                    NO PLATE
                </div>
            </div>
        );
    }
    function regionRender(a) {
        return (
            <div
                className={
                    objcopy?.region == 12
                        ? "flex px-1 bg-yellow-400 flex-col text-sm leading-4  break-all w-min font-bold"
                        : "  flex px-1 flex-col text-sm leading-4  break-all w-min font-bold"
                }
            >
                {list_region[objcopy?.region - 1][a]}
            </div>
        );
    }
    function openCar() {
        if (objcopy.idcar)
            navigate(`/nav/car/${objcopy.idcar}`, { replace: true });
    }
    // defualt return
    return objcopy ? (
        <div
            onClick={openCar}
            className={` ${display1} items-center place-items-center p-1  `}
        >
            <span className="caridmodel flex flex-col leading-5 items-center bg-gray-200 h-24 overflow-hidden  text-lg z-10 relative">
                <img
                    className="h-[120%]   absolute -z-10 object-cover  "
                    src={`${baseurl2}/files/image/cars/${objcopy.make}/${objcopy.model}.webp`}
                    alt=""
                />
                <span className=" bg-white bg-opacity-70 w-full">
                    <b>
                        ({objcopy.idcar}) {objcopy.make} ({objcopy.model})
                    </b>
                </span>
                <span className="flex-1"></span>
            </span>
            <div
                className={
                    colorcode[objcopy?.code - 1]
                        ? `${
                              colorcode[objcopy?.code - 1]
                          }    border-2  border-solid max-md:text-xs  rounded-md`
                        : `  text-black  border-2 border-solid  border-black  rounded-md`
                }
            >
                <div className=" bg-white plate_number flex items-center pl-1 border-inherit  gap-1 rounded-md">
                    <div
                        className={
                            objcopy?.region > 11
                                ? "relative flex items-center justify-center   h-4 w-4 rounded-full font-bold  text-3xl"
                                : "relative flex items-center justify-center   h-4 w-4  border-2 border-solid border-inherit  rounded-full font-bold  text-xl"
                        }
                    >
                        {objcopy.code}
                    </div>
                    {regionRender("am")}
                    <div className="bg-gray-500 w-2 h-2"></div>
                    <div className=" uppercase text-center text-3xl   leading-5  tracking-wider">
                        {objcopy?.plate}
                    </div>
                    {regionRender("en")}
                </div>
            </div>
        </div>
    ) : (
        noplate()
    );
}
