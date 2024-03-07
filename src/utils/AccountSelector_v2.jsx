import { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalContext";
import InputContainer from "../components/input/InputContainer";
import IconSmall from "../components/IconSmall";

export default function AccountSelector_v2({
    onChange = () => null,
    idaccountin = undefined,
    accountgroupin = "",
    allowedGroups = ["internal", "employee", "agent", "company"],
    id=undefined,
    ...props
}) {
    const tmpid = `accountselector-${id||Date.now()}`;
    const [accountgroup, setaccountgroup] = useState(accountgroupin);
    const { list_accounts } = useContext(GlobalState);
    useEffect(() => {
        if (idaccountin) {
            setaccountgroup(
                list_accounts.find((obj) => obj.idaccount == idaccountin).role
            );
            document.getElementById(tmpid).value = Number(idaccountin);
        } else if (idaccountin === undefined) {
            setaccountgroup(null);
            document.getElementById(tmpid).value = "";
        }
    }, [idaccountin]);

    return (
        <div className=" grid flex-grow ">
            <span
                className={accountgroup ? "flex gap-1" : "h-0 overflow-hidden"}
            >
                <select
                    className={props.className + " flex-grow p-1  py-2 "}
                    onChange={onChange}
                    id={tmpid}
                    {...props}
                >
                    <option value={""}></option>
                    {list_accounts
                        ?.filter((ele) => ele?.role == accountgroup)
                        ?.map((obj, ind) => (
                            <option key={ind} value={obj?.idaccount}>
                                {obj?.name}
                            </option>
                        ))}
                </select>
                <button
                    title="clear"
                    onClick={() => {
                        if (!onChange)
                            document.getElementById(tmpid).value = "";
                        setaccountgroup(null);
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
                    accountgroup
                        ? " h-0  flex gap-1 px-1 py-0 bg-blue-200 rounded-full overflow-hidden "
                        : " flex gap-1 py-1 px-1 bg-blue-200 rounded-full overflow-hidden "
                }
            >
                {allowedGroups.map((type, ind) => (
                    <button
                        key={type}
                        onClick={() => {
                            if (!onChange)
                                document.getElementById(tmpid).value = "";
                            setaccountgroup(type);
                            onChange({
                                target: { name: props.name, value: "" },
                            });
                        }}
                        type="button"
                        className="bg-blue-200 p-1 basis-20 flex-1 rounded-full"
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
}
