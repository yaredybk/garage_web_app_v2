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
import RenderPlate3 from "../../components/RenderPlate3";
import RenderClient2 from "../../features/clients/RenderClient2";
import IconSmall from "../../components/IconSmall";
import EditJobTransaction from "./EditJobTransaction";
export default function ManageJob() {
    const { id } = useParams();
    const { load, setLoad } = useContext(LoadingState);
    const [newTransactionData, setNewTransactionData] = useState({
        idaccount: null,
        amount: "",
        reason: null,
        method: null,
        description: null,
        category: null,
        idjob: id,
        percent: 0,
        accountInfoShared: null,
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
        car: null,
        client: null,
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
                if (tmp2[key]) tmp2[key].push(tmpobj);
                else tmp2[key] = [tmpobj];
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
        if (datain.reason == "note") {
            let newnote = [];
            newnote = jobNoteFiltered;
            if (!isNaN(index)) {
                newnote.splice(index, 1);
            }
            let newdata = { reason: "note", ...datain, idjob: id };
            if (!datain.delete) newnote.push({ amount, description, items });
            let url1 =
                datain.reason === "fromjob"
                    ? "/api/transaction/getfromjob"
                    : "/api/transaction/addtojob";
            xaxios
                .post(url1, {
                    ...newdata,
                    newnote,
                })
                .then((res) => {
                    window.location.reload();
                    // openCloseModal("all", "close");
                })
                .finally(() => {
                    setLoad(false);
                    setNewTransactionData({
                        ...newTransactionData,
                        description: "",
                    });
                });
            return;
        }
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
        console.log(rowinforediting);
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
    return (
        <div className="managejobs  ">
            <div className="  printgrid   px-1 min-[1024px]:px-4  grid  grid-cols-[min-content,auto] max-md:grid-cols-1  max-w-[24cm] print:grid-cols-[min-content,auto] mx-auto  ">
                <details
                    open
                    className="  mb-4 job_info bg-blue-100 bg-opacity-90  print:bg-transparent 2  col-span-full "
                >
                    <summary className=" p-1 bg-blue-400 tracking-widest text-white font-bold text-sm -mx-2">
                        Job details
                        <b className=" px-2 ">( Job ID: {id} )</b>
                    </summary>
                    <div className=" flex flex-wrap items-center justify-around gap-2  col-span-full">
                        <span className={"  px-1 grid "}>
                            <b className=" px-2 ">ODO: {jobinfo?.odo} Km</b>
                            <InputContainer
                                title="start date"
                                htmlFor="created"
                            >
                                <input
                                    type="date"
                                    readOnly
                                    value={
                                        jobinfo?.created ? jobinfo?.created : ""
                                    }
                                    name="created"
                                    id="created"
                                />
                            </InputContainer>
                            {jobinfo?.finished ? (
                                <InputContainer
                                    htmlFor="completed"
                                    onClick={complete_Job}
                                >
                                    <input
                                        type="date"
                                        readOnly
                                        value={jobinfo?.finished}
                                        name="completed"
                                        id="completed"
                                    />
                                </InputContainer>
                            ) : (
                                <ButtonSubmit
                                    disabled={jobinfo?.finished}
                                    onClick={complete_Job}
                                    className=" bg-orange-500 p-2 px-4 rounded-t-none  font-bold "
                                >
                                    complete JOB
                                </ButtonSubmit>
                            )}
                        </span>
                        <div className="bg-gray-300 w-1  h-full  max-md:hidden"></div>
                        <RenderPlate3 plateobj={jobinfo.car} />
                        <div className="bg-gray-300 w-1  h-full  max-md:hidden"></div>
                        <RenderClient2
                            clientobj={jobinfo.client || jobinfo.car}
                        />
                    </div>
                </details>
                <div className="printhidden grid ">
                    <AddNewButton title="note" modal="newnote" />
                </div>
                <div className="printhidden grid">
                    <TableWithSubtotal
                        key={JSON.stringify(jobNoteFiltered)}
                        subtotalColName="amount"
                        data={jobNoteFiltered}
                        indexClicked={(index) =>
                            manageNoteEntry(index, "note", jobNoteFiltered)
                        }
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
                />
                <div className="grid h-2 col-span-full"></div>
                <AddNewButton title={"part"} modal="new part form" />
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={jobReplacementFiltered}
                    rowObjectUP={(row) =>
                        manageTableEntry(row, "part", jobReplacementFiltered)
                    }
                />
                <div className="grid h-2 col-span-full"></div>
                <AddNewButton title={"other"} modal={"new other form"} />
                <TableWithSubtotal
                    subtotalColName="amount"
                    data={jobOthersFiltered}
                    rowObjectUP={(row) =>
                        manageTableEntry(row, "other", jobOthersFiltered)
                    }
                />
                <div className="grid h-2 col-span-full"></div>
                <FoldedSection
                    className=" relative print:hidden col-span-full"
                    title={
                        <>
                            <b>HIDDEN</b>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button
                                onClick={() =>
                                    addNewTransactionToJob("new hidden form")
                                }
                                className=" absolute inline-block place-items-center px-4 p-0 m-0  bg-lime-200 print:hidden"
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
                    />
                </FoldedSection>
                <div className="grid h-2 col-span-full"></div>
                <div className="PAYMENT grid grid-cols-2 print:grid-cols-1 print:ml-auto col-span-full bg-emerald-200">
                    <div
                        className={
                            total - totalpaid > 0
                                ? "totalpaid bg-red-300 border print:hidden border-solid text-right p-2 pr-6 font-bold text-xl   "
                                : "totalpaid border print:hidden border-solid text-right p-2 pr-6 font-bold text-xl   "
                        }
                    >
                        PAID: {totalpaid} birr
                    </div>
                    <div className="total border border-solid text-right p-2 pr-6 font-bold text-xl   ">
                        NET: {total} birr
                    </div>
                </div>
                <div id="alldialogs">
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
                </div>
            </div>
            {manageTransactionRender()}
            <div className=" print:hidden bg-blue-100 mt-2 border-solid border-blue-800 rounded-md border-2 items-center mx-auto p-4 flex flex-wrap gap-4 w-fit">
                <button
                    onClick={() => {
                        addNewTransactionFromJob("new payment form");
                        setSharingOrder({ order: null, accounts: null });
                    }}
                    className=" bg-yellow-500 p-2 px-8 flex-grow   font-bold "
                >
                    <IconSmall
                        className=" h-8 -m-2   mr-2 "
                        src="/public/images/transaction.png"
                    />
                    full payment
                </button>
                <ButtonSubmit
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
                    className=" bg-orange-500  flex-grow   font-bold "
                >
                    <IconSmall
                        className=" h-8 -m-2   mr-2 "
                        src="/public/images/doneall.svg"
                    />
                    complete JOB
                </ButtonSubmit>
                <button
                    onClick={() => window.print()}
                    className=" bg-orange-500  px-2 flex-grow   font-bold "
                >
                    <IconSmall
                        className=" h-8 -m-2   mr-2 "
                        src="/public/images/print.svg"
                    />
                    Print
                </button>
                <button
                    disabled={load}
                    className="  p-3 flex-grow  bg-green-300  "
                    onClick={() => {
                        getjobTransactions();
                    }}
                >
                    <img
                        className={load ? " animate-spin w-5 h-6" : " w-5 h-6"}
                        src="/public/images/refresh.svg"
                        alt="refresh"
                    />
                </button>
                <ButtonSubmit
                    className=" p-3  bg-green-300    "
                    onClick={sendJobToAdmin}
                >
                    Send to Admin
                </ButtonSubmit>
                <ButtonSubmit
                    onClick={() => {
                        openCloseModal("job info", "open");
                    }}
                >
                    <IconSmall
                        className=" h-8 -m-2   mr-2 "
                        src="/public/images/edit.svg"
                    />
                    Edit job info
                </ButtonSubmit>
                <Link
                to={`/nav/check-in/${id}`}
                className=" inline p-4 rounded-md bg-green-300 "
                >
                    Go to checkin
                </Link>
            </div>
        </div>
    );
    function sendJobToAdmin() {
        xaxios.post("/api/notification/sendtoadmin?", { dataType: "job", id });
    }
    function manageNoteEntry(rowin, categoryin, tableDatain) {
        let index;
        if (!(!isNaN(rowin) && categoryin && tableDatain)) return;

        index = rowin;
        rowin = jobNoteFiltered[rowin];

        let dd = [
            {
                title: "index",
                type: "number",
                defaultValue: index,
                readOnly: true,
            },
            {
                title: "reason",
                type: "text",
                defaultValue: "note",
                readOnly: true,
            },

            {
                title: "amount",
                type: "number",
                defaultValue: rowin?.amount,
            },
            {
                title: "description",
                type: "text",
                defaultValue: rowin?.description,
            },
            {
                title: "items",
                type: "number",
                defaultValue: rowin?.items,
            },
        ];
        rowin = dd;
        // store row in data
        // setTableRowDataForEditing(rowin);
        addNewTransactionToJob("description editor", rowin);
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
            <div className=" bg-white  flex-shrink-0 flex-grow w-full max-md:flex-row flex-col justify-around flex  border-solid border-0 border-t-2  border-slate-300">
                <b className=" capitalize text-center min-w-[8rem]">{title}s</b>
                <button
                    onClick={() => addNewTransactionToJob(modal)}
                    title="add new others"
                    className=" place-items-center flex-1 max-w-[8rem] max-h-16   px-4 p-0 m-0 bg-lime-200 print:hidden"
                >
                    <img className=" w-6" src="/public/images/add.svg" />
                </button>
            </div>
        );
    }
    function manageTransactionRender() {
        function manageSharing(amountin, keyToBefirst = null) {
            let accounts = sharingOrder.accounts
                ? sharingOrder.accounts
                : extractBalanceSubnetByIdaccount([
                      ...jobHiddenFiltered,
                      ...jobReplacementFiltered,
                      ...jobOthersFiltered,
                      ...jobOthersFiltered,
                  ]);
            let newshareorder = shareBalanceToAccounts(
                accounts,
                amountin,
                keyToBefirst
            );
            setSharingOrder({ ...newshareorder });
        }

        return (
            <>
                <BasicDialog id="newnote">
                    <BasicForm
                        title={"NOTE"}
                        formClass=" grid gap-2 "
                        key={newTransactionData.category}
                        onSubmit={sendTransactionData}
                    >
                        <InputContainer htmlFor="amount">
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={newTransactionData.amount}
                                onChange={(e) => {
                                    newTransactionData?.reason == "fromjob" &&
                                        manageSharing(e.target.value);
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
                        </InputContainer>
                        <InputContainer htmlFor="items">
                            <input
                                type="number"
                                name="items"
                                id="items"
                                value={newTransactionData.items}
                                onChange={(e) => {
                                    setNewTransactionData({
                                        ...newTransactionData,
                                        items: e.target.value,
                                    });
                                }}
                            />
                        </InputContainer>
                        <InputContainer htmlFor="reason">
                            <input
                                readOnly
                                type="text"
                                id="reason"
                                name="reason"
                                value="note"
                            />
                        </InputContainer>
                        <ButtonSubmit disableOnClick={true}>
                            upload
                        </ButtonSubmit>
                    </BasicForm>
                </BasicDialog>
            </>
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
