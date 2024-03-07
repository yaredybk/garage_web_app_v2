const tojobCategory_FunctionConstructor = {
    mechanical: {
        category: "mechanical",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
    },
    electrical: {
        category: "electrical",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
    },
    body: {
        category: "body",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
    },
    painting: {
        category: "painting",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
    },
    inspection: {
        category: "inspection",
        reason: "service",
        method: "tojob",
        balanceOperation: 0,
        inactiveOperation: 1,
        account: null,
        idaccount: 2,
    },
    // ////////////////////////////////////////////////

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
import InputContainer_v2 from "../../components/input/InputContainer_v2";
import ButtonSubmit_v2 from "./../../components/button/ButtonSubmit_v2";
import AccountSelector_v2 from "../../utils/AccountSelector_v2";
import IconSmall from "../../components/IconSmall";
import IconLock from "./../../components/IconLock";

export default function NewServiceForm({
    id,
    refetchData = null,
    setpopwindow = () => null,
    idtransaction = undefined,
    datain = undefined,
}) {
    const { list_accounts } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [manualEdit, setManualEdit] = useState(true);

    const [accountgroup, setaccountgroup] = useState(null);
    const [sharingOrder, setSharingOrder] = useState({
        order: null,
        accounts: null,
    });
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: list_accounts.find(
            (o) => o.role == "internal" && o.name == "garage"
        )?.idaccount,
        amount: datain?.amount || "",
        amountshared: "",
        enablegarage: true,
        amountgarage: "",
        reason: null,
        method: null,
        description: datain?.description || null,
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
        if (!val) {
            setNewTransactionData({
                ...newTransactionData,
                idaccountshared: val,
            });
            return;
        }
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
    function addNewTransactionToJob(key) {
        setaccountgroup(null);
        let newObj = {
            category: "painting",
            reason: "service",
            method: "tojob",
        };
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
                // percent = 0;
            } else if (valuetype == "amountgarage") {
                amountgarage = "";
                // percent = 0;
            } else if (valuetype == "percent") {
                percent = "";
                // amountgarage = 0;
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
                    // percent = Math.round((amountshared / amount) * 100);
                    //  Math.round( amount * (1 - newTransactionData.percent / 100));
                    // amountshared =Math.round( amount *( newTransactionData.percent/100));
                    break;
                case "amountgarage":
                    amountgarage = value;
                    amountshared = amount - amountgarage;
                    // percent = Math.round((amountshared / amount) * 100);
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
            percent: manualEdit ? newTransactionData.percent : percent,
        };
        if (newTransactionData.enablegarage) obj.amountgarage = amountgarage;
        if (newTransactionData.enablesharing) obj.amountshared = amountshared;
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
        let url1 = "/api/transaction/addtojob/service";
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
            <BasicDialog
                withcalc
                title={newTransactionData.category}
                id="new service form"
            >
                <BasicForm
                    formClass=" flex flex-col  gap-2 "
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
                    <InputContainer_v2 htmlFor="description">
                        <input
                            className=" w-[20rem] max-sm:w-auto"
                            required
                            autoFocus
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
                    </InputContainer_v2>
                    {newTransactionData.description && (
                        <>
                            <InputContainer_v2 htmlFor="amount" title="$NET">
                                <input
                                    // min={1}
                                    // autoFocus
                                    autoComplete="off"
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    readOnly={!manualEdit}
                                    value={newTransactionData.amount}
                                    onChange={(e) => {
                                        percentCalculator(
                                            e.target.name,
                                            e.target.value
                                        );
                                    }}
                                />
                                <label
                                    htmlFor="amount"
                                    type="button"
                                    onClick={() => setManualEdit(!manualEdit)}
                                >
                                    <IconLock locked={!manualEdit} />
                                </label>
                            </InputContainer_v2>
                            <InputContainer_v2
                                htmlFor="enablegarage"
                                title="$Garage"
                            >
                                <input
                                    checked={newTransactionData.enablegarage}
                                    onChange={(e) => {
                                        let val = e.target.checked;
                                        // console.log(val);
                                        let amount = newTransactionData.amount;
                                        if (
                                            !(
                                                newTransactionData.enablesharing &&
                                                val
                                            )
                                        ) {
                                            amount = 0;
                                        }
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            enablegarage: val,
                                            amountgarage: 0,
                                            amount,
                                        });
                                    }}
                                    type="checkbox"
                                    name="enablegarage"
                                    id="enablegarage"
                                />
                                {/* {newTransactionData.enablegarage && ( */}
                                <>
                                    <select
                                        name="idgarage"
                                        className="hidden p-2"
                                        id="idgarage"
                                        readOnly
                                        disabled
                                        defaultValue="2"
                                    >
                                        <option value="2">garage</option>
                                    </select>
                                    <input
                                        autoComplete="off"
                                        required
                                        readOnly={manualEdit}
                                        value={newTransactionData?.amountgarage}
                                        type="number"
                                        name="amountgarage"
                                        id="amountgarage"
                                        min={0}
                                        max={newTransactionData.amount}
                                        onChange={sendToPercentCalculator}
                                    />
                                    <label
                                        htmlFor="amountgarage"
                                        type="button"
                                        onClick={() =>
                                            setManualEdit(!manualEdit)
                                        }
                                    >
                                        <IconLock locked={manualEdit} />
                                    </label>
                                </>
                                {/* )} */}
                            </InputContainer_v2>
                            <InputContainer_v2
                                title="Technician"
                                htmlFor="enablesharing"
                            >
                                <input
                                    checked={newTransactionData.enablesharing}
                                    onChange={(e) => {
                                        let val = e.target.checked;
                                        // console.log(val);
                                        let amount = newTransactionData.amount;
                                        if (
                                            !(
                                                newTransactionData.enablegarage &&
                                                val
                                            )
                                        ) {
                                            amount = 0;
                                        }
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            enablesharing: val,
                                            amountshared: 0,
                                            amount,
                                        });
                                    }}
                                    type="checkbox"
                                    name="enablesharing"
                                    id="enablesharing"
                                />
                                <AccountSelector_v2
                                    allowedGroups={["employee", "agent"]}
                                    name="idaccountshared"
                                    idaccountin={
                                        newTransactionData.idaccountshared
                                            ? newTransactionData.idaccountshared
                                            : 0
                                    }
                                    id="idaccountshared"
                                    onChange={onChangeIdAccountShared}
                                    required={newTransactionData.enablesharing}
                                />
                                {newTransactionData?.idaccountshared && (
                                    <>
                                        <div className="py-1  mx-auto  max-w-fit grid grid-cols-[1fr,auto,auto] gap-2 ">
                                            <select
                                                name="percent"
                                                id="percent"
                                                className=" w-20"
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
                                                    <option value="0">
                                                        0 %
                                                    </option>
                                                    <option value="5">
                                                        5 %
                                                    </option>
                                                    <option value="10">
                                                        10 %
                                                    </option>
                                                    <option value="15">
                                                        15 %
                                                    </option>
                                                    <option value="20">
                                                        20 %
                                                    </option>
                                                    <option value="25">
                                                        25 %
                                                    </option>
                                                    <option value="30">
                                                        30 %
                                                    </option>
                                                    <option value="50">
                                                        50 %
                                                    </option>
                                                    <option value="100">
                                                        100 %
                                                    </option>
                                                </optgroup>
                                                <optgroup label="more">
                                                    {[
                                                        ...Array(101).keys(),
                                                    ]?.map((vall, ind) => (
                                                        <option
                                                            key={ind}
                                                            value={vall}
                                                        >
                                                            {vall} %
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                            <button
                                                onClick={() => {
                                                    if (manualEdit)
                                                        setManualEdit(
                                                            !manualEdit
                                                        );
                                                    else
                                                        percentCalculator(
                                                            "percent",
                                                            newTransactionData.percent
                                                        );
                                                }}
                                                type="button"
                                                className="p-0 rounded-none"
                                            >
                                                <img
                                                    className="   h-7"
                                                    src={
                                                        manualEdit
                                                            ? "/public/images/lock_FILL0_wght400_GRAD0_opsz24.svg"
                                                            : "/public/images/calculate.svg"
                                                    }
                                                    alt="edit"
                                                />
                                            </button>
                                            <input
                                                autoComplete="off"
                                                value={
                                                    newTransactionData?.amountshared
                                                }
                                                className=" w-20 "
                                                type="number"
                                                name="amountshared"
                                                id="amountshared"
                                                min={0}
                                                max={newTransactionData.amount}
                                                onChange={
                                                    sendToPercentCalculator
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </InputContainer_v2>
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
                                                <label htmlFor={nam}>
                                                    {nam}
                                                </label>
                                                <input
                                                    readOnly={
                                                        newTransactionData[
                                                            nam
                                                        ] && nam === "idjob"
                                                    }
                                                    onChange={(e) => {
                                                        setNewTransactionData({
                                                            ...newTransactionData,
                                                            [nam]: e.target
                                                                .value,
                                                        });
                                                    }}
                                                    value={
                                                        newTransactionData[nam]
                                                            ? newTransactionData[
                                                                  nam
                                                              ]
                                                            : ""
                                                    }
                                                    name={nam}
                                                    id={nam}
                                                ></input>
                                            </div>
                                        )
                                )}
                            </FoldedSection>
                        </>
                    )}
                    <div className="grid gap-2 grid-cols-2">
                        <ButtonSubmit_v2
                            imgProps={{
                                src: "/public/images/add_shopping_cart_FILL0_wght400_GRAD0_opsz24.svg",
                            }}
                        >
                            Add
                        </ButtonSubmit_v2>
                        <ButtonSubmit_v2
                            imgProps={{ src: "/public/images/doneall.svg" }}
                        >
                            {newTransactionData?.idtransaction
                                ? "append"
                                : "upload"}
                        </ButtonSubmit_v2>
                    </div>
                </BasicForm>
            </BasicDialog>
        </>
    );
}
