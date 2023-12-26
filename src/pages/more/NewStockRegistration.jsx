import React, { useContext, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import AdvancedForm from "../../components/form/AdvancedForm";
import xaxios from "../../utils/xaxios";
import TableWithUrl from "../../components/tables/TableWithUrl";
import { LoadingState } from "../../context/LoadingContext";
import OverFlowAuto from "../../components/OverFlowAuto";
import { GlobalState } from "../../context/GlobalContext";
import BasicTable from "../../components/tables/BasicTable";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";

export default function NewStockRegistration() {
    const { load, setLoad } = useContext(LoadingState);
    const units = ["item", "set", "litre", "KG"];
    const [refetchState, setRefetchState] = useState(0);
    const fields = [
        { title: "idstock", required: false, readOnly: true, type: "number" },
        { title: "name", required: true, type: "text" },
        { title: "unit", required: false, type: "select", options: units },
        { title: "unitprice", required: true, type: "number" },
        { title: "items", required: true, type: "number" },
    ];
    const { refetchPreset, list_stock } = useContext(GlobalState);
    function editRow(params) {
        Object.keys(params).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = params[key];
            }
        });
        openCloseModal("stock form", "open");
    }
    function refetch() {
        setRefetchState(Date.now());
    }
    return (
        <div>
            <center className=" flex gap-3 mx-auto text-center justify-center">
                <h3>New Account Registration</h3>
                <button onClick={newItem} className="bg-green-400 px-4">
                    ADD
                </button>
            </center>
            <BasicDialog id="stock form">
                <AdvancedForm
                    onSubmit={onSubmit}
                    title="New Stock form"
                    fields={fields}
                />
            </BasicDialog>
            <OverFlowAuto className=" mx-auto justify-center flex flex-col">
                <BasicTable
                    data={list_stock}
                    key={refetchState}
                    rowObjectUP={editRow}
                    url={"/api/getlist/stocks"}
                />
            </OverFlowAuto>
        </div>
    );
    function newItem() {
        document.getElementById("New Stock form")?.reset();
        openCloseModal("stock form", "open");
    }
    function onSubmit(datain) {
        xaxios
            .post("/api/addnew/stock", datain, setLoad)
            .then(() => {
                refetch();
                refetchPreset();
                openCloseModal("all", "close");

                document.getElementById("New Stock form")?.reset();
            })
            .catch(() => refetch());
    }
}
