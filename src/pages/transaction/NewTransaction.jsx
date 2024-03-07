import { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../context/GlobalContext";
import BasicForm from "../../components/form/BasicForm";
import BasicDialog from "../../components/dialog/BasicDialog";
import InputContainer from "../../components/input/InputContainer";
import FoldedSection from "../../components/FoldedSection";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import { openCloseModal } from "../../utils/userInterface";
import { LoadingState } from "../../context/LoadingContext";
import xaxios from "../../utils/xaxios";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import BasicTable from "./../../components/tables/BasicTable";
import TableWithSubtotal from "./../../components/tables/TableWithSubtotal";
import IconSmall from "../../components/IconSmall";
import RenderObject from "./../../features/clients/RenderObject";
import AccountSelector from "../../utils/AccountSelector";
import { useLocation, useNavigate } from "react-router-dom";
import ManageSalary from "./ManageSalary";
import Viewsalary from "./ViewSalary";

export default function NewTransaction() {
    const aa = useLocation();
    const [popwindow, setpopwindow] = useState(null);
    const { list_accounts } = useContext(GlobalState);
    const { load, setLoad } = useContext(LoadingState);
    const [newTransactionData, setNewTransactionData] = useState({
        fromidaccount: "",
        toidaccount: "",
        amount: "",
        reason: "",
        method: "",
        description: "",
        category: "",
        idjob: "",
    });
    let className = " bg-green-400";
    className = " bg-blue-400 ";
    className = "bg-red-400 ";
    const transactionReasons = [
        ["income", "green"],
        ["internal", "blue"],
        ["expense", "red"],
    ];
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
        <main className=" newtransaction">
            <div className="grid gap-2 w-fit place-content-center m-auto min-h-[60vh] ">
                <div className="forsecretary rounded-t-lg rounded-b-md grid outline outline-blue-600">
                    <span className="bg-blue-600 pl-2 font-semibold text-white">
                        Secretary
                    </span>
                    <div className="flex gap-2 p-2">
                        <ButtonSubmit
                            className=" p-4 px-8 bg-green-700 text-white "
                            onClick={() => {
                                let toacc = list_accounts.find(
                                    (ele) => ele.name == "secretary"
                                );
                                setNewTransactionData({
                                    ...newTransactionData,
                                    reason: "income",
                                    toidaccount: toacc.idaccount,
                                    accountgroup: "internal",
                                    method: "cash",
                                });
                                openCloseModal("new income", "open");
                            }}
                        >
                            Income
                        </ButtonSubmit>
                        <ButtonSubmit
                            className=" p-4 px-8 bg-red-700 text-white "
                            onClick={() => {
                                let toacc = list_accounts.find(
                                    (ele) => ele.name == "secretary"
                                );
                                setNewTransactionData({
                                    ...newTransactionData,
                                    reason: "expense",
                                    fromidaccount: toacc.idaccount,
                                    accountgroup: "internal",
                                    method: "cash",
                                });
                                openCloseModal("new expense", "open");
                            }}
                        >
                            Expense
                        </ButtonSubmit>
                    </div>
                </div>
                <div className="forsecretary rounded-t-lg rounded-b-md grid outline outline-blue-600">
                    <span className="bg-blue-600 pl-2 font-semibold text-white">
                        ---
                    </span>
                    <div className="flex gap-2 p-2">
                        <ButtonSubmit
                            className=" p-4 px-8 bg-green-800 text-white "
                            onClick={() => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    reason: "income",
                                });
                                openCloseModal("new income", "open");
                            }}
                        >
                            Income
                        </ButtonSubmit>
                        <ButtonSubmit
                            className=" p-4 px-8 bg-red-800 text-white "
                            onClick={() => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    reason: "expense",
                                });
                                openCloseModal("new expense", "open");
                            }}
                        >
                            Expense
                        </ButtonSubmit>
                    </div>
                </div>
                <div className="forsecretary rounded-t-lg grid gap-1 rounded-b-md  outline outline-blue-600">
                    <span className="bg-blue-600 pl-2 font-semibold text-white">
                        Salary
                    </span>
                    <ButtonSubmit
                        onClick={() => {
                            setpopwindow("Manage salary");
                            openCloseModal("Manage salary", "open");
                        }}
                        type="button"
                        className=" bg-blue-300 p-4 px-8 mx-1"
                    >
                        Transfer Salary
                    </ButtonSubmit>
                    <ButtonSubmit
                        onClick={() => {
                            setpopwindow("View/pay salary");
                            openCloseModal("View/pay salary", "open");
                        }}
                        type="button"
                        className=" bg-red-300 p-4 px-8 mx-1 mb-1"
                    >
                        View/pay Salary
                    </ButtonSubmit>
                </div>
            </div>
            <BasicDialog className=" outline outline-green-400" id="new income">
                {manageTransactionRender("income")}
            </BasicDialog>
            <BasicDialog id="new expense" className=" outline outline-red-400">
                {manageTransactionRender("expense")}
            </BasicDialog>
            <BasicDialog id="Manage salary">
                {popwindow && <ManageSalary list_accounts={list_accounts} />}
            </BasicDialog>
            <BasicDialog id="View/pay salary">
                {popwindow && <Viewsalary list_accounts={list_accounts} />}
            </BasicDialog>
        </main>
    );
    function sendTransactionData(datain) {
        // return console.log(datain);
        setLoad(true);
        // return;
        let url1 = "/api/transaction/single";
        // alert(JSON.stringify(datain));
        xaxios
            .post(url1, datain)
            .then(() => {
                // refetchData();
                openCloseModal("all", "close");
                setNewTransactionData({
                    fromidaccount: "",
                    toidaccount: "",
                    amount: "",
                    reason: "",
                    method: "",
                    description: "",
                    category: "",
                    idjob: "",
                });
            })
            .finally(() => {
                setLoad(false);
            });
    }
    function manageTransactionRender() {
        return (
            <BasicForm
                title={`=>${newTransactionData.reason}`}
                formClass=" grid gap-2 "
                key={newTransactionData.category}
                onSubmit={sendTransactionData}
            >
                {newTransactionData.reason && (
                    <>
                        <div className="h-3 bg-blue-700"></div>
                        <InputContainer htmlFor={<b>FROM ACCOUNT</b>}>
                            {newTransactionData.reason != "income" ? (
                                <AccountSelector
                                    onChange={(e) => {
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            fromidaccount: e.target.value,
                                        });
                                    }}
                                    className=" bg-red-400"
                                    required
                                    name="fromidaccount"
                                    accountgroupin={
                                        newTransactionData.accountgroup
                                    }
                                    id="fromidaccount"
                                    value={newTransactionData.fromidaccount}
                                />
                            ) : (
                                <br></br>
                            )}
                        </InputContainer>
                        <InputContainer htmlFor={<b>TO ACCOUNT</b>}>
                            {newTransactionData.reason != "expense" ? (
                                <AccountSelector
                                    className=" bg-green-200"
                                    required
                                    name="toaccountid"
                                    id="toaccountid"
                                    accountgroupin={
                                        newTransactionData.accountgroup
                                    }
                                    value={newTransactionData.toidaccount}
                                    onChange={(e) => {
                                        setNewTransactionData({
                                            ...newTransactionData,
                                            toidaccount: e.target.value,
                                        });
                                    }}
                                />
                            ) : (
                                <br />
                            )}
                        </InputContainer>
                        <div className="h-3 bg-blue-700"></div>
                        {(newTransactionData.fromidaccount ||
                            newTransactionData.toidaccount) && (
                            <>
                                <InputContainer
                                    title="method of payment"
                                    htmlFor="Method"
                                >
                                    <select
                                        required
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
                                        <option value={""}>
                                            {" "}
                                            select method
                                        </option>
                                        {[
                                            "cash",
                                            "transfer",
                                            "check",
                                            "internal",
                                        ].map((key, ind) => (
                                            <option key={ind} value={key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                </InputContainer>
                                <InputContainer htmlFor="amount">
                                    <input
                                        autoComplete="off"
                                        required
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        value={newTransactionData.amount}
                                        onChange={(e) => {
                                            // newTransactionData?.reason ==
                                            //     "fromjob" &&
                                            //     manageSharing(
                                            //         e.target.value
                                            //     );
                                            setNewTransactionData({
                                                ...newTransactionData,
                                                amount: e.target.value,
                                            });
                                        }}
                                    />
                                </InputContainer>
                                <InputContainer htmlFor="description">
                                    <input
                                        required
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
                                <FoldedSection className="grid gap-2 p-2">
                                    {sampleData.map(
                                        (nam) =>
                                            nam != "idaccount" &&
                                            nam != "amount" &&
                                            nam != "description" &&
                                            !(
                                                newTransactionData?.reason ==
                                                    "fromjob" && nam == "method"
                                            ) && (
                                                <div
                                                    key={nam + " additional"}
                                                    className="grid grid-cols-2 border-b-2 border-0 p-1 border-solid"
                                                >
                                                    <label htmlFor={nam}>
                                                        {nam}
                                                    </label>
                                                    <input
                                                        onChange={(e) => {
                                                            setNewTransactionData(
                                                                {
                                                                    ...newTransactionData,
                                                                    [nam]: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            );
                                                        }}
                                                        value={
                                                            newTransactionData[
                                                                nam
                                                            ]
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
                                <ButtonSubmit>upload</ButtonSubmit>
                            </>
                        )}
                    </>
                )}
            </BasicForm>
        );
    }
}
