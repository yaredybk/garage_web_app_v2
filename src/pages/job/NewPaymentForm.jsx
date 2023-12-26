const tojobCategory_FunctionConstructor = {
    // ////////////////////////////////////////////////
    other: {
        category: "other",
        reason: "tojob",
        method: "tojob",
        balanceOperation: -1,
        inactiveOperation: 1,
        account: null,
        idaccount: 0,
        amount: "",
    },
};
import { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import FoldedSection from "../../components/FoldedSection";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import GlobalContext, { GlobalState } from "../../context/GlobalContext";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import xaxios from "../../utils/xaxios";
import { LoadingState } from "../../context/LoadingContext";
import {
    extractBalanceSubnetByIdaccount,
    shareBalanceToAccounts,
} from "./jonFunctions";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";

export default function NewPaymentForm({
    transactions = [],
    totalunpaid = 0,
    id,
    refetchData2 = null,
    setpopwindow = () => null,
}) {
    const { list1, refetchData } = useEffectStateArrayData(
        "/api/getlist/jobtransaction/" + id + "?fromjob=true"
    );
    const { list_accounts } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [accountgroup, setaccountgroup] = useState(null);
    const [sharingOrder, setSharingOrder] = useState({
        order: undefined,
        accounts: undefined,
    });
    const [fromJobSharedAccounts, setFromJobSharedAccounts] = useState([]);
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: null,
        amount: totalunpaid,
        reason: "fromjob",
        method: "",
        description: transactions[0] && transactions[0].description,
        category: "hidden",
        idjob: id,
        percent: 100,
        amountshared: 0,
        amountgarage: "",
        amountorigin: totalunpaid,
        enablesharing: true,
    });
    let sampleData = [
        "idaccount",
        "amount",
        "reason",
        "method",
        "description",
        "category",
        "idjob",
    ];
    useEffect(() => {
        if (list1) manageSharing(totalunpaid);
    }, [list1]);

    function manageSharing(amountin, keyToBefirst = null) {
        let accounts = sharingOrder.accounts
            ? sharingOrder.accounts
            : extractBalanceSubnetByIdaccount(list1);
        let newshareorder = shareBalanceToAccounts(
            accounts,
            amountin,
            keyToBefirst
        );
        setSharingOrder({ ...newshareorder });
    }
    return (
        <BasicForm
            title={newTransactionData.category}
            formClass=" grid gap-2 "
            key={newTransactionData.category}
            onSubmit={sendTransactionData}
        >
            <InputContainer title="Net amount" htmlFor="amount">
                <input
                    required={newTransactionData?.category != "note"}
                    type="number"
                    autoComplete="off"
                    // autoFocus
                    name="amount"
                    id="amount"
                    value={newTransactionData.amount}
                    onChange={(e) => {
                        manageSharing(e.target.value);
                        sendToPercentCalculator(e);
                    }}
                />
            </InputContainer>
            <table>
                <tbody>
                    {sharingOrder.accounts &&
                        Object.keys(sharingOrder.accounts).map((key, ind) => (
                            <tr
                                key={key}
                                onClick={() => {
                                    manageSharing(
                                        newTransactionData.amount,
                                        key
                                    );
                                }}
                                className=" bg-red-100 "
                            >
                                <td>{key} </td>
                                <td className=" bg-blue-100 text-right px-1">
                                    {sharingOrder.accounts[key]?.name}
                                </td>
                                <td className=" bg-red-100">
                                    {sharingOrder.accounts[key]?.subtotal}
                                </td>
                                <td className=" bg-blue-100">
                                    {sharingOrder.accounts[key]?.shared}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div
                className={
                    accountgroup
                        ? "account_category grid grid-cols-4 gap-2 p-1 "
                        : "account_category grid grid-cols-4 gap-2 p-1 animate-ping-1"
                }
            >
                {["internal", "agent", "employee"].map((type, ind) => (
                    <button
                        key={type}
                        onClick={() => {
                            setaccountgroup(type);
                            if (type == "client") {
                                let cll = list_accounts.find(
                                    (obj) => obj.role == "client"
                                );
                                setNewTransactionData({
                                    ...newTransactionData,
                                    idaccount: cll?.idaccount,
                                    amount: 0,
                                });
                                document.getElementById("description").focus();
                            } else {
                                if (newTransactionData.reason != "fromjob")
                                    setNewTransactionData({
                                        ...newTransactionData,
                                        idaccount: "",
                                        amount: "",
                                    });
                                else
                                    setNewTransactionData({
                                        ...newTransactionData,
                                        idaccount: "",
                                    });
                                document.getElementById("description").focus();
                            }
                        }}
                        type="button"
                        className={
                            accountgroup == type
                                ? "bg-green-300 p-1"
                                : "bg-gray-300 p-1"
                        }
                    >
                        {type}
                    </button>
                ))}
            </div>
            {accountgroup && (
                <div className="flex gap-1 items-center">
                    <InputContainer title={"Select ACC"} htmlFor="idaccount">
                        <select
                            name="idaccount"
                            required
                            id="idaccount"
                            value={
                                newTransactionData.idaccount
                                    ? newTransactionData.idaccount
                                    : 0
                            }
                            onChange={(e) => {
                                newTransactionData?.reason == "fromjob" &&
                                    manageSharing(newTransactionData.amount);
                                setNewTransactionData({
                                    ...newTransactionData,
                                    idaccount: e.target.value,
                                });
                            }}
                        >
                            <option value={""}>- - -</option>
                            {list_accounts?.map(
                                (obj, ind) =>
                                    obj?.role == accountgroup && (
                                        <option
                                            key={ind}
                                            value={obj?.idaccount}
                                        >
                                            {obj?.name}
                                        </option>
                                    )
                            )}
                        </select>
                    </InputContainer>
                    <InputContainer htmlFor="method">
                        <select
                            required
                            type="number"
                            name="method"
                            id="method"
                            value={newTransactionData.method}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    method: e.target.value,
                                });
                            }}
                        >
                            {["", "cash", "transfer", "check"].map(
                                (val, ind) => (
                                    <option value={val} key={val + ind}>
                                        {val}
                                    </option>
                                )
                            )}
                        </select>
                    </InputContainer>
                    <InputContainer htmlFor="amountorigin">
                        <input
                            required
                            autoComplete="off"
                            value={newTransactionData?.amountorigin}
                            className=" w-20"
                            type="number"
                            name="amountorigin"
                            id="amountorigin"
                            // readOnly
                            min={1}
                            onChange={() => null}
                        />
                    </InputContainer>

                    <button
                        type="button"
                        className="p-1"
                        onClick={addSharedAccount}
                    >
                        <img
                            src="/public/images/add.svg"
                            alt="+"
                            className=" w-8"
                        />
                    </button>
                </div>
            )}
            {fromJobSharedAccounts.map((obj, ind) => (
                <FromJobSharedAccountMember
                    list_accounts={list_accounts}
                    key={ind}
                    index={ind}
                    datain={obj}
                    onChange={manageSharingChangeFromJob}
                />
            ))}
            {newTransactionData.idaccount && (
                <>
                    <InputContainer htmlFor="description_payment">
                        <input
                            required
                            defaultValue={newTransactionData.description}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    description: e.target.value,
                                });
                            }}
                            name="description_payment"
                            id="description_payment"
                        ></input>
                    </InputContainer>
                    <span
                        className={
                            newTransactionData.completejob
                                ? " mx-auto  px-2  outline outline-1 outline-blue-800 rounded-sm"
                                : " mx-auto bg-blue-300 px-2 animate-ping-1 outline outline-1 outline-blue-800 rounded-sm"
                        }
                    >
                        <input
                            type="checkbox"
                            name="endjob"
                            id="endjob"
                            value={newTransactionData?.completejob}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    completejob: e.target.checked,
                                });
                            }}
                        />
                        <label htmlFor="endjob">Complete job</label>
                    </span>
                    <FoldedSection className="grid gap-2 p-2">
                        {sampleData.map(
                            (nam) =>
                                nam != "idaccount" &&
                                nam != "amount" &&
                                nam != "description" &&
                                !(
                                    newTransactionData?.reason == "fromjob" &&
                                    nam == "method"
                                ) && (
                                    <div
                                        key={nam + " additional"}
                                        className="grid grid-cols-2 border-b-2 border-0 p-1 border-solid"
                                    >
                                        <label htmlFor={nam}>{nam}</label>
                                        <input
                                            readOnly={
                                                newTransactionData[nam] &&
                                                nam === "idjob"
                                            }
                                            onChange={(e) => {
                                                setNewTransactionData({
                                                    ...newTransactionData,
                                                    [nam]: e.target.value,
                                                });
                                            }}
                                            value={
                                                newTransactionData[nam]
                                                    ? newTransactionData[nam]
                                                    : ""
                                            }
                                            name={nam}
                                            id={nam}
                                        ></input>
                                    </div>
                                )
                        )}
                    </FoldedSection>

                    <ButtonSubmit disableOnClick={true}>upload</ButtonSubmit>
                </>
            )}
        </BasicForm>
    );
    function manageSharingChangeFromJob(datain) {
        if (!datain) {
            percentCalculator("fromjobshared", 0);
            return setFromJobSharedAccounts([]);
        }
        let newdata = fromJobSharedAccounts;
        newdata[datain.index] = datain.newData;
        let net = calculateFromJobSharedAccountsNet(newdata);
        percentCalculator("fromjobshared", net);
        setFromJobSharedAccounts(newdata);
    }
    function calculateFromJobSharedAccountsNet(datain) {
        const data = datain ? datain : fromJobSharedAccounts;
        let net = 0;
        data?.forEach((obj) => {
            net += Number(obj.amount);
        });
        return net;
    }
    function addSharedAccount() {
        setFromJobSharedAccounts([
            ...fromJobSharedAccounts,
            {
                accountgroup: undefined,
                idaccount: undefined,
                method: "",
                amount: "",
            },
        ]);
    }
    function sendToPercentCalculator(e) {
        percentCalculator(e.target.name, e.target.value);
    }
    function percentCalculator(valuetype, value = 0, nostatechange = null) {
        let amount = Number(newTransactionData?.amount);
        let amountorigin = Number(newTransactionData?.amountorigin);
        let amountshared = Number(newTransactionData?.amountshared);
        value = Number(value);
        if (value == "") {
            switch (valuetype) {
                case "amount":
                    amount = "";
                    amountorigin = "";
                    setFromJobSharedAccounts([]);
                    break;
                case "amountorigin":
                    amountorigin = "";
                    setFromJobSharedAccounts([]);
                    break;
                case "fromjobshared":
                    amountshared = 0;
                    amountorigin = amount;
                    break;

                default:
                    break;
            }
        } else {
            switch (valuetype) {
                case "amount":
                    amount = value;
                    amountorigin = amount - amountshared;
                    break;
                case "amountorigin":
                    amountorigin = value;
                    amount = amountorigin + amountshared;
                    break;
                case "fromjobshared":
                    amountshared = value;
                    amountorigin = amount - amountshared;
                    break;
                default:
                    break;
            }
        }

        let obj = {
            ...newTransactionData,
            amount,
            amountorigin,
            amountshared,
        };
        if (nostatechange) {
            return obj;
        }
        setNewTransactionData(obj);
        return 0;
    }
    function sendTransactionData(datain) {
        setLoad(true);

        let url1 = "/api/transaction/getfromjob";
        xaxios
            .post(url1, {
                ...newTransactionData,
                sharingOrder,
                fromJobSharedAccounts,
            })
            .then((res) => {
                refetchData2();
                openCloseModal("all", "close");
                setpopwindow(null);
            })
            .finally(() => {
                setLoad(false);
            });
    }
}
function FromJobSharedAccountMember({
    datain,
    onChange,
    amountin,
    index,
    list_accounts,
}) {
    const [accountgroup, setaccountgroup] = useState(undefined);
    const [myData, setMyData] = useState(datain);
    function manageChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        const newData = { ...myData, [name]: value };
        setMyData(newData);
        onChange({ newData, index });
    }
    return (
        <div className="flex gap-1 items-center">
            {!accountgroup ? (
                <div className="account_category grid grid-cols-4 gap-2 p-1">
                    {["internal", "agent", "employee"].map((type, ind) => (
                        <button
                            key={type}
                            onClick={() => {
                                setaccountgroup(type);
                            }}
                            type="button"
                            className={
                                accountgroup == type
                                    ? "bg-green-300 p-1"
                                    : "bg-gray-300 p-1"
                            }
                        >
                            {type}
                        </button>
                    ))}
                </div>
            ) : (
                <>
                    <InputContainer title={"Select ACC"} htmlFor="idaccount">
                        <select
                            name="idaccount"
                            required
                            id="idaccount"
                            value={myData.idaccount}
                            onChange={manageChange}
                        >
                            <option value={""}>- - -</option>
                            {list_accounts?.map(
                                (obj, ind) =>
                                    obj?.role == accountgroup && (
                                        <option
                                            key={ind}
                                            value={obj?.idaccount}
                                        >
                                            {obj?.name}
                                        </option>
                                    )
                            )}
                        </select>
                    </InputContainer>
                    <InputContainer htmlFor="method">
                        <select
                            required
                            type="number"
                            name="method"
                            id="method"
                            value={myData.method}
                            onChange={manageChange}
                        >
                            {["", "cash", "transfer", "check"].map(
                                (val, ind) => (
                                    <option value={val} key={val + ind}>
                                        {val}
                                    </option>
                                )
                            )}
                        </select>
                    </InputContainer>
                    <InputContainer htmlFor="amount">
                        <input
                            required
                            autoComplete="off"
                            value={myData.amount}
                            className=" w-20"
                            type="number"
                            name="amount"
                            id="amount"
                            onChange={manageChange}
                        />
                    </InputContainer>
                </>
            )}

            <button
                type="button"
                onClick={() => onChange(undefined)}
                className="p-1"
            >
                <img src="/public/images/close.svg" alt="x" className=" w-8" />
            </button>
        </div>
    );
}
