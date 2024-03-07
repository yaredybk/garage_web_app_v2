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
import BasicTable from "../../components/tables/BasicTable";
import RenderObject from "../../features/clients/RenderObject";
import NewServiceForm from "./NewServiceForm";
import TableWithSubtotal from "../../components/tables/TableWithSubtotal";
import { replacement } from "./../../components/calculator/lib/ResultPanel";
import InputContainer_v2 from "../../components/input/InputContainer_v2";

export default function EditJobTransaction({
    transactions = [],
    totalunpaid = 0,
    id,
    refetchData2 = null,
    setpopwindow = () => null,
    TableRowDataForEditing = null,
    UpdateDescription = () => null,
    addNewTransactionToJob = () => null,
}) {
    const { list1, refetchData } = useEffectStateArrayData(
        "/api/getlist/jobtransaction/" + id + "?fromjob=true"
    );
    return (
        <>
            <BasicForm
                // title={newTransactionData.category}
                formClass="  gap-2 "
                // key={newTransactionData.category}
                // onSubmit={}
                onSubmit={UpdateDescription}
            >
                <div className="hidden">
                    <label htmlFor="idtransaction">ID</label>
                    <input
                        type="number"
                        name="idtransaction"
                        id="idtransaction"
                        readOnly
                        className="px-2 w-16 bg-black text-white "
                        value={TableRowDataForEditing?.id}
                    />
                </div>
                <InputContainer_v2 title="status">{TableRowDataForEditing?.status} %</InputContainer_v2>
                <InputContainer_v2 title="total">{TableRowDataForEditing?.amount * 1} Br.</InputContainer_v2>
                <InputContainer_v2 title="description">
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="px-2 animate-ping-1 "
                        defaultValue={TableRowDataForEditing?.description}
                        // onChange={(e) =>
                        //     setTableRowDataForEditing({
                        //         ...TableRowDataForEditing,
                        //         description: e.target.value,
                        //     })
                        // }
                    />
                </InputContainer_v2>
                <br />
                <ButtonSubmit>Update</ButtonSubmit>
            </BasicForm>
            <FoldedSection>
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={list1
                        ?.filter(
                            (obj) =>
                                obj.idtransaction === TableRowDataForEditing?.id
                        )
                        ?.map((obj) => {
                            return {
                                name: obj?.name,
                                description: obj?.description,
                                amount: obj?.amount,
                            };
                        })}
                ></TableWithSubtotal>
                <ButtonSubmit onClick={appendMoreData} type="button">
                    + Append additional data
                </ButtonSubmit>
            </FoldedSection>

            {/* <BasicDialog
                onClose={() => setpopwindow(null)}
                id="new service selector2"
            > */}
            {/* </BasicDialog> */}
        </>
    );
    function appendMoreData() {
        let tmp1 = {
            service: "new service selector",
            mechanical: "new service selector",
            electrical: "new service selector",
            body: "new service selector",
            painting: "new service selector",
            inspection: "new service selector",
            replacement: "new part form",
            other: "new other form",
        };
        let tmp2 = TableRowDataForEditing?.category;
        if (!tmp2) return;
        tmp1 = tmp1[tmp2];
        openCloseModal("all", "close");
        addNewTransactionToJob(tmp1, {
            idtransaction: TableRowDataForEditing?.id,
            ...TableRowDataForEditing
        });
    }
    function refetchJobTransaction() {
        // refetch transaction data of ManageJob component
        refetchData2();
    }
}
