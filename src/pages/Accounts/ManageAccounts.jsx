import React, { useContext, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import AdvancedForm from "../../components/form/AdvancedForm";
import xaxios from "../../utils/xaxios";
import TableWithUrl from "../../components/tables/TableWithUrl";
import { LoadingState } from "../../context/LoadingContext";
import OverFlowAuto from "../../components/OverFlowAuto";
import { GlobalState } from "../../context/GlobalContext";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";
import { useParams } from "react-router-dom";

export default function ManageAccounts() {
    let {role} = useParams();
    role = role  || "all";
    const { load, setLoad } = useContext(LoadingState);
    const roles = ["agent", "employee","company"];
    const [refetchState, setRefetchState] = useState(0);
    const fields = [
        { title: "idaccount", required: false, readOnly: true, type: "number" },
        { title: "name", required: true, type: "text" },
        { title: "role", required: false, type: "select", options: roles },
        { title: "phone", required: false, type: "text",pattern:"[0-9]{9}" },
        { title: "percent", required: true, type: "number" },
        { title: "proffession", required: false, type: "text" },
        { title: "salary", required: false, type: "number" },
        {
            title: "salarytype",
            required: true,
            type: "select",
            options: ["non", "percent", "month", "week", "collect"],
        },
    ];
    const { refetchPreset } = useContext(GlobalState);
    function editAccount(params) {
        Object.keys(params).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = params[key];
            }
        });
        openCloseModal("new account form", "open");
    }
    function refetch() {
        setRefetchState(Date.now());
    }
    return (
        <main className=" bg-white gap-1 p-2 grid w-fit max-w-[24cm] mx-auto ">
            <BasicDialog id="new account form">
                <center>
                    <h3>New Account Registration</h3>
                </center>
                <AdvancedForm
                    onSubmit={onSubmit}
                    title="new_account_form"
                    fields={fields}
                />
            </BasicDialog>
            <h1 className=" text-green-600">Accounts List</h1>
            <button
                onClick={() => {
                    const element = document.getElementById("new_account_form");
                    element?.reset();
                    openCloseModal("new account form", "open");
                }}
                type="button"
                className=" bg-blue-500 float-right absolute right-5"
            >
                <img src="/public/images/add.svg" alt="+" className=" h-6" />
            </button>
            <OverFlowAuto>
                <TableWithUrl
                    key={refetchState}
                    rowObjectUP={editAccount}
                    url={`/api/getlist/accounts/${role}`}
                />
            </OverFlowAuto>
        </main>
    );
    function onSubmit(datain) {
        xaxios
            .post("/api/addnew/account", datain, setLoad)
            .then(() => {
                refetch();
                refetchPreset();
                openCloseModal("all", "close");
                document.getElementById("new_account_form")?.reset();
            })
            .catch(() => refetch());
    }
}
