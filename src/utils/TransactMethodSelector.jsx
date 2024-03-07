import { useContext, useState } from "react";
import { GlobalState } from "../context/GlobalContext";
import InputContainer from "../components/input/InputContainer";
import IconSmall from "../components/IconSmall";

export default function TransactMethodSelector({
    onChange = () => null,
    methodin = "",
    allowedMethods = ["", "cash", "transfer", "check"],
    ...props
}) {
    const [method, setmethod] = useState(methodin);
    return (
        <div className=" grid flex-grow ">
            <span className={method ? "flex gap-1" : "h-0 overflow-hidden"}>
                <select
                    className={props.className + " flex-grow p-1  py-2 "}
                    onChange={onChange}
                    id="transactmethod"
                    {...props}
                >
                    {allowedMethods?.map((vall, ind) => (
                        <option key={vall} value={vall}>
                            {vall}
                        </option>
                    ))}
                </select>
                <button
                    title="clear"
                    onClick={() => {
                        document.getElementById("transactmethod").value = "";
                        setmethod(null);
                        onChange({
                            target: { name: props.name, value: "" },
                        });
                    }}
                    type="button"
                    className=" sticky float-right shadow-none   flex items-center justify-center left-full  top-0  p-1 px-2 rounded-none border-none  bg-red-400 hover:bg-red-500"
                >
                    <IconSmall src="/public/images/close.svg" alt="X" />
                </button>
            </span>
            <div
                className={
                    method
                        ? " h-0  flex gap-1 px-1 py-0 bg-blue-200 rounded-full overflow-hidden "
                        : " flex gap-1 py-1 px-1 bg-blue-200 rounded-full overflow-hidden animate-ping-1"
                }
            >
                {allowedMethods.map((method, ind) => (
                    <button
                        key={method}
                        onClick={() => {
                        document.getElementById("transactmethod").value = method;
                            setmethod(method);
                            onChange({
                                target: { name: props.name, value: method },
                            });
                        }}
                        type="button"
                        className="bg-blue-200 p-1 basis-5 flex-1  rounded-full"
                    >
                        {method}
                    </button>
                ))}
            </div>
        </div>
    );
}
