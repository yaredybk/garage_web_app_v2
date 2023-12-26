import IconSmall from "../IconSmall";
import "./button.css";
export default function ButtonExit({ onClick = () => null }) {
    return (
        <button
            onClick={onClick}
            className=" sticky ml-auto flex items-center justify-center gap-2  left-full  top-0
             bg-opacity-70 p-1
             px-4 rounded-sm border-none font-bold bg-red-400 hover:bg-red-500"
        >
            <IconSmall src="/public/images/close.svg" />
            {/* EXIT */}
        </button>
    );
}
