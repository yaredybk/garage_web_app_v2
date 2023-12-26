const tojobCategory_FunctionConstructor = {
    mechanical: {
        category: "mechanical",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
        amount: "",
    },
    electrical: {
        category: "electrical",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
        amount: "",
    },
    body: {
        category: "body",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
        amount: "",
    },
    painting: {
        category: "painting",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
        amount: "",
    },
    inspection: {
        category: "inspection",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
        amount: "",
    },
    // ////////////////////////////////////////////////
    replacement: {
        category: "replacement",
        reason: "tojob",
        method: "tojob",
        balanceOperation: -1,
        inactiveOperation: 1,
        account: null,
        idaccount: 0,
        amount: "",
    },
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
    hidden: {
        category: "hidden",
        reason: "hidden",
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
import InputContainer from "./../../components/input/InputContainer";
import FoldedSection from "./../../components/FoldedSection";
import ButtonSubmit from "./../../components/button/ButtonSubmit";
import { GlobalState } from "../../context/GlobalContext";
import BasicDialog from "./../../components/dialog/BasicDialog";
import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import xaxios from "../../utils/xaxios";
import { LoadingState } from "../../context/LoadingContext";

export default function NewServiceForm({
    id,
    refetchData = null,
    setpopwindow = () => null,
    idtransaction = undefined,
    datain = undefined,
}) {
    const { list_accounts } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [manualEdit, setManualEdit] = useState(false);

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
        reason: null,
        method: null,
        description: null,
        category: null,
        idjob: id,
        percent: 0,
        idaccountshared: "",
        enablesharing: true,
        accountInfoShared: null,
        enablevat: false,
        idtransaction: datain?.idtransaction,
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
    function onChangeIdAccountShared(e) {
        let val = e.target.value;
        if (!val) return console.log("invalid id");
        let account = list_accounts?.find((obj) => obj?.idaccount == val);
        // console.log(account);
        let newdata = percentCalculator("percent", account?.percent, true);
        setNewTransactionData({
            ...newdata,
            idaccountshared: val,
            accountInfoShared: account,
            percent: account?.percent,
        });
    }
    function SelectAccountCategory() {
        return (
            <div className="account_category flex items-stretch  gap-2  p-1">
                <input
                    defaultChecked
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
                {["agent", "employee"].map((type, ind) => (
                    <button
                        key={type}
                        onClick={() => {
                            setaccountgroup(type);
                            setNewTransactionData({
                                ...newTransactionData,
                                percent: 0,
                                amountshared: 0,
                                amountgarage: newTransactionData.amount,
                                idaccountshared: "",
                                accountInfoShared: null,
                            });
                        }}
                        type="button"
                        className={
                            accountgroup == type
                                ? "bg-green-300 flex-1 p-1 pb-2 border-solid border-2  "
                                : "bg-gray-300 flex-1 p-1 pb-2  border-solid border-2 border-gray-400 "
                        }
                    >
                        {type}
                    </button>
                ))}
                <button
                    onClick={() => {
                        setManualEdit(!manualEdit);
                    }}
                    className={
                        manualEdit
                            ? " border-2 h-full py-0 px-1 border-solid border-gray-600 bg-red-400 animate-ping-1"
                            : " border-2 h-full py-0 px-1 border-solid border-gray-300 "
                    }
                    type="button"
                >
                    <img
                        className="   h-7"
                        src="/public/images/edit.svg"
                        alt="edit"
                    />
                </button>
            </div>
        );
    }
    function addNewTransactionToJob(key) {
        setaccountgroup(null);
        let newObj = tojobCategory_FunctionConstructor[key];
        newObj.idjob = id;
        setaccountgroup("employee");
        setNewTransactionData({ ...newTransactionData, ...newObj });
        openCloseModal("new service form", "open");
        document.getElementById("amount")?.focus();
    }
    function percentCalculator(valuetype, value = 0, nostatechange = null) {
        let amount = newTransactionData.amount;
        let amountgarage = 0;
        let amountshared = 0;
        let percent = newTransactionData.percent;
        if (value === "") {
            if (valuetype == "amount") {
                amount = "";
                amountgarage = "";
                amountshared = "";
            } else if (valuetype == "amountshared") {
                amountgarage = amount;
                amountshared = "";
                percent = 0;
            } else if (valuetype == "amountgarage") {
                amountgarage = "";
                // percent = 0;
            } else if (valuetype == "percent") {
                percent = "";
                amountgarage = 0;
            }
        } else
            switch (valuetype) {
                case "amount":
                    amount = value;
                    amountgarage = Math.round(
                        amount * (1 - newTransactionData.percent / 100)
                    );
                    amountshared = Math.round(
                        amount * (newTransactionData.percent / 100)
                    );
                    break;
                case "amountshared":
                    amountshared = value;
                    // amount = Math.round(
                    //     amountshared / (newTransactionData.percent / 100)
                    // );
                    amountgarage = amount - amountshared;
                    percent = Math.round((amountshared / amount) * 100);
                    //  Math.round( amount * (1 - newTransactionData.percent / 100));
                    // amountshared =Math.round( amount *( newTransactionData.percent/100));
                    break;
                case "amountgarage":
                    amountgarage = value;
                    amountshared = amount - amountgarage;
                    percent = Math.round((amountshared / amount) * 100);
                    // amount = Math.round(
                    //     amountgarage / (1 - newTransactionData.percent / 100)
                    // );
                    // amountgarage =Math.round( amount *(1- newTransactionData.percent/100));
                    // amountshared = Math.round(
                    //     amount * (newTransactionData.percent / 100)
                    // );
                    break;
                case "percent":
                    percent = value;
                    if (percent == 0) {
                        amountgarage = Math.round(amount);
                        amountshared = Math.round(0);
                        break;
                    }
                    // amount =Math.round( amountgarage/ (1- newTransactionData.percent/100));
                    amountgarage = Math.round(amount * ((100 - percent) / 100));
                    amountshared = Math.round(amount * (percent / 100));
                    break;

                default:
                    break;
            }
        let obj = {
            ...newTransactionData,
            amount,
            amountgarage,
            amountshared,
            percent: manualEdit ? newTransactionData.percent : percent,
        };
        if (nostatechange) {
            return obj;
        }
        return setNewTransactionData(obj);
    }
    function sendToPercentCalculator(e) {
        percentCalculator(e.target.name, e.target.value);
    }
    function sendTransactionData(datain) {
        setLoad(true);
        // console.log(newTransactionData);
        // return;
        let url1 = "/api/transaction/addtojob?category=service";
        xaxios
            .post(url1, { ...newTransactionData, sharingOrder })
            .then((res) => {
                refetchData();
                // if (newTransactionData?.idtransaction)
                //     openCloseModal("new service form", "close");
                // else
                openCloseModal("all", "close");
                setpopwindow(null);
            })
            .finally(() => {
                setLoad(false);
            });
    }
    return (
        <>
            <div className="flex flex-wrap gap-2">
                {Object.keys(tojobCategory_FunctionConstructor).map(
                    (key, ind) =>
                        ind < 5 && (
                            <ButtonSubmit
                                key={key}
                                onClick={() => addNewTransactionToJob(key)}
                            >
                                {key}
                            </ButtonSubmit>
                        )
                )}
            </div>
            <BasicDialog id="new service form">
                <BasicForm
                    title={newTransactionData.category}
                    formClass=" flex flex-col items-center gap-2 "
                    key={newTransactionData.category}
                    removeEmpty={false}
                    onSubmit={sendTransactionData}
                >
                    <span className=" gap-2 hidden">
                        {newTransactionData?.idtransaction && (
                            <input
                                type="number"
                                name="idtransaction"
                                id="idtransaction"
                                readOnly
                                value={newTransactionData?.idtransaction}
                            />
                        )}
                        <label htmlFor="idaccount">Garage</label>
                        <input
                            readOnly
                            type="number"
                            name="idaccount"
                            id="idaccount"
                            value={2}
                            className=" w-8"
                        />
                    </span>
                    <InputContainer htmlFor="NET Amount">
                        <div className=" flex items-stretch justify-evenly gap-2">
                            <input
                                min={1}
                                autoFocus
                                className=" bg-yellow-200 border-yellow-400 border rounded-sm text-yellow-800 w-24"
                                autoComplete="off"
                                required={
                                    newTransactionData?.category != "note"
                                }
                                type="number"
                                name="amount"
                                id="amount"
                                value={newTransactionData.amount}
                                onChange={(e) => {
                                    percentCalculator(
                                        e.target.name,
                                        e.target.value
                                    );
                                }}
                            />
                            <span className="bg-red-100 flex  outline-red-300 outline outline-2 rounded-md text-red-500 items-stretch">
                                <label htmlFor="enablevat" className="px-3">
                                    vat
                                </label>
                                <input
                                    onChange={(e) => {
                                        let tmp = e.target.checked;
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            enablevat: tmp,
                                        });
                                    }}
                                    type="checkbox"
                                    name="enablevat"
                                    id="enablevat"
                                />
                                {newTransactionData.enablevat && (
                                    <input
                                        className=" w-16"
                                        type="number"
                                        readOnly
                                        value={
                                            Math.round(
                                                newTransactionData.amount * 15
                                            ) / 100
                                        }
                                        name="vat"
                                        id="vat"
                                    />
                                )}
                            </span>
                        </div>
                    </InputContainer>
                    <InputContainer
                        className="bg-blue-100 min-w-[18rem]  -m-[2px] pb-1 rounded-sm"
                        title="share with employee / agent"
                        htmlFor="enablesharing"
                    >
                        {newTransactionData?.enablesharing ? (
                            <div className="grid gap-1">
                                <SelectAccountCategory />
                                <div className="py-1  mx-auto  max-w-fit grid grid-cols-[1fr,auto,auto] gap-2 ">
                                    <select
                                        className=" w-32"
                                        name="idaccountshared"
                                        id="idaccountshared"
                                        required
                                        value={
                                            newTransactionData.idaccountshared
                                                ? newTransactionData.idaccountshared
                                                : 0
                                        }
                                        onChange={onChangeIdAccountShared}
                                    >
                                        <option value="">
                                            {accountgroup}-
                                        </option>
                                        <optgroup
                                            label={newTransactionData.category}
                                        >
                                            {list_accounts?.map(
                                                (obj, ind) =>
                                                    obj?.role == accountgroup &&
                                                    obj?.proffession ==
                                                        newTransactionData.category && (
                                                        <option
                                                            key={ind}
                                                            value={
                                                                obj.idaccount
                                                            }
                                                        >
                                                            {obj?.name}
                                                        </option>
                                                    )
                                            )}
                                        </optgroup>
                                        <optgroup label="others">
                                            {list_accounts?.map(
                                                (obj, ind) =>
                                                    obj?.role ==
                                                        accountgroup && (
                                                        <option
                                                            key={ind}
                                                            value={
                                                                obj.idaccount
                                                            }
                                                        >
                                                            {obj?.name}
                                                        </option>
                                                    )
                                            )}
                                        </optgroup>
                                    </select>
                                    <select
                                        name="percent"
                                        id="percent"
                                        className=" w-20"
                                        required
                                        disabled={manualEdit}
                                        value={
                                            newTransactionData.percent
                                                ? newTransactionData.percent
                                                : 0
                                        }
                                        onChange={(e) => {
                                            percentCalculator(
                                                "percent",
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <optgroup label="common">
                                            <option value="0">0 %</option>
                                            <option value="5">5 %</option>
                                            <option value="10">10 %</option>
                                            <option value="15">15 %</option>
                                            <option value="20">20 %</option>
                                            <option value="25">25 %</option>
                                            <option value="30">30 %</option>
                                            <option value="50">50 %</option>
                                            <option value="100">100 %</option>
                                        </optgroup>
                                        <optgroup label="more">
                                            {[...Array(101).keys()]?.map(
                                                (vall, ind) => (
                                                    <option
                                                        key={ind}
                                                        value={vall}
                                                    >
                                                        {vall} %
                                                    </option>
                                                )
                                            )}
                                        </optgroup>
                                    </select>
                                    <input
                                        autoComplete="off"
                                        value={newTransactionData?.amountshared}
                                        className=" w-20 "
                                        type="number"
                                        name="amountshared"
                                        id="amountshared"
                                        min={0}
                                        onChange={sendToPercentCalculator}
                                    />
                                    <select
                                        name="idgarage"
                                        id="idgarage"
                                        readOnly
                                        disabled
                                        defaultValue="2"
                                        className=" p-2"
                                    >
                                        <option value="2">garage</option>
                                    </select>
                                    <input
                                        disabled
                                        autoComplete="off"
                                        value={`${
                                            100 - newTransactionData?.percent
                                        } %`}
                                        className=" w-16"
                                        type="text"
                                        name="percentgarage"
                                        id="percentgarage"
                                    />
                                    <input
                                        autoComplete="off"
                                        required
                                        value={newTransactionData?.amountgarage}
                                        className=" w-20"
                                        type="number"
                                        name="amountgarage"
                                        id="amountgarage"
                                        min={0}
                                        onChange={sendToPercentCalculator}
                                    />
                                </div>
                            </div>
                        ) : (
                            <input
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
                            name="description"
                            id="description"
                        ></input>
                    </InputContainer>
                    <FoldedSection className="grid gap-2 py-2 w-full">
                        {sampleData.map(
                            (nam) =>
                                nam != "idaccount" &&
                                nam != "amount" &&
                                nam != "description" && (
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
                    <ButtonSubmit disableOnClick={true}>
                        {newTransactionData?.idtransaction
                            ? "append"
                            : "upload"}
                    </ButtonSubmit>
                </BasicForm>
            </BasicDialog>
        </>
    );
}
