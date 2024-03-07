// import React from "react";
import "./minipop.css";
import { openCloseMiniPop } from "../../utils/userInterface";
import IconSmall from "../IconSmall";

export default function MiniPopup() {
    return (
        <div className="mini_pop_window">
            <div
                onClick={() => {
                    openCloseMiniPop(null, "open", null, 60000);
                }}
                className="absolute inset-0  bg-transparent -z-10"
            ></div>
            <em className="w-7 h-4 float-right bg-transparent "></em>
            <span
                onClick={() => {
                    openCloseMiniPop(null, "open", null, 60000);
                }}
                id="mini_pop_window_text"
                className="mini_pop_window_text"
            ></span>
            <button
                onClick={() => openCloseMiniPop("", "close")}
                className="  absolute right-0  items-center top-0  p-1 border-none 
                font-bold bg-red-200 bg-opacity-60 hover:bg-red-500"
            >
                <IconSmall src="/public/images/close.svg" />
            </button>
        </div>
    );
}
