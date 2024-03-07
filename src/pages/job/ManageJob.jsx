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
import { Link, useParams } from "react-router-dom";
import BasicForm from "../../components/form/BasicForm";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import xaxios from "../../utils/xaxios";
import FoldedSection from "../../components/FoldedSection";
import BasicDialog from "../../components/dialog/BasicDialog";
import { openCloseModal } from "../../utils/userInterface";
import InputContainer from "../../components/input/InputContainer";
import { LoadingState } from "../../context/LoadingContext";
import TableWithSubtotal from "../../components/tables/TableWithSubtotal";
import {
    extractBalanceSubnetByIdaccount,
    shareBalanceToAccounts,
} from "./jonFunctions.js";
import NewServiceForm from "./NewServiceForm";
import NewPartForm from "./NewPartForm";
import NewOthersForm from "./NewOthersForm";
import NewHiddenForm from "./NewHiddenForm";
import NewPaymentForm from "./NewPaymentForm";
import RenderObject from "../../features/clients/RenderObject";
import AdvancedForm from "../../components/form/AdvancedForm";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import RenderClient2 from "../../features/clients/RenderClient2";
import IconSmall from "../../components/IconSmall";
import EditJobTransaction from "./EditJobTransaction";
import CardPlateNo_v1 from "../../layout/CardPlateNo_v1";
import CardInfoLink2_v1 from "../../layout/CardInfoLink2_v1";
import BasicTable from "../../components/tables/BasicTable";
import ButtonGreen from "../../components/button/ButtonGreen";
import AccountSelector_v2 from "../../utils/AccountSelector_v2";
import ButtonSubmit_v2 from "../../components/button/ButtonSubmit_v2";
export default function ManageJob() {
    const { id } = useParams();
    const { load, setLoad } = useContext(LoadingState);
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: "",
        amount: "",
        reason: "",
        method: "",
        description: "",
        category: "",
        idjob: id,
        percent: 0,
        accountInfoShared: "",
    });
    const [TableRowDataForEditing, setTableRowDataForEditing] = useState({});
    const [jobTransactionUnfiltered, setJobTransactionUnfiltered] = useState(
        []
    );
    const [jobTransactionsFiltered, setJobTransactionsFiltered] = useState([]);
    const [jobReplacementFiltered, setJobReplacementFiltered] = useState([]);
    const [jobOthersFiltered, setJobOthersFiltered] = useState([]);
    const [jobHiddenFiltered, setJobHiddenFiltered] = useState([]);
    const [jobNoteFiltered, setJobNoteFiltered] = useState([]);
    const [sharingOrder, setSharingOrder] = useState({
        order: null,
        accounts: null,
    });
    const [total, setTotal] = useState(0);
    const [totalpaid, setTotalpaid] = useState(0);
    const [popwindow, setpopwindow] = useState(null);
    const [jobinfo, setJobinfo] = useState({
        idcar: null,
        idjob: null,
        idclient: null,
        car: {},
        client: {},
        odo: null,
        created: null,
        finished: null,
        total: null,
        unpaid: null,
        duedate: null,
    });
    function refetchJobInfo() {
        xaxios.GetData(`/api/getsingle/job/${id}`, setLoad).then((data) => {
            if (data && data.length) {
                setJobinfo({ ...jobinfo, ...data[0] });
                if (data[0].notes) setJobNoteFiltered(data[0]?.notes);
            }
        });
    }
    let tmpnet = 0;
    let tmpnetunpaid = 0;
    function getjobTransactions() {
        xaxios
            .GetData("/api/getlist/jobtransaction/" + id, setLoad)
            .then((data) => {
                filterJobTransactions(data);
            });
    }
    function filterJobTransactions(listin) {
        if (!listin) return console.log("undefined list");
        if (!Array.isArray(listin)) return console.log("no transaction list");
        if (listin.length == 0) {
            setJobTransactionsFiltered([]);
            setJobReplacementFiltered([]);
            setJobOthersFiltered([]);
            setJobHiddenFiltered([]);

            setTotal(0);
            setTotalpaid(0);
            return;
        }
        // setJobTransactionsFiltered(listin);
        tmpnet = 0;
        tmpnetunpaid = 0;
        let builder = {
            mechanical: {
                groupname: "service",
                cols: ["id", "description", "amount"],
            },
            electrical: {
                groupname: "service",
                cols: ["id", "description", "amount"],
            },
            body: {
                groupname: "service",
                cols: ["id", "description", "amount"],
            },
            painting: {
                groupname: "service",
                cols: ["id", "description", "amount"],
            },
            inspection: {
                groupname: "service",
                cols: ["id", "description", "amount"],
            },
            replacement: {
                groupname: "replacement",
                cols: ["id", "description", "name", "amount"],
            },
            other: {
                groupname: "other",
                cols: ["id", "description", "name", "amount"],
            },
            hidden: {
                groupname: "hidden",
                cols: [
                    "id",
                    "description",
                    "reason",
                    "method",
                    "amount",
                    "name",
                ],
            },
        };
        let keys = Object.keys(builder).map((key) => key);
        let tmp2 = {};
        listin.forEach((obj) => {
            let key = obj.category;
            let cols = builder[key].cols;
            key = builder[key].groupname;
            if (obj.reason === "tojob" || obj.reason === "service")
                tmpnet += Number(obj.amount);
            else if (obj.reason == "fromjob") {
                tmpnetunpaid += Number(obj.amount);
            }
            let tmpobj = {};
            cols?.forEach((key) => {
                tmpobj[key] = obj[key];
            });
            if (keys.includes(obj.category)) {
                if (tmp2[key]) tmp2[key].push(obj);
                else tmp2[key] = [obj];
            }
        });
        setJobTransactionUnfiltered(listin);
        setJobTransactionsFiltered(tmp2?.service ? tmp2?.service : []);
        setJobReplacementFiltered(tmp2?.replacement ? tmp2?.replacement : []);
        setJobOthersFiltered(tmp2?.other ? tmp2?.other : []);
        setJobHiddenFiltered(tmp2?.hidden ? tmp2?.hidden : []);

        setTotal(tmpnet);
        setTotalpaid(tmpnetunpaid);
    }
    useEffect(() => {
        xaxios
            .GetData(`/api/getsingle/jobinfo_full/${id}`, setLoad)
            .then((data) => {
                let fulljj = data.full_jobinfo;
                if (!fulljj) return console.log("no full job info");
                const {
                    job = {},
                    jobtransactions = [],
                    car = {},
                    client = {},
                } = fulljj;
                setJobinfo({ ...job, car, client });
                if (job.notes) setJobNoteFiltered(job.notes);
                filterJobTransactions(jobtransactions);
            });
    }, []);

    function sendTransactionData(datain) {
        setLoad(true);
        let { amount, description, items, index } = datain;

        let url1 =
            datain.reason === "fromjob"
                ? "/api/transaction/getfromjob"
                : "/api/transaction/addtojob";
        xaxios
            .post(url1, { ...datain, sharingOrder })
            .then((res) => {
                getjobTransactions();
                datain.reason === "fromjob" && refetchJobInfo();
                openCloseModal("all", "close");
            })
            .finally(() => {
                setLoad(false);
                setNewTransactionData({
                    ...newTransactionData,
                    description: "",
                });
            });
    }

    function addNewTransactionFromJob(key) {
        setpopwindow("new payment form");
        openCloseModal("new payment form", "open");
    }

    function addNewTransactionToJob(key, rowinforediting) {
        setpopwindow(key);
        let newObj = tojobCategory_FunctionConstructor[key];
        if (newObj) {
            newObj.idjob = id;
            // setaccountgroup("internal");
            setNewTransactionData({ ...newTransactionData, ...newObj });
        }
        setTableRowDataForEditing(rowinforediting);
        // #fix-me
        // console.log("addNewTransactionToJob");
        openCloseModal(key, "open");
    }

    function complete_Job() {
        let ans = window.confirm("complete job?");
        if (ans)
            xaxios
                .post("/api/update/job/complete", { idjob: id }, setLoad)
                .then((res) => {
                    refetchJobInfo();
                });
    }
    const cardinfolink2_v1props = {
        to: `/nav/cars/${jobinfo.car.idcar}`,
        info: {
            h1: jobinfo.car.make,
            h12: jobinfo.car.model,
            pre: "V",
            h2: jobinfo.car.idcar,
            // h3: jobinfo.car.idclient,
            h3: jobinfo.car.name,
            h4: jobinfo.car.phoneno,
        },
        imgProp: {
            style: { height: "8rem" },
            link: `/files/image/cars/${jobinfo.car.make || "-"}/${
                jobinfo.car.model || "-"
            }.webp`,
        },
        fmid: <CardPlateNo_v1 plate={jobinfo.car} />,
    };
    return (
        <main className="managejobs  ">
            <div className="  printgrid  p-1  px-1 min-[1024px]:px-4  grid  grid-cols-[min-content,auto] max-md:grid-cols-1  max-w-[24cm] print:grid-cols-[min-content,auto] mx-auto  ">
                <details
                    open
                    className="  mb-4 job_info bg-blue-100 bg-opacity-90  print:bg-transparent 2  col-span-full "
                >
                    <summary className=" p-1 bg-blue-400 tracking-widest text-white font-bold text-sm ">
                        Job details
                        <b className=" px-2 ">( Job ID: {id} )</b>
                    </summary>
                    <div className=" flex flex-wrap items-center justify-around gap-2 max-sm:gap-0 col-span-full">
                        <div className="  px-1 max-sm:px-0 grid  ">
                            <span
                                readOnly
                                className="   p-2 border-gray-500 border-solid border-[1px]   "
                            >
                                {jobinfo.odo || "-"} km
                            </span>
                            <input
                                type="date"
                                readOnly
                                className=" w-28"
                                value={jobinfo.created || ""}
                                name="created"
                                id="created"
                            />
                            {jobinfo?.finished ? (
                                <input
                                    type="date"
                                    readOnly
                                    className=" w-28"
                                    value={jobinfo?.finished}
                                    name="completed"
                                    id="completed"
                                />
                            ) : (
                                <ButtonSubmit
                                    disabled={jobinfo?.finished}
                                    onClick={complete_Job}
                                    className=" bg-orange-500 rounded-t-none "
                                >
                                    <IconSmall src="/public/images/doneall.svg" />
                                </ButtonSubmit>
                            )}
                        </div>
                        <CardInfoLink2_v1 {...cardinfolink2_v1props} />
                        {jobinfo.car.idclient != jobinfo.idclient && (
                            <RenderClient2
                                clientobj={jobinfo.client || jobinfo.car}
                            />
                        )}
                    </div>
                </details>
                <div className="printhidden grid ">
                    <AddNewButton title="note" modal="NOTE EDITOR" />
                </div>
                <div className="printhidden grid">
                    <TableWithSubtotal
                        colsin={["description", "amount"]}
                        nodatamessage="no notes"
                        // key={JSON.stringify(jobNoteFiltered)}
                        subtotalColName="amount"
                        data={jobNoteFiltered}
                        rowObjectUP={(obj, ind) => {
                            setNewTransactionData({ ...obj, index: ind });
                            openCloseModal("NOTE");
                            // openCloseModal("NOTE EDITOR");
                        }}
                    />
                </div>
                <div className="grid h-2 col-span-full"></div>
                <AddNewButton title={"service"} modal="new service selector" />
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={jobTransactionsFiltered}
                    rowObjectUP={(row) =>
                        manageTableEntry(
                            row,
                            "service",
                            jobTransactionsFiltered
                        )
                    }
                    colsin={["description", "amount", "name"]}
                />
                <div className="grid h-2 col-span-full"></div>
                <AddNewButton title={"part"} modal="new part form" />
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={jobReplacementFiltered}
                    rowObjectUP={(row) =>
                        manageTableEntry(row, "part", jobReplacementFiltered)
                    }
                    colsin={["description", "amount", "name"]}
                />
                <div className="grid h-2 col-span-full"></div>
                <AddNewButton title={"other"} modal={"new other form"} />
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={jobOthersFiltered}
                    rowObjectUP={(row) =>
                        manageTableEntry(row, "other", jobOthersFiltered)
                    }
                    colsin={["description", "amount", "items"]}
                />
                <div className="grid h-2 col-span-full"></div>
                <FoldedSection
                    className=" relative print:hidden col-span-full"
                    title={
                        <>
                            <b>HIDDEN</b>
                            <button
                                onClick={() =>
                                    addNewTransactionToJob("new hidden form")
                                }
                                className=" absolute inline-block place-items-center px-4 p-0 m-0 right-20  bg-lime-200 print:hidden"
                                title="add new hidden"
                            >
                                <img
                                    className=" w-6 m-0 p-0"
                                    src="/public/images/add.svg"
                                />
                            </button>
                        </>
                    }
                >
                    <TableWithSubtotal
                        subtotalColName="amount"
                        data={jobHiddenFiltered}
                        rowObjectUP={(row) =>
                            manageTableEntry(row, "hidden", jobHiddenFiltered)
                        }
                        colsin={["description", "amount", "reason"]}
                    />
                </FoldedSection>
                <div className="grid h-2 col-span-full"></div>
                <div className="PAYMENT grid grid-cols-2 print:grid-cols-1 print:ml-auto col-span-full bg-emerald-200">
                    <div
                        className={
                            total - totalpaid > 0
                                ? "totalpaid bg-red-300 border print:hidden border-solid text-center  font-bold text-xl   "
                                : "totalpaid border print:hidden border-solid text-center  font-bold text-xl   "
                        }
                    >
                        paid: {totalpaid} birr
                    </div>
                    <div className="total border border-solid text-center  font-bold text-xl   ">
                        NET: {total} birr
                    </div>
                </div>
            </div>
            <div id="alldialogs">
                <BasicDialog
                    containerClass="flex gap-2 flex-wrap"
                    onClose={() => setpopwindow(null)}
                    id="NOTE"
                >
                    <ButtonSubmit_v2
                        onClick={() =>
                            openCloseModal("NOTE EDITOR", "closeopen", "NOTE")
                        }
                        imgProps={{ src: "/public/images/edit.svg" }}
                    >
                        EDIT
                    </ButtonSubmit_v2>
                    <ButtonSubmit_v2
                        onClick={() =>{
                            setTableRowDataForEditing(newTransactionData);
                            setpopwindow("new service selector")
                            openCloseModal("new service selector", "closeopen", "NOTE")}
                        }
                        imgProps={{ src: "/public/images/move_item_FILL0_wght400_GRAD0_opsz24.svg" }}
                    >
                        MOVE
                    </ButtonSubmit_v2>
                    <ButtonSubmit_v2
                        imgProps={{ src: "/public/images/delete.svg" }}
                        className=" bg-red-500"
                        onClick={() => {
                            let url1 = `/api/transaction/v2/jobnote/${jobinfo.idjob}?NOTE`;
                            xaxios
                                .post(url1, {
                                    method: "DELETE",
                                    notes: jobinfo.notes,
                                    note: jobinfo.notes[
                                        newTransactionData.index
                                    ],
                                    index: newTransactionData.index,
                                })
                                .then((res) => {
                                    refetchJobInfo();
                                    setNotes([]);
                                    setNewTransactionData({});
                                    openCloseModal("all", "close");
                                })
                                .catch(console.log)
                                .finally(() => {
                                    setLoad(false);
                                    openCloseModal("all", "close");
                                });
                        }}
                    >
                        DELETE
                    </ButtonSubmit_v2>
                </BasicDialog>
                <BasicDialog
                    onClose={() => setpopwindow(null)}
                    id="new service selector"
                >
                    {popwindow == "new service selector" && (
                        <NewServiceForm
                            datain={TableRowDataForEditing}
                            id={id}
                            refetchData={getjobTransactions}
                            setpopwindow={setpopwindow}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    withcalc
                    onClose={() => setpopwindow(null)}
                    id="new part form"
                >
                    {popwindow == "new part form" && (
                        <NewPartForm
                            id={id}
                            refetchData={getjobTransactions}
                            setpopwindow={setpopwindow}
                            datain={TableRowDataForEditing}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => setpopwindow(null)}
                    id="new other form"
                >
                    {popwindow == "new other form" && (
                        <NewOthersForm
                            datain={TableRowDataForEditing}
                            id={id}
                            refetchData={getjobTransactions}
                            setpopwindow={setpopwindow}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => setpopwindow(null)}
                    id="new hidden form"
                >
                    {popwindow == "new hidden form" && (
                        <NewHiddenForm
                            datain={TableRowDataForEditing}
                            id={id}
                            refetchData={getjobTransactions}
                            setpopwindow={setpopwindow}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => setpopwindow(null)}
                    id="new payment form"
                >
                    {popwindow == "new payment form" && (
                        <NewPaymentForm
                            transactions={jobTransactionsFiltered}
                            totalunpaid={total - totalpaid}
                            id={id}
                            refetchData2={() => {
                                refetchJobInfo();
                                getjobTransactions();
                            }}
                            setpopwindow={setpopwindow}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => {
                        setpopwindow(null);
                        setTableRowDataForEditing(null);
                    }}
                    id="description editor"
                >
                    {popwindow === "description editor" && (
                        <DescriptionEditor
                            key={JSON.stringify(TableRowDataForEditing)}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => {
                        setpopwindow(null);
                        setTableRowDataForEditing(null);
                    }}
                    id="transaction editor"
                >
                    {popwindow === "transaction editor" && (
                        <EditJobTransaction
                            addNewTransactionToJob={addNewTransactionToJob}
                            refetchData2={getjobTransactions}
                            id={id}
                            TableRowDataForEditing={TableRowDataForEditing}
                            UpdateDescription={UpdateDescription}
                            key={JSON.stringify(TableRowDataForEditing)}
                        />
                    )}
                </BasicDialog>
                <BasicDialog
                    onClose={() => {
                        setpopwindow(null);
                        setTableRowDataForEditing(null);
                    }}
                    id="job info"
                >
                    <FoldedSection>
                        <RenderObject
                            obj={{
                                idjob: jobinfo?.idjob,
                                idcar: jobinfo?.idcar,
                                idclient: jobinfo?.idclient,
                                odo: jobinfo?.odo,
                                created: jobinfo?.created,
                                finished: jobinfo?.finished,
                                idreport: jobinfo?.idreport,
                                notes: jobinfo?.notes,
                            }}
                        />
                    </FoldedSection>
                    <AdvancedForm
                        onSubmit={updateJobInfo}
                        formClass=" grid gap-2 "
                        action="update"
                        fields={[
                            {
                                title: "idjob",
                                type: "number",
                                readOnly: true,
                                defaultValue: id,
                            },
                            {
                                title: "odo",
                                type: "text",
                                defaultValue: jobinfo?.odo,
                            },
                        ]}
                    ></AdvancedForm>
                </BasicDialog>
                <NotesEditor
                    newTransactionDatain={newTransactionData}
                    refetchJobInfo={refetchJobInfo}
                    idjob={jobinfo.idjob}
                />
            </div>
            <br />
            <div className="allbuttons print:hidden bg-green-200 mt-2   p-4 max-md:p-1 max-sm:grid-cols-2 grid grid-cols-4 gap-1 ">
                <button
                    style={{ "--btn-bg": "orange" }}
                    onClick={() => {
                        addNewTransactionFromJob("new payment form");
                        setSharingOrder({ order: null, accounts: null });
                    }}
                    className="  basis-40a flex-grow  max-w-xs ttext-yellow-700   "
                >
                    <IconSmall src="/public/images/transaction.png" />
                    full payment
                </button>
                <ButtonSubmit
                    style={{ "--btn-bg": "green" }}
                    className=" basis-40a flex-grow  max-w-xs text-white"
                    onClick={() => {
                        openCloseModal("job info", "open");
                    }}
                >
                    <IconSmall src="/public/images/edit.svg" />
                    edit info
                </ButtonSubmit>
                <ButtonSubmit
                    style={{ "--btn-bg": "orange" }}
                    disabled={jobinfo?.finished}
                    onClick={() =>
                        xaxios
                            .post(
                                "/api/update/job/complete",
                                { idjob: id },
                                setLoad
                            )
                            .then((res) => {
                                refetchJobInfo();
                            })
                    }
                    className="  basis-40a flex-grow  max-w-xs ttext-orange-700 "
                >
                    <IconSmall src="/public/images/doneall.svg" />
                    complete JOB
                </ButtonSubmit>
                <button
                    style={{ "--btn-bg": "greenyellow" }}
                    onClick={() => window.print()}
                    className="  basis-40a flex-grow  max-w-xs ttext-orange-700 "
                >
                    <IconSmall src="/public/images/print.svg" />
                    print
                </button>
                <button
                    style={{ "--btn-bg": "greenyellow" }}
                    disabled={load}
                    className="    basis-40a flex-grow  max-w-xs ttext-green-700  "
                    onClick={() => {
                        getjobTransactions();
                    }}
                >
                    <IconSmall
                        className={load ? " animate-spin" : " "}
                        src="/public/images/refresh.svg"
                        alt="refresh"
                    />
                    refresh
                </button>
                <Link
                    style={{ "--btn-bg": "greenyellow" }}
                    role="button"
                    to={`/nav/check-in/${id}`}
                    className="  basis-40a flex-grow  max-w-xs ttext-green-700 "
                >
                    go to checkin
                </Link>
                <ButtonSubmit
                    style={{ "--btn-bg": "red" }}
                    className="   basis-40a flex-grow  max-w-xs ttext-green-700    "
                    onClick={sendJobToAdmin}
                >
                    send to Admin
                </ButtonSubmit>
            </div>
        </main>
    );
    function sendJobToAdmin() {
        xaxios.post("/api/notification/sendtoadmin?", { dataType: "job", id });
    }
    function manageTableEntry(rowin, categoryin, tableDatain) {
        if (!(rowin && categoryin && tableDatain)) return;
        // console.log(rowin);
        rowin = jobTransactionUnfiltered.find((ele) => ele?.id == rowin.id);
        // console.log(rowin);
        // store row in data
        // setTableRowDataForEditing(rowin);
        // setpopwindow("transaction editor");
        addNewTransactionToJob("transaction editor", rowin);
    }
    function UpdateDescription(data) {
        xaxios
            .post("/api/update/description/transactions", data)
            .then(() => {
                getjobTransactions();
                openCloseModal("all", "close");
                setpopwindow(null);
            })
            .catch(console.warn);
    }
    function DescriptionEditor() {
        return TableRowDataForEditing?.id ? (
            <BasicForm onSubmit={UpdateDescription}>
                <div className=" grid gap-2 grid-cols-2">
                    <span className=" mx-auto">
                        <label htmlFor="idtransaction">ID</label>
                        &nbsp;
                        <input
                            type="number"
                            name="idtransaction"
                            id="idtransaction"
                            readOnly
                            className="p-2 w-16"
                            value={TableRowDataForEditing?.id}
                        />
                    </span>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="p-2"
                        defaultValue={TableRowDataForEditing?.description}
                        // onChange={(e) =>
                        //     setTableRowDataForEditing({
                        //         ...TableRowDataForEditing,
                        //         description: e.target.value,
                        //     })
                        // }
                    />
                    <ButtonSubmit>Update</ButtonSubmit>
                    <FoldedSection>
                        <RenderObject obj={TableRowDataForEditing} />
                    </FoldedSection>
                </div>
            </BasicForm>
        ) : (
            <>
                <AdvancedForm
                    action="update"
                    formClass=" grid  gap-2  place-items-center"
                    onSubmit={sendTransactionData}
                    fields={TableRowDataForEditing}
                />
                <ButtonSubmitRed
                    onClick={() => {
                        sendTransactionData({
                            reason: "note",
                            delete: true,
                            index: TableRowDataForEditing[0]?.defaultValue,
                        });
                    }}
                >
                    delete note
                </ButtonSubmitRed>
            </>
        );
    }
    function AddNewButton({ title, modal }) {
        return (
            <div className="   flex-shrink-0 flex-grow w-full max-md:flex-row flex-col justify-around flex  border-solid border-0 border-t-2  border-slate-300">
                <b className=" capitalize text-center min-w-[8rem]">{title}s</b>
                <button
                    onClick={() => addNewTransactionToJob(modal)}
                    title="add new others"
                    className=" place-items-center  max-w-[8rem] max-h-16   px-4 p-0 m-0 bg-lime-200 print:hidden"
                >
                    <img className=" w-6" src="/public/images/add.svg" />
                </button>
            </div>
        );
    }
    function updateJobInfo(datain) {
        xaxios.post("/api/update/job", { ...datain }).finally(() => {
            refetchJobInfo();
            openCloseModal("all", "close");
        });
    }
}
export function BreakLine2({ children }) {
    return (
        <div className="  flex-shrink-0 flex-grow w-full max-md:flex-row flex-col justify-around flex  border-solid border-0 border-t-2  border-slate-300">
            {children}
        </div>
    );
}

function NotesEditor({
    newTransactionDatain = {
        idaccount: "",
        amount: "",
        reason: "",
        method: "",
        description: "",
        category: "",
        idjob: id,
        percent: 0,
        accountInfoShared: "",
    },
    refetchJobInfo = () => null,
    idjob = 0,
}) {
    const { load, setLoad } = useContext(LoadingState);
    const [newTransactionData, setNewTransactionData] =
        useState(newTransactionDatain);
    useEffect(() => {
        setNewTransactionData(newTransactionDatain);
        if (newTransactionDatain.description) setNotes([]);
    }, [newTransactionDatain]);
    const [notes, setNotes] = useState([]);

    return (
        <BasicDialog id="NOTE EDITOR">
            <BasicForm formClass=" grid gap-2 " onSubmit={addItem}>
                <BasicTable data={notes} indexClicked={removeItem} />
                <div className="grid grid-cols-3 gap-2">
                    <ButtonSubmitRed
                        disabled={
                            !(notes.length || newTransactionData.description)
                        }
                        type="button"
                        name="+"
                        onClick={removeItem}
                    >
                        <IconSmall src="/public/images/delete.svg" />
                    </ButtonSubmitRed>
                    <ButtonGreen name="+">
                        <IconSmall src="/public/images/plus.svg" />
                    </ButtonGreen>
                    <ButtonGreen
                        type="button"
                        onClick={sendNoteData}
                        name="upload"
                    >
                        <IconSmall src="/public/images/doneall.svg" />
                    </ButtonGreen>
                </div>
                <AccountSelector_v2
                    id="idselector"
                    idaccountin={newTransactionData.idaccount}
                    onChange={(e) => {
                        setNewTransactionData({
                            ...newTransactionData,
                            idaccount: e.target.value,
                        });
                    }}
                    value={newTransactionData.idaccount}
                />
                <div className="flex gap-0">
                    <InputContainer title="#" htmlFor="items">
                        <input
                            autoComplete="off"
                            type="number"
                            className="w-10"
                            name="items"
                            id="items"
                            value={newTransactionData.items || ""}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    items: e.target.value,
                                });
                            }}
                        />
                    </InputContainer>
                    <InputContainer title="$" htmlFor="amount">
                        <input
                            className="w-auto min-w-10 max-w-20"
                            type="number"
                            autoComplete="off"
                            name="amount"
                            id="amount"
                            value={newTransactionData.amount || ""}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    amount: e.target.value,
                                });
                            }}
                        />
                    </InputContainer>

                    <InputContainer
                        className=" col-span-2"
                        htmlFor="description"
                    >
                        <input
                            type="text"
                            value={newTransactionData.description || ""}
                            onChange={(e) => {
                                setNewTransactionData({
                                    ...newTransactionData,
                                    description: e.target.value,
                                });
                            }}
                            required
                            pattern="[^']*"
                            name="description"
                            id="description"
                        ></input>
                    </InputContainer>
                </div>
            </BasicForm>
        </BasicDialog>
    );
    function focusOnDesc() {
        document.getElementById("description")?.focus();
    }
    function sendNoteData() {
        setLoad(true);
        let { description, items, amount } = newTransactionData;
        let newnotes = notes;
        if (newTransactionData.description)
            newnotes.push({ items, amount, description });
        let url1 = `/api/transaction/v2/jobnote/${idjob}?NOTE`;
        setNewTransactionData({});
        xaxios
            .post(url1, {
                notes: newnotes,
                method: newTransactionDatain.index && "UPDATE",
                index: newTransactionDatain.index,
            })
            .then((res) => {
                refetchJobInfo();
                setNotes([]);
                setNewTransactionData({});
                openCloseModal("all", "close");
            })
            .catch(console.log)
            .finally(() => {
                setLoad(false);
            });
        return;
    }
    function addItem() {
        let { description, idaccount, items, amount } = newTransactionData;
        let newnotes = notes;
        if (description)
            newnotes.push({ description, idaccount, items, amount });
        setNewTransactionData({});
        focusOnDesc();
    }
    function removeItem(ind = undefined) {
        let newnote = notes;
        if (isNaN(ind)) {
            if (newTransactionData.description)
                return setNewTransactionData({});
            ind = notes.length - 1;
            newnote.splice(ind, 1)[0];
            setNotes([...newnote]);
            return focusOnDesc();
        } else {
            setNewTransactionData(newnote.splice(ind, 1)[0] || {});
            setNotes([...newnote]);
            focusOnDesc();
        }
    }
}
