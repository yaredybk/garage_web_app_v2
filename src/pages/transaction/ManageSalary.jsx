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

export default function ManageSalary({ list_accounts }) {
    const employeeBalance = useEffectStateArrayData(
        "/api/getlist/transaction/employees_balance"
    );
    const [EmployeeInfo, setEmployeeInfo] = useState(undefined);
    const { setLoad } = useContext(LoadingState);
    const [localstate, Localstate] = useState({ salarytype: "week" });
    const list_stage = [{ name: "select salary type" }, { name: "select " }];
    const [stageNO, setStageNO] = useState(0);
    const list_salarytype = ["week"];
    let list_accounts_collect = [];
    let list_donorAccounts = [];
    let list_weeksalaryaccounts = [];
    let collectorNet = 0;
    let salaryWeekNet = 0;
    let donorCount = 0;
    list_accounts.forEach((element) => {
        if (element.salarytype == "collect") {
            const { idaccount, name, role, salary } = element;
            collectorNet += Number(salary);
            list_accounts_collect.push({ idaccount, name, role, salary });
        }
    });
    list_accounts.forEach((element) => {
        if (element.salarytype == "percent") {
            donorCount++;
            const { idaccount, name, role, percent } = element;
            list_donorAccounts.push({ idaccount, name, role, percent });
        }
    });
    list_accounts.forEach((element) => {
        if (element.salarytype == "week" || element.salarytype == "collect") {
            const { idaccount, name, role, salary } = element;
            salaryWeekNet += Number(salary);
            list_weeksalaryaccounts.push({
                idaccount,
                name,
                role,
                amount: salary,
            });
        }
    });
    list_donorAccounts = list_donorAccounts.map((ele) => ({
        ...ele,
        amount: collectorNet / (2 * donorCount),
    }));
    // list_donorAccounts.push({
    //     idaccount: 2,
    //     name: "garage",
    //     role: "garage",
    //     percent: 0,
    //     amount: collectorNet / 2,
    // });
    const stageComponents = {
        0: (
            <InputContainer htmlFor="salarytype">
                <select name="salarytype" id="salarytype">
                    {list_salarytype.map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
            </InputContainer>
        ),
        1: (
            <div className=" outline outline-2 outline-gray-400">
                <h2 className="   px-2">Assistant Employees List</h2>
                <span className="flex">
                    <TableWithSubtotal
                        subtotalColName="salary"
                        data={list_accounts_collect}
                    />
                </span>
                <h2>NET: {collectorNet}</h2>
            </div>
        ),
        2: (
            <div className=" outline outline-2 outline-gray-400">
                <h2 className="   px-2">Donor accounts</h2>
                <b>From Employees</b>

                <span className="flex">
                    <TableWithSubtotal
                        subtotalColName="amount"
                        data={list_donorAccounts}
                    />
                </span>
                <b>From Garage = {collectorNet / 2} birr</b>
            </div>
        ),
        3: (
            <div className=" outline outline-2 outline-gray-400">
                <h2 className="px-2">Employee Salary List</h2>
                <span className="flex">
                    <TableWithSubtotal
                        subtotalColName="amount"
                        data={list_weeksalaryaccounts}
                    />
                </span>
                <h2>NET Salary: {salaryWeekNet}</h2>
            </div>
        ),
        4: (
            <div className=" outline outline-2 outline-gray-400">
                <h2 className="px-2 ">
                    Employee Balance &nbsp;
                    <IconSmall
                        title="click on the table below to pay salary for each employee"
                        src="/public/images/info.png"
                    />
                </h2>
                <span className="flex">
                    <TableWithSubtotal
                        rowObjectUP={openEmployeeBlance}
                        subtotalColName="balance"
                        data={employeeBalance.list1}
                    />
                </span>
            </div>
        ),
    };
    const stageButtons = {
        0: (
            <div className="flex gap-2  pl-5">
                {/* <button> previos </button> */}
                <ButtonSubmit onClick={() => nextStage("next")}>
                    next
                </ButtonSubmit>
            </div>
        ),
        1: (
            <div className="flex gap-2  pl-5">
                {/* <button> previos </button> */}
                <ButtonSubmit onClick={() => nextStage("next")}>
                    next
                </ButtonSubmit>
            </div>
        ),
        2: (
            <div className=" flex gap-2 pl-5">
                <ButtonSubmitRed onClick={donateToCollectorAccounts}>
                    Transact {collectorNet / 2} birr to garage
                </ButtonSubmitRed>
                <ButtonSubmit onClick={() => nextStage("next")}>
                    skip
                </ButtonSubmit>
            </div>
        ),
        3: (
            <div className=" flex gap-2 pl-5">
                <ButtonSubmitRed
                    className=" animate-ping-1"
                    onClick={paySalary}
                >
                    Transact {salaryWeekNet} birr from garage To Employees
                </ButtonSubmitRed>
                <ButtonSubmit
                    onClick={() => {
                        nextStage("next");
                        employeeBalance.refetchData();
                    }}
                >
                    skip
                </ButtonSubmit>
            </div>
        ),
        4: (
            <div className=" flex gap-2 pl-5">
                <ButtonSubmitRed
                    // className=" animate-ping-1"
                    onClick={() => employeeBalance.refetchData()}
                >
                    refetch balance
                </ButtonSubmitRed>
            </div>
        ),
        // 3:(

        // )
    };
    function openEmployeeBlance(employee) {
        setEmployeeInfo(employee);
        openCloseModal("employee salary", "open");
    }
    function donateToCollectorAccounts() {
        const ans = confirm(`transfer ${collectorNet / 2} birr to garage`);
        if (ans)
            sendTransactionData({
                action: "donateToCollectorAccounts",
                list_donorAccounts,
                amount: collectorNet / 2,
            });
    }
    function paySalary() {
        const ans = confirm(`transfer ${salaryWeekNet} birr from garage`);
        if (ans)
            sendTransactionData({
                action: "paySalaryWeek",
                list_donorAccounts: list_weeksalaryaccounts,
                amount: salaryWeekNet,
            });
    }
    function sendTransactionData(datain) {
        // datain.account = datain?.account?.name;
        // console.dir(newTransactionData);
        // return;
        setLoad(true);
        let url1 = "/api/transaction/salary";
        xaxios
            .post(url1, { ...datain })
            .then((res) => {
                setStageNO(stageNO + 1);
                if (datain?.action == "paySalaryWeek")
                    employeeBalance.refetchData();
            })
            .finally(() => {
                setLoad(false);
            });
    }
    function RenderStateges() {
        return [...Array(stageNO + 1).keys()].map((num) => (
            <div key={"stage" + num}>{stageComponents[num]}</div>
        ));
    }
    function RenderButtons() {
        return <div>{stageButtons[stageNO]}</div>;
    }
    // const assistantSalary = useEffectStateArrayData(
    //     "/api/transaction/history_assistants"
    // );
    function _paySalaryToEmployee(acc) {
        xaxios
            .post("/api/transaction/salary", {
                acc,
                action: "paysalary",
                idaccount: acc?.fromidaccount,
                amount: acc?.balance,
            })
            .then(() => {
                employeeBalance.refetchData();
                openCloseModal("employee salary", "close");
            });
    }
    return (
        <div id="Manage salary" className=" px-3">
            {RenderStateges()}
            <div className="bg-orange-300 flex items-center gap-2 bold -mx-2 my-1 p-4 ">
                <b>stage {stageNO}</b>
                {RenderButtons()}
            </div>
            <BasicDialog id="employee salary">
                <PayEmployeeWindow
                    key={EmployeeInfo?.name}
                    EmployeeInfoin={EmployeeInfo}
                    _paySalaryToEmployee={_paySalaryToEmployee}
                />
            </BasicDialog>
        </div>
    );

    function nextStage(dir) {
        if (dir == "next") {
            setStageNO(stageNO + 1);
        }
    }
}
function PayEmployeeWindow({
    EmployeeInfoin,
    _paySalaryToEmployee = () => null,
}) {
    const { list_accounts } = useContext(GlobalState);
    const [EmployeeInfo, setEmployeeInfo] = useState({ ...EmployeeInfoin });
    return (
        <div className="grid grid-cols-2">
            <RenderObject obj={EmployeeInfo} />
            <div className="grid p-2 gap-4 bg-orange-200">
                <b>Pay {EmployeeInfo?.name}</b>
                <b>{-EmployeeInfo?.balance} birr</b>
                <input
                    type="number"
                    name="balance"
                    id="balance"
                    value={-EmployeeInfo?.balance}
                    onChange={(e) => {
                        setEmployeeInfo({
                            ...EmployeeInfo,
                            balance: -e.target.value,
                        });
                    }}
                />
                <div className="grid grid-cols-2 gap-2 h-fit">
                    {list_accounts
                        ?.filter(
                            (ele) =>
                                ele.name == "admin" || ele.name == "secretary"
                        )
                        ?.map((acc, ind) => (
                            <button
                                className="bg-green-500 hover:bg-red-900 hover:text-white border-none px-4 py-6 p-0  overflow-hidden flex rounded-sm"
                                type="button"
                                name={acc?.name}
                                onChange={() => null}
                                onClick={() => {
                                    const ans = confirm(
                                        `Pay ${
                                            EmployeeInfo?.name
                                        } ${-EmployeeInfo?.balance} From ${
                                            acc?.name
                                        } ?`
                                    );
                                    if (ans)
                                        _paySalaryToEmployee({
                                            ...EmployeeInfo,
                                            balance: -Number(
                                                EmployeeInfo?.balance
                                            ),
                                            fromidaccount: acc?.idaccount,
                                        });
                                }}
                                key={ind}
                            >
                                {acc?.name}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}
