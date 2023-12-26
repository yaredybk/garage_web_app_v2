const tojobCategory_FunctionConstructor = {
    // ////////////////////////////////////////////////
    replacement: {
        category: "replacement",
        reason: "tojob",
        method: "tojob",
        balanceOperation: -1,
        inactiveOperation: 1,
        account: null,
        idaccount: "",
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

export default function NewPartForm({
    id,
    refetchData = null,
    setpopwindow = () => null,
    datain = {},
}) {
    const { list_accounts, refetchPreset } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [accountgroup, setaccountgroup] = useState(null);
    const [sharingOrder, setSharingOrder] = useState({
        order: null,
        accounts: null,
    });
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: "",
        amount: "",
        amountshared: "",
        amountgarage: "",
        amountorigin: "",
        reason: "tojob",
        method: null,
        description: null,
        category: "replacement",
        idjob: id,
        percent: 0,
        enablesharing: true,
        items: 1,
        unitprice: "",
        idstock: null,
        idtransaction: datain?.idtransaction,
        ...datain, //depricated
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
            <SelectAccountCategory />
            {accountgroup && (
                <InputContainer
                    htmlFor="idaccount"
                    title="part owner/buyer account"
                    className=" flex gap-2  max-w-fit mx-auto"
                >
                    <select
                        required
                        name="idaccount"
                        id="idaccount"
                        value={newTransactionData.idaccount}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (!val) return console.log("invalid id");
                            let account = list_accounts?.find(
                                (obj) => obj?.idaccount == val
                            );
                            // console.log(account);
                            let newdata = percentCalculator(
                                "percent",
                                account?.percent,
                                true
                            );
                            setNewTransactionData({
                                ...newdata,
                                idaccount: val,
                            });
                        }}
                    >
                        <option value=""> - - - </option>
                        {list_accounts?.map(
                            (obj, ind) =>
                                obj?.role == accountgroup &&
                                obj.idaccount != 2 && (
                                    <option key={ind} value={obj?.idaccount}>
                                        {obj?.name}
                                    </option>
                                )
                        )}
                    </select>
                    =
                    {newTransactionData.enablesharing && (
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
                    )}
                </InputContainer>
            )}
            {newTransactionData.idaccount && (
                <>
                    {newTransactionData.idaccount != 3 ? (
                        <InputContainer
                            className="bg-blue-100 min-w-[18rem] py-1 -m-[2px] pb-1 rounded-sm"
                            title="share with garage"
                            htmlFor="enablesharing"
                        >
                            {newTransactionData?.enablesharing ? (
                                <div className="py-1    max-w-fit flex gap-1 ">
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
                                    <input
                                        name="idgarage"
                                        id="idgarage"
                                        readOnly
                                        className=" w-14 px-0"
                                        value="garage"
                                        type="text"
                                    ></input>
                                    <input
                                        autoComplete="off"
                                        value={newTransactionData?.percent}
                                        className=" w-10"
                                        type="number"
                                        name="percent"
                                        id="percent"
                                        placeholder="%"
                                        onChange={sendToPercentCalculator}
                                    />
                                    <span>
                                        <input
                                            autoComplete="off"
                                            value={
                                                newTransactionData?.amountgarage
                                            }
                                            className=" w-20"
                                            type="number"
                                            required
                                            name="amountgarage"
                                            id="amountgarage"
                                            min={1}
                                            onChange={sendToPercentCalculator}
                                        />
                                        <span className="absolute">birr</span>
                                    </span>
                                </div>
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
                        </InputContainer>
                    ) : (
                        <SelectStock UpStockObj={UpStockObj} />
                    )}
                    <div className="grid gap-1 grid-flow-col">
                        <InputContainer htmlFor="amount">
                            <input
                                autoComplete="off"
                                required
                                type="number"
                                name="amount"
                                id="amount"
                                className=" w-24"
                                value={newTransactionData.amount}
                                onChange={sendToPercentCalculator}
                            />
                        </InputContainer>
                        <InputContainer htmlFor="items">
                            <input
                                autoComplete="off"
                                required
                                type="number"
                                name="items"
                                id="items"
                                className=" w-10"
                                value={newTransactionData.items}
                                onChange={sendToPercentCalculator}
                            />
                        </InputContainer>
                        <InputContainer title="unit price" htmlFor="unitprice">
                            <input
                                autoComplete="off"
                                required
                                type="number"
                                name="unitprice"
                                id="unitprice"
                                className=" w-20"
                                value={newTransactionData.unitprice}
                                onChange={sendToPercentCalculator}
                            />
                        </InputContainer>
                    </div>
                    <InputContainer htmlFor="part name">
                        <input
                            required
                            defaultValue={newTransactionData.description}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    description: e.target.value,
                                });
                            }}
                            readOnly={newTransactionData.idstock}
                            name="part name"
                            id="part name"
                        ></input>
                    </InputContainer>
                    <FoldedSection className="grid gap-2 p-2">
                        {sampleData.map(
                            (nam) =>
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
            <div className="account_category flex grid-cols-4 gap-1 p-1">
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
        let { amount, amountgarage, amountorigin, percent, unitprice, items } =
            newTransactionData;
        // let amount = newTransactionData?.amount;
        // let amountgarage = newTransactionData?.amountgarage;
        // let amountorigin = newTransactionData?.amountorigin;
        // let percent = newTransactionData?.percent;
        // let unitprice = newTransactionData?.unitprice;
        // let items = newTransactionData?.items;
        value = value;
        if (value === "") {
            if (valuetype == "amountgarage") {
                amountgarage = "";
                // amountorigin = amount;
                // percent = 0;
            } else if (valuetype == "percent") {
                percent = "";
                amount = "";
                amountgarage = "";
                amountorigin = "";
                unitprice = "";
            } else if (valuetype == "items") {
                items = "";
            } else {
                amount = "";
                amountgarage = "";
                amountorigin = "";
                unitprice = "";
            }
        } else {
            amount = Number(amount);
            amountgarage = Number(amountgarage);
            amountorigin = Number(amountorigin);
            percent = Number(percent);
            unitprice = Number(unitprice);
            items = Number(items);
            value = Number(value);
            switch (valuetype) {
                case "unitprice":
                    amount = value * items;
                    unitprice = value;
                    amountorigin = Math.round((amount * 100) / (percent + 100));
                    amountgarage = Math.round(
                        (amount * percent) / (percent + 100)
                    );
                    break;
                case "items":
                    items = value;
                    // amount = (amount / items) * value;
                    // amountorigin = Math.round((amount * 100) / (percent + 100));
                    // amountgarage = Math.round(
                    //     (amount * percent) / (percent + 100)
                    // );
                    if (items) unitprice = amount / items;
                    break;
                case "amount":
                    amount = value;
                    amountorigin = Math.round((amount * 100) / (percent + 100));
                    amountgarage = Math.round(
                        (amount * percent) / (percent + 100)
                    );

                    if (items) unitprice = amount / items;
                    break;
                case "amountorigin":
                    amountorigin = value;
                    amount = amountgarage + amountorigin;
                    // amountgarage = amount - amountorigin;
                    if (amountorigin)
                        percent = Math.round(
                            (amountgarage / amountorigin) * 100
                        );
                    if (items) unitprice = amount / items;
                    break;
                case "amountgarage":
                    amountgarage = value;
                    amount = amountgarage + amountorigin;
                    // amountorigin = amount - amountgarage;
                    if (amountorigin)
                        percent = Math.round(
                            (amountgarage / amountorigin) * 100
                        );
                    if (items) unitprice = amount / items;
                    //  Math.round((amountgarage * (percent + 100)) / percent);
                    // amountgarage =Math.round( amount *(1- percent/100));
                    // amountorigin = Math.round((amount * 100) / (percent + 100));
                    break;
                case "percent":
                    percent = value;
                    amountgarage = Math.round((amountorigin * percent) / 100);
                    amount = amountorigin + amountgarage;
                    if (items) unitprice = amount / items;
                    // amountorigin = Math.round((amount * 100) / (percent + 100));

                    break;
                default:
                    break;
            }
        }

        let obj = {
            ...newTransactionData,
            amount: amount ? amount : "",
            amountgarage: amountgarage ? amountgarage : "",
            amountorigin: amountorigin ? amountorigin : "",
            unitprice: unitprice ? unitprice : "",
            items,
            percent: percent ? percent : "",
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
        let url1 = "/api/transaction/addtojob?category=replacement";
        xaxios
            .post(url1, { ...newTransactionData, sharingOrder })
            .then((res) => {
                refetchData();
                refetchData();
                openCloseModal("all", "close");
                setpopwindow(null);
                refetchPreset();
            })
            .finally(() => {
                setLoad(false);
            });
    }
    function UpStockObj(stockObj) {
        openCloseModal("select from stock", "close");
        let newState = percentCalculator(
            "unitprice",
            stockObj?.unitprice,
            true
        );
        setNewTransactionData({
            ...newState,
            description: stockObj?.name,
            idstock: stockObj?.idstock,
        });
    }
}
function SelectStock({ UpStockObj = () => null }) {
    const { list_stock } = useContext(GlobalState);
    return (
        <div>
            <button
                onClick={() => {
                    openCloseModal("select from stock", "open");
                }}
                className=" bg-blue-200 text-blue-900 "
                type="button"
            >
                select from store
            </button>
            <BasicDialog id="select from stock">
                <div className="flex gap-2 flex-wrap">
                    {list_stock &&
                        list_stock.map((obj, ind) => (
                            <button
                                type="button"
                                className=" grid text-sm gap-1 p-1 bg-cyan-100 text-cyan-600"
                                key={ind}
                                onClick={() => UpStockObj(obj)}
                            >
                                <span className=" bold text-cyan-900">
                                    {obj?.name}
                                </span>
                                <span>
                                    items: {obj?.items} {obj?.unit}
                                </span>
                                <span>price: {obj?.unitprice}</span>
                            </button>
                        ))}
                </div>
            </BasicDialog>
        </div>
    );
}
