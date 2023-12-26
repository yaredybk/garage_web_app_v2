import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import IconSmall from "../IconSmall";
import ButtonExit from "../button/ButtonExit";
import MiniPopup from "../popup/MiniPopup";
import "./dialog.css";
export default function BasicDialog({
    children,
    id = "basicmodal",
    title,
    onClose = () => null,
    className = "",
    ...props
}) {
    function closeModal() {
        openCloseModal(id, "close");
        onClose();
    }
    function closeModal2(e) {
        if (e.target.id == id) openCloseModal(id, "close");
    }
    return (
        <dialog
            onClick={(e) => {
                closeModal2(e);
            }}
            className={
                className +
                " basicmodal1  rounded-tl-[2rem]  max-w-[95vw] basicdialog min-w-[5rem] p-0 min-h-[3rem]  "
            }
            id={id}
            {...props}
        >
            {id != "calculator" && (
                <img
                    onClick={() => {
                        openCloseModal("calculator", "open");
                        document.getElementById("result-panel")?.focus();
                    }}
                    role="button"
                    className="h-6 ml-8  cursor-pointer absolute z-50 translate-x-1/2  bg-orange-500"
                    src="/public/images/calculate.svg"
                    alt="c"
                />
            )}
            <MiniPopup />
            <div className="  ">
                <div className="titlebar sticky top-0 mb-1 bg-indigo-800 ">
                    <span className=" float-right mr-16  text-white ">
                        {title||id}
                    </span>
                    <button
                        onClick={closeModal}
                        className=" sticky ml-auto flex items-center justify-center left-full  top-0 bg-opacity-60 p-1 px-4 rounded-sm border-none  bg-red-400 hover:bg-red-500"
                    >
                        <IconSmall src="/public/images/close.svg" alt="X" />
                    </button>
                </div>
                <div className="pt-0 p-2 max-sm:p-1 overflow-auto">
                    {children}
                </div>
            </div>
        </dialog>
    );
}
