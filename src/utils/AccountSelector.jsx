import { useContext, useState } from "react";
import { GlobalState } from "../context/GlobalContext";
import InputContainer from "../components/input/InputContainer";

export default function AccountSelector({
    onChange = () => null,
    accountgroupin = "",
    ...props
}) {
    const [accountgroup, setaccountgroup] = useState(accountgroupin);
    const { list_accounts } = useContext(GlobalState);
    return (
        <div className=" grid gap-1">
            <div
                className={
                    accountgroup
                        ? "account_category grid grid-cols-3 gap-2 p-1 bg-blue-200 rounded-full overflow-hidden "
                        : "account_category grid grid-cols-3 gap-2 p-1 bg-blue-200 rounded-full overflow-hidden animate-ping-1"
                }
            >
                {["internal", "agent", "employee"].map((type, ind) => (
                    <button
                        key={type}
                        onClick={() => {
                            setaccountgroup(type);
                            onChange({
                                target: { name: props.name, value: "" },
                            });
                        }}
                        type="button"
                        className={
                            accountgroup == type
                                ? "bg-blue-400 p-1 rounded-full"
                                : "bg-blue-200 p-1 rounded-full"
                        }
                    >
                        {type}
                    </button>
                ))}
            </div>
            {accountgroup && (
                // <div className="flex gap-1 items-center">
                // {/* <InputContainer title={"Select ACC"} htmlFor="idaccount"> */}
                <select
                    {...props}
                    className={props.className + "  py-2 "}
                    onChange={onChange}
                >
                    <option value={""}></option>
                    {list_accounts?.map(
                        (obj, ind) =>
                            obj?.role == accountgroup && (
                                <option key={ind} value={obj?.idaccount}>
                                    {obj?.name}
                                </option>
                            )
                    )}
                </select>
                // {/* </InputContainer> */}
                // </div>
            )}
        </div>
    );
}
