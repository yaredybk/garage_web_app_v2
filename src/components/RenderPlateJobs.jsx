import React, { useContext, useEffect, useState } from "react";
import "./comp.css";
import { GlobalState } from "../context/GlobalContext";
import xaxios, { baseurl2 } from "../utils/xaxios";
import { useNavigate } from "react-router-dom";
// import { axioslinks } from "../preset/Var";
/**
 *
 * @param {plateobj} plateobj plate plateobject containing .code .prefix .pplate
 * @returns
 */
export default function RenderPlateJobs({
    display1 = "grid flex-wrap",
    plateobj = {
        idcar: 0,
        idclient: 0,
        code: "-",
        region: 2,
        plate: "-----",
        make: "-",
        model: "-",
        class: null,
        color: null,
        name: "unknown",
        gender: "",
        phoneno: "+251-",
    },
    datein="2"
}) {
    const className = "pt-1   max-h-[80%] max-w-[90%]    object-contain absolute-center mt-2";
    plateobj = plateobj || {
        idcar: 0,
        idclient: 0,
        code: "-",
        region: 2,
        plate: "-----",
        make: "-",
        model: "-",
        class: null,
        color: null,
        name: "unknown",
        gender: "",
        phoneno: "+251-",
    };
    const navigate = useNavigate();
    const { list_region } = useContext(GlobalState);
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
    function regionRender(a) {
        return (
            plateobj.region && (
                <div
                    className={
                        plateobj.region == 12
                            ? " flex px-1 bg-yellow-400 flex-col text-sm leading-4  break-all w-min font-bold"
                            : " flex px-1 flex-col text-sm leading-4  break-all w-min font-bold"
                    }
                >
                    {list_region[plateobj.region - 1][a]}
                </div>
            )
        );
    }
    function openCar() {
        if (plateobj.idjob) navigate(`/nav/jobs/edit/${plateobj.idjob}`);
    }
    // defualt return
    return (
        <div
            onClick={openCar}
            className={` ${display1}  cursor-pointer  hover:bg-orange-200   items-center  place-items-center `}
        >
            <div className=" relative  bg-opacity-70 bg-blue-800 text-white w-full      font-bold">
                <span className=" relative p-[1px] float-right bg-black text-white   bg-opacity-70 mb-auto      font-bold">
                    J{plateobj.idjob}
                </span>
                <span className="px-1">{plateobj.name}</span>
            </div>
            <div className="caridmodel  w-48   leading-5 pl-1 pb-1    h-28 overflow-hidden    relative">
                <img
                    onError={(e)=>{
                        if(e.currentTarget.src.includes("carlogos")){
                        e.currentTarget.className=" hidden  ";
                        return;}
                        e.currentTarget.className=className;
                        e.currentTarget.src = `${baseurl2}/files/image/carlogos/${plateobj?.make?.trimEnd()}-logo.png`;
                        
                    }}
                    className="h-[120%] pt-1  w-48   absolute  object-contain  "
                    src={`${baseurl2}/files/image/cars/${plateobj.make}/${plateobj.model}.webp`}
                    alt=""
                />
                <span className=" relative p-[1px] float-right text-red-600   bg-opacity-70 mb-auto      font-bold">
                    {datein}
                </span>
                <span className=" relative  bg-opacity-70      font-bold">
                    {plateobj.make} {plateobj.model}
                </span>
                <span className="flex-1"></span>
            </div>

            <div className="flex items-strech gap-1">
                <div
                    className={
                        colorcode[plateobj?.code - 1]
                            ? `${
                                  colorcode[plateobj?.code - 1]
                              }    border-2  border-solid max-md:text-xs  rounded-md`
                            : `  text-black  border-2 border-solid  border-black  rounded-md`
                    }
                >
                    <div className=" bg-white plate_number flex items-center pl-1 border-inherit  gap-1 rounded-md">
                        <div
                            className={
                                plateobj?.region > 11
                                    ? "relative flex items-center justify-center   h-4 w-4 rounded-full font-bold  text-3xl"
                                    : "relative flex items-center justify-center   h-4 w-4  border-2 border-solid border-inherit  rounded-full font-bold  text-xl"
                            }
                        >
                            {plateobj.code}
                        </div>
                        {regionRender("am")}
                        <div className="bg-gray-500 w-2 h-2"></div>
                        <div className=" uppercase text-center text-4xl   leading-7  tracking-wider">
                            {plateobj?.plate}
                        </div>
                        {regionRender("en")}
                    </div>
                </div>
                {plateobj.color && (
                    <div className="relative  grid   ">
                        <span className=" float-right px-1 z-10 right-0 bottom-full bg-gray-500 rounded-sm text-white absolute">
                            {plateobj.color}
                        </span>
                        <div
                            className={` z-40 relative w-8  rounded-md border-solid border-2  bg-${plateobj.color}-600`}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
