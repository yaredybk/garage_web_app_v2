import { LoadingBar } from "../../App";
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
    withcalc,
    containerClass = "",
    donotnavigateback = undefined,
    ...props
}) {
    function closeModal() {
        if (donotnavigateback) return;
        openCloseModal(id, "close");
        onClose();
    }
    function closeModal2(e) {
        if (donotnavigateback) return;
        if (e.target.id == id) {
            openCloseModal(id, "close");
            onClose();
        }
    }
    return (
        <dialog
            onClick={(e) => {
                closeModal2(e);
            }}
            className={
                className +
                " basicmodal1 shadow-black shadow-xl  rounded-tl-6  max-w-[95vw] basicdialog min-w-[5rem] p-0 min-h-[3rem]  "
            }
            id={id}
            {...props}
        >
            <MiniPopup />
            <div className=" pt-1  ">
                <div className="mb-1  titlebar grid grid-cols-[min-content,10fr,min-content] items-center   sticky top-0  bg-[var(--accent-color1)] ">
                    {withcalc && id != "calculator" ? (
                        <img
                            onClick={() => {
                                openCloseModal("calculator", "open");
                                document
                                    .getElementById("result-panel")
                                    ?.focus();
                            }}
                            role="button"
                            className=" sticky left-0 p-1 shadow-none rounded-none  h-6   cursor-pointer float-left  bg-orange-500"
                            src="/public/images/calculate.svg"
                            alt="c"
                        />
                    ) : (
                        <span></span>
                    )}
                    <span className="  text-center p-1 font-bold  text-white ">
                        {title || id}
                    </span>
                    <button
                        title="close"
                        onClick={closeModal}
                        className=" sticky float-right shadow-none   flex items-center justify-center left-full  top-0  p-1 px-4 rounded-none border-none  bg-red-400 hover:bg-red-500"
                    >
                        <IconSmall src="/public/images/close.svg" alt="X" />
                    </button>
                </div>
                <div
                    className={`pt-0 p-2 max-sm:p-1 overflow-auto ${containerClass}`}
                >
                    <LoadingBar />
                    {children}
                </div>
            </div>
        </dialog>
    );
}
