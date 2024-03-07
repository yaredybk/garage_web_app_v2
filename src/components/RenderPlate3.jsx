import React, { useContext, useEffect, useState } from "react";
import "./comp.css";
import { GlobalState } from "../context/GlobalContext";
import xaxios, { baseurl2 } from "../utils/xaxios";
import { Link, useNavigate } from "react-router-dom";
import CardPlateNo_v1 from "../layout/CardPlateNo_v1";
// import { axioslinks } from "../preset/Var";
/**
 *
 * @param {plateobj} plateobj plate plateobject containing .code .prefix .pplate
 * @returns
 */
export default function RenderPlate3({
    inspection = undefined,
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
    ...props
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
    
    const carlink = inspection ? `/nav/inspections/car/${ plateobj.idcar}` : `/nav/cars/${ plateobj.idcar}`;
    // defualt return
    return (
        <Link
        to={carlink}
            // onClick={openCar}
            className={` ${display1} p-1 bg-gray-100  bg-opacity-70   items-center  place-items-center `}
        >
            <div className="caridmodel  w-48  items-start grid leading-5   h-28    z-10 relative">
                <img
                    onError={(e) => {
                        if (e.currentTarget.src.includes("carlogos")) {
                            e.currentTarget.className = " hidden  ";
                            return;
                        }
                        e.currentTarget.className = className;
                        e.currentTarget.src = `${baseurl2}/files/image/carlogos/${plateobj?.make?.trimEnd()}-logo.png`;
                    }}
                    className="h-[120%] pt-1  w-48   absolute -z-10 object-cover  "
                    src={`${baseurl2}/files/image/cars/${plateobj.make}/${plateobj.model}.webp`}
                    alt=""
                />
                <span className=" -mx-1    bg-opacity-70      font-bold">
                    ({plateobj.idcar}) {plateobj.make} ({plateobj.model})
                </span>
                <span className="flex-1"></span>
            </div>

            <div className="flex items-strech gap-1">
                
                    <CardPlateNo_v1 plate={plateobj} />
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
        </Link>
    );
}
