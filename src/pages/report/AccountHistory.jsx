import { useContext, useState } from "react";
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

export default function AccountHistory() {
    const [params, setSingleParam] = useSearchParamsWithState({
        idaccount: 4,
        date: _utilFunction.today(),
        range: "week",
    });
    // console.log(params);
    const { list_accounts } = useContext(GlobalState);
    const [accountgroup, setaccountgroup] = useState("internal");
    // const [info, setInfo] = useState({
    //     idaccount: 4,
    //     date: date,
    //     range: "week",
    // });
    const { list1, refetchData } = useEffectStateArrayData(
        `/api/getlist/transaction/history?idaccount=${params.idaccount}&date=${params.date}&range=${params.range}`
    );
    const usepp = useParams();
    // console.log(usepp);
    const usespp = useSearchParams();
    // console.log(usespp);
    const navigate = useNavigate();
    function onInfoChange(e) {
        let { name, value } = e.target;
        setSingleParam([name, value]);
        // setInfo({ ...info, [name]: value });
    }
    return (
        <MainContainer>
            <BasicForm onSubmit={refetchData}>
                <AccountSelector
                    required
                    value={params.idaccount}
                    name="idaccount"
                    id="idaccount"
                    // className=" bg-red-300"
                    accountgroupin="internal"
                    onChange={onInfoChange}
                    />

                <BreakLine2 />

                    <h2>{list_accounts?.filter((ele)=>ele.idaccount==params.idaccount)?.map((ele2)=>
                        ele2?.name 
                        )}</h2>
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
        </MainContainer>
    );
    function handleRowClick(rowObj) {
        console.log(rowObj);
        if (rowObj.j_id) navigate("/nav/job/" + rowObj.j_id);
    }
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
