const tojobCategory_FunctionConstructor = {
    // ////////////////////////////////////////////////
    hidden: {
        category: "hidden",
        reason: "tojob",
        method: "tojob",
        balanceOperation: -1,
        inactiveOperation: 1,
        account: null,
        idaccount: 0,
        amount: "",
    },
};
import { useContext, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import FoldedSection from "../../components/FoldedSection";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { GlobalState } from "../../context/GlobalContext";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import xaxios from "../../utils/xaxios";
import { LoadingState } from "../../context/LoadingContext";

export default function NewHiddenForm({
    id,
    refetchData = null,
    setpopwindow = () => null,
}) {
    const { list_accounts } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [accountgroup, setaccountgroup] = useState(null);
    const [sharingOrder, setSharingOrder] = useState({
        order: null,
        accounts: null,
    });
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: null,
        amount: "",
        amountshared: "",
        amountgarage: "",
        amountorigin: "",
        reason: "tojob",
        method: null,
        description: null,
        category: "hidden",
        idjob: id,
        percent: 0,
        enablesharing: true,
        items: 1,
        unitprice: "",
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
    return (
        <BasicForm
            title={newTransactionData.category}
            formClass=" grid gap-2 "
            key={newTransactionData.category}
            removeEmpty={false}
            onSubmit={sendTransactionData}
        >
            <SelectAccountCategory />
            {accountgroup && (
                <InputContainer htmlFor="idaccount">
                    <div className="flex gap-4 mx-auto">
                        <select
                            name="idaccount"
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
                            <option value={0}>select account</option>
                            {list_accounts?.map(
                                (obj, ind) =>
                                    obj?.role == accountgroup && (
                                        <option
                                            key={ind}
                                            value={obj?.idaccount}
                                        >
                                            -{obj?.role}- {obj?.name}
                                        </option>
                                    )
                            )}
                        </select>
                        <input
                            required
                            autoComplete="off"
                            value={newTransactionData?.amountorigin}
                            className=" w-20"
                            type="number"
                            name="amountorigin"
                            id="amountorigin"
                            onChange={sendToPercentCalculator}
                        />
                    </div>
                </InputContainer>
            )}
            {newTransactionData.idaccount && (
                <>
                    <InputContainer htmlFor="amount">
                        <input
                            autoComplete="off"
                            required
                            type="number"
                            name="amount"
                            id="amount"
                            value={newTransactionData.amount}
                            onChange={sendToPercentCalculator}
                        />
                    </InputContainer>
                    {newTransactionData?.reason == "fromjob" && (
                        <>
                            <div className="grid gap-1">
                                {sharingOrder.accounts &&
                                    Object.keys(sharingOrder.accounts).map(
                                        (key, ind) => (
                                            <div
                                                key={key}
                                                onClick={() => {
                                                    manageSharing(
                                                        newTransactionData.amount,
                                                        key
                                                    );
                                                }}
                                                className=" flex gap-1 bg-blue-100 "
                                            >
                                                <span>{key} </span>
                                                <span className="flex-grow basis-20 bg-blue-300">
                                                    {
                                                        sharingOrder.accounts[
                                                            key
                                                        ]?.name
                                                    }
                                                </span>
                                                <span className="flex-grow basis-20 bg-red-100">
                                                    {
                                                        sharingOrder.accounts[
                                                            key
                                                        ]?.subtotal
                                                    }
                                                </span>
                                                <span className="flex-grow basis-20 bg-red-300">
                                                    {
                                                        sharingOrder.accounts[
                                                            key
                                                        ]?.shared
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )}
                            </div>
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
                                    {["cash", "transfer", "check"].map(
                                        (val, ind) => (
                                            <option value={val} key={val + ind}>
                                                {val}
                                            </option>
                                        )
                                    )}
                                </select>
                            </InputContainer>
                        </>
                    )}
                    <InputContainer htmlFor="description">
                        <input
                            required
                            defaultValue={newTransactionData.description}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    description: e.target.value,
                                });
                            }}
                            autoComplete="on"
                            autoCorrect="on"
                            spellCheck
                            name="hidden description"
                            id="hidden description"
                        ></input>
                    </InputContainer>
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
    function SelectAccountCategory() {
        return (
            <div className="account_category grid grid-cols-4 gap-2 p-1">
                {["internal", "client", "agent", "employee"].map(
                    (type, ind) => (
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
                                        enablesharing: false,
                                    });
                                    document
                                        .getElementById("description")
                                        .focus();
                                } else if (type == "internal") {
                                    setNewTransactionData({
                                        ...newTransactionData,
                                        idaccount: "",
                                        enablesharing: false,
                                    });
                                } else {
                                    setNewTransactionData({
                                        ...newTransactionData,
                                        idaccount: "",
                                    });
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
                    )
                )}
            </div>
        );
    }
    function percentCalculator(valuetype, value = 0, nostatechange = null) {
        value = Number(value);
        let amount = Number(newTransactionData?.amount);
        let amountgarage = Number(newTransactionData?.amountgarage);
        let amountorigin = Number(newTransactionData?.amountorigin);
        let percent = Number(newTransactionData?.percent);
        switch (valuetype) {
            case "amount":
                amount = value;
                amountorigin = Math.round((amount * 100) / (percent + 100));
                amountgarage = Math.round((amount * percent) / (percent + 100));
                break;
            case "amountorigin":
                amountorigin = value;
                amount = Math.round((amountorigin * (percent + 100)) / 100);
                amountgarage = Math.round((amount * percent) / (percent + 100));
                // amountorigin =Math.round( amount *( percent/100));
                break;
            case "amountgarage":
                amountgarage = value;
                amount = Math.round((amountgarage * (percent + 100)) / percent);
                // amountgarage =Math.round( amount *(1- percent/100));
                amountorigin = Math.round((amount * 100) / (percent + 100));
                break;
            case "percent":
                percent = value;
                amount = Math.round((amountorigin * (percent + 100)) / 100);
                // amountorigin = Math.round((amount * 100) / (percent + 100));
                amountgarage = Math.round((amount * percent) / (percent + 100));
                break;

            default:
                break;
        }
        let obj = {
            ...newTransactionData,
            amount,
            amountgarage,
            amountorigin,
            percent,
        };
        if (nostatechange) {
            return obj;
        }
        setNewTransactionData(obj);
        return 0;
    }
    function sendToPercentCalculator(e) {
        percentCalculator(e.target.name, e.target.value);
    }
    function sendTransactionData(datain) {
        // datain.account = datain?.account?.name;
        console.dir(newTransactionData);
        // return;
        setLoad(true);
        // let { amount, description, items } = datain;
        // if (datain.reason == "note") {
        //     let newdata = { reason: "note", ...datain, idjob: id };
        //     let newnote = [...jobNoteFiltered, { amount, description, items }];
        //     let url1 =
        //         datain.reason === "fromjob"
        //             ? "/api/transaction/getfromjob"
        //             : "/api/transaction/addtojob";
        //     // alert(JSON.stringify(datain));
        //     xaxios
        //         .post(url1, {
        //             ...newdata,
        //             newnote,
        //         })
        //         .then((res) => {
        //             // refetchData()
        //             console.warn("can not update notes");
        //             openCloseMiniPop("can not update note", "open");
        //             openCloseModal("all", "close");
        //             setpopwindow(null);
        //         })
        //         .finally(() => {
        //             setLoad(false);
        //             setNewTransactionData({
        //                 ...newTransactionData,
        //                 description: "",
        //             });
        //         });
        //     return;
        // }
        let url1 = "/api/transaction/addtojob?category=hidden";
        xaxios
            .post(url1, { ...newTransactionData, sharingOrder })
            .then((res) => {
                refetchData();
                openCloseModal("all", "close");
                setpopwindow(null);
            })
            .finally(() => {
                setLoad(false);
            });
    }
}
