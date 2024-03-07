import { useContext, useEffect, useState } from "react";
import MainContainer from "../../layout/MainContainer";
import { useEffectStateArrayData } from "./../../hooks/EffectStateArrayData";
import BasicForm from "../../components/form/BasicForm";
import { GlobalState } from "../../context/GlobalContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { BreakLine2 } from "../job/ManageJob";
import TableWithSubtotal from "../../components/tables/TableWithSubtotal";
import ReportTable from "./../../components/tables/ReportTable";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import OverFlowAuto from "../../components/OverFlowAuto";
import TransactionHisTable from "../../components/tables/TransactionHisTable";
import useSearchParamsWithState from "../../hooks/useSearchParamsWithState";
import { _utilFunction } from "../../utils/_utilFunctions";
import AccountSelector from "../../utils/AccountSelector";
import AccountSelector_v2 from "../../utils/AccountSelector_v2";

export function AccountHistoryMain({ info = {}, noselector = false }) {
    const [params, setSingleParam] = useSearchParamsWithState({
        idaccount: info.idaccount,
        date: _utilFunction.dateToday(),
        range: "week",
    });
    const { list_accounts } = useContext(GlobalState);
    const [accountgroup, setaccountgroup] = useState("internal");
    const { list1, refetchData } = useEffectStateArrayData(
        `/api/getlist/transaction/history?idaccount=${params.idaccount}&date=${params.date}&range=${params.range}`
    );
    const navigate = useNavigate();
    function onInfoChange(e) {
        let { name, value } = e.target;
        if (value) setSingleParam([name, value]);
    }
    useEffect(() => {
        if (info.idaccount) {
            setSingleParam(["idaccount",info.idaccount])
            // setSingleParam({ ...params, idaccount:info.idaccount });
        }
    }, [info]);

    return (
        <>
            <BasicForm onSubmit={refetchData}>
                {!noselector && (
                    <AccountSelector_v2
                        required
                        value={params.idaccount}
                        name="idaccount"
                        id="idaccount"
                        idaccountin={params.idaccount}
                        // className=" bg-red-300"
                        accountgroupin="internal"
                        onChange={onInfoChange}
                    />
                )}
                <input
                    value={params.date}
                    onChange={onInfoChange}
                    type="date"
                    name="date"
                    id="date"
                />

                <select
                    value={params.range}
                    onChange={onInfoChange}
                    name="range"
                    id="range"
                >
                    <option value="day">day</option>
                    <option value="week">week</option>
                    <option value="month">month</option>
                </select>
                <ButtonSubmit>Fetch</ButtonSubmit>
            </BasicForm>
            <BreakLine2 />

            <OverFlowAuto>
                <TableWithSubtotal
                    subtotalColName="amount"
                    accountInfo={params}
                    rowObjectUP={handleRowClick}
                    data={list1}
                />
            </OverFlowAuto>
        </>
    );
    function handleRowClick(rowObj) {
        console.log(rowObj);
        if (rowObj.j_id) navigate("/nav/jobs/edit/" + rowObj.j_id);
    }
}

export default function AccountHistory({ info = {} }) {
    return (
        <MainContainer>
            <AccountHistoryMain info={info} />
        </MainContainer>
    );
}
// function SelectAccountCategory({ onSetState = () => null, list = [] }) {
//     return (
//         <div className="account_category grid grid-cols-4 gap-2 p-1">
//             {list.map((type, ind) => (
//                 <button
//                     key={type}
//                     onClick={() => {
//                         onSetState(type);
//                     }}
//                     type="button"
//                     className={
//                         accountgroup == type
//                             ? "bg-green-300 p-1"
//                             : "bg-gray-300 p-1"
//                     }
//                 >
//                     {type}
//                 </button>
//             ))}
//         </div>
//     );
// }
