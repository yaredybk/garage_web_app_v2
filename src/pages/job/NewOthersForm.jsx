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

export default function NewOthersForm({
    id,
    refetchData = null,
    setpopwindow = () => null,
    datain = undefined,
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
        category: "other",
        idjob: id,
        percent: 0,
        enablesharing: true,
        items: 1,
        unitprice: "",
        idtransaction: datain?.idtransaction,
    });
    let sampleData = ["reason", "method", "category", "idjob"];
    return (
        <BasicForm
            title={newTransactionData.category}
            formClass=" grid gap-2 "
            key={newTransactionData.category}
            removeEmpty={false}
            onSubmit={sendTransactionData}
        >
            <InputContainer title="Total Amount" htmlFor="amount">
                <input
                    autoFocus
                    autoComplete="off"
                    required
                    type="number"
                    name="amount"
                    id="amount"
                    value={newTransactionData.amount}
                    onChange={sendToPercentCalculator}
                />
            </InputContainer>
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
                    <InputContainer title="sharing" htmlFor="enablesharing">
                        <div className="bg-blue-100 min-w-[18rem] py-2 -m-[2px] pb-1 rounded-sm">
                            <div className=" flex flex-wrap   gap-2"></div>
                            {newTransactionData?.enablesharing ? (
                                <>
                                    <div className="grid gap-1">
                                        <div className="py-1  mx-auto  max-w-fit flex gap-2 ">
                                            <input
                                                checked={
                                                    newTransactionData.enablesharing
                                                }
                                                onChange={(e) => {
                                                    let val = e.target.checked;
                                                    // console.log(val);
                                                    setNewTransactionData({
                                                        ...newTransactionData,
                                                        enablesharing: val,
                                                    });
                                                }}
                                                type="checkbox"
                                                name="enablesharing"
                                                id="enablesharing"
                                            />
                                            <select
                                                name="idgarage"
                                                id="idgarage"
                                                defaultValue="2"
                                                className=" p-2"
                                            >
                                                <option value="2">
                                                    garage
                                                </option>
                                            </select>
                                            <span>
                                                <input
                                                    autoComplete="off"
                                                    value={
                                                        newTransactionData?.amountgarage
                                                    }
                                                    className=" w-20"
                                                    type="number"
                                                    name="amountgarage"
                                                    id="amountgarage"
                                                    min={1}
                                                    onChange={
                                                        sendToPercentCalculator
                                                    }
                                                />
                                                <span className="absolute">
                                                    birr
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <input
                                    checked={newTransactionData.enablesharing}
                                    onChange={(e) => {
                                        let val = e.target.checked;
                                        // console.log(val);
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            enablesharing: val,
                                        });
                                    }}
                                    type="checkbox"
                                    name="enablesharing"
                                    id="enablesharing"
                                />
                            )}
                        </div>
                    </InputContainer>
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
                            name="other description"
                            id="other description"
                        ></input>
                    </InputContainer>
                    <FoldedSection className="grid gap-2 p-2">
                        {sampleData.map((nam) => (
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
                        ))}
                    </FoldedSection>
                    <ButtonSubmit disableOnClick={true}>
                        {newTransactionData?.idtransaction
                            ? "append"
                            : "upload"}
                    </ButtonSubmit>
                </>
            )}
        </BasicForm>
    );
    function SelectAccountCategory() {
        return (
            <div className="account_category grid grid-cols-4 gap-1 flex-wrap p-1">
                {["internal", "client", "agent", "employee"].map(
                    (type, ind) => (
                        <span
                            key={type}
                            className={
                                accountgroup == type
                                    ? "bg-green-300 p-0 py-1 overflow-hidden flex rounded-sm"
                                    : "bg-gray-300 p-0 py-1 overflow-hidden flex rounded-sm"
                            }
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
                                        amountorigin: 0,
                                        enablesharing: false,
                                    });
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
                        >
                            <input
                                checked={accountgroup == type}
                                name={type}
                                type="radio"
                                onChange={() => null}
                            />
                            <label htmlFor={type}>{type}</label>
                        </span>
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
        if (value == "") {
            if (valuetype == "amountgarage") {
                amountgarage = "";
                amountorigin = amount;
                // percent = 0;
            } else {
                amount = "";
                amountgarage = "";
                amountorigin = "";
            }
        } else
            switch (valuetype) {
                case "amount":
                    amount = value;
                    amountorigin = amount - amountgarage;
                    break;
                case "amountorigin":
                    amountorigin = value;
                    amountgarage = amount - amountorigin;
                    // amountorigin =Math.round( amount *( percent/100));
                    break;
                case "amountgarage":
                    amountgarage = value;
                    amountorigin = amount - amountgarage;
                    // amountgarage =Math.round( amount *(1- percent/100));
                    break;

                default:
                    break;
            }
        let obj = {
            ...newTransactionData,
            amount,
            amountgarage,
            amountorigin,
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
        // console.dir(newTransactionData);
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
        let url1 = "/api/transaction/addtojob?category=other";
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
