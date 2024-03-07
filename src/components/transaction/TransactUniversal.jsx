import TransactMethodSelector from "./../../utils/TransactMethodSelector";
import AccountSelector_v2 from "../../utils/AccountSelector_v2";

import { useContext, useEffect, useState } from "react";
import { LoadingState } from "../../context/LoadingContext";
import BasicDialog from "../dialog/BasicDialog";
import AdvancedForm_v2 from "../form/AdvancedForm_v2";
import xaxios from "../../utils/xaxios";
import { openCloseMiniPop, openCloseModal } from "../../utils/userInterface";
import { Link } from "react-router-dom";
import IconSmall from "../IconSmall";
import AccountHistory, {
    AccountHistoryMain,
} from "../../pages/report/AccountHistory";
import ButtonSubmit from "../button/ButtonSubmit";

export default function TransactUniversal({
    info = {
        idtransaction2: "",
        idaccount: "",
        amount: "",
        reason: "",
        method: "",
        description: "",
        category: "",
        balance: "",
        inactive: "",
        idreport: "",
        createdat: "",
        updatedat: "",
        idjob: "",
        percent: "",
        idtransaction: "",
        name: "",
        role: "",
        phoneno: "",
        defpercent: "",
        proffession: "",
        status: "",
        salary: "",
        salarytype: "",
    },
    onTransaction = () => null,
}) {
    const [info2, setInfo2] = useState(info);
    const { setLoad } = useContext(LoadingState);
    const [payLoad, setpayLoad] = useState({
        accountinfo: {},
        transactiondetails: { reason: "" },
    });
    const [formfields, setFormfields] = useState({
        fields: [
            {
                readOnly: false,
                title: "no title",
                type: "test",
                required: false,
                defaultValue: "",
                pattern: "",
            },
        ],
        title: "form",
        className: "",
        onSubmit: null,
        onChange: null,
        removeEmpty: false,
        formClass: "",
        action: "Submit",
    });
    const required = true;
    function opentransact(reason) {
        let { idaccount, idtransaction2, balance, inactive } = info2;
        openCloseModal("transact", "open");
        setpayLoad({
            accountinfo: { idaccount, idtransaction2, balance, inactive },
            transactiondetails: { reason },
        });
        let commonfields = [
            {
                name: "amount",
                placeholder: "birr",
                autoComplete: "off",
                required,
            },
            { name: "description", placeholder: " ... ", required },
        ];
        let commoncustomfields = [
            {
                name: "method",
                children: <TransactMethodSelector />,
            },
        ];
        if (reason == "income" || reason == "expense")
            setFormfields({
                action: "transact",
                fields: [...commonfields],
                customfields: [...commoncustomfields],
            });
        else if (reason == "credit" || reason == "debit") {
            let tmp =
                info.role == "internal"
                    ? ["employee", "agent", "company"]
                    : ["internal"];
            setFormfields({
                action: "transact",
                fields: [...commonfields],
                customfields: [
                    {
                        name: "refidaccount",
                        children: (
                            <AccountSelector_v2
                                name="refidaccount"
                                allowedGroups={tmp}
                                required
                            />
                        ),
                    },
                    ...commoncustomfields,
                ],
            });
        } else if (reason == "transfer") {
            setFormfields({
                action: "transact",
                fields: [...commonfields],
                customfields: [
                    {
                        name: "refidaccount",
                        children: (
                            <AccountSelector_v2
                                name="refidaccount"
                                required
                                allowedGroups={[info.role]}
                            />
                        ),
                    },
                    ...commoncustomfields,
                ],
            });
        }
    }
    useEffect(() => {
      setInfo2(info)
    
    }, [info])
    
    useEffect(() => {
        document.getElementById("amount")?.focus();
    }, [formfields]);

    function sendTransaction(transactiondetails) {
        // console.log(transactiondetails);
        let { idaccount, idtransaction2, balance, inactive } = info;
        let tmp = {
            idaccount,
            idtransaction2,
            balance,
            inactive,
            ...transactiondetails,
        };
        xaxios
            .post(
                `/api/transaction/v2/manual/${info.role}/${payLoad.transactiondetails?.reason}`,
                tmp,
                setLoad
            )
            .then((res) => {
                let tmp = res?.payLoad[0];
                setInfo2(tmp);
                openCloseModal("transact", "close");
                onTransaction();
            });
    }
    return (
        <div className="transactuniversal ">
            {/* <h3>{info.name}</h3> */}
            <br />
            <div className="grid grid-cols-4 gap-1 text-black max-md:grid-cols-2">
                <div className=" col-span-2 flex gap-2 max-sm:gap-1 bg-[var(--accent-color1)] font-bold max-w-lg">
                    <span className=" bg-black text-white  p-1">
                        A{info.idaccount}
                    </span>
                    <span className=" p-1  text-white">
                        {info.role}
                        <em className="bg-white rounded-md text-black py-[2px] bg-opacity-50 px-2">
                            {info.name}
                        </em>
                    </span>
                    <a
                        href={`tel:${info.phoneno}`}
                        className=" p-1 bg-orange-200 ml-auto float-right "
                    >
                        {info.phoneno}
                    </a>
                </div>
                <div className="flex flex-wrap gap-2 max-sm:gap-1  bg-gray-300  max-w-lg">
                    <span className=" bg-gray-500 w-14 flex-grow  p-1">
                        Total
                    </span>
                    <b className=" p-1 w-28  ">
                        {info2.balance?.replace(/\.00$/, "")} Br.
                    </b>
                </div>
                <div className="flex flex-wrap gap-2 max-sm:gap-1  bg-green-300  max-w-lg">
                    <span className=" bg-green-500 w-14 flex-grow  p-1">
                        Active
                    </span>
                    <b className=" p-1  w-28   ">
                        {info2.balance - info2.inactive} Br.
                    </b>
                </div>
                {/* <div className=" col-span-2 flex gap-2 items-center  max-sm:gap-1 bg-gray-200 font-bold max-w-lg">
                    <span className=" bg-gray-500 text-white p-1">last </span>
                    {info.reason}
                    <Link role="button" to={`/nav/jobs/edit/${info.idjob}`}>
                        J{info.idjob}
                    </Link>
                    {info.method}
                    <span
                        className=" p-1  ml-auto float-right "
                    >
                        birr {info.amount}
                    </span>
                </div> */}
                {/* <div className=" col-span-2 flex gap-2 max-sm:gap-1 bg-gray-200 font-bold max-w-lg">
                    <span className=" bg-gray-500 text-white p-1">desc </span>
                    <span className=" p-1  ">{info.description}</span>
                    <Link
                        role="button"
                        to={`/nav/accounts/history?idaccount=${info.idaccount}`}
                        className="   ml-auto float-right "
                    >
                        more history
                    </Link>
                </div> */}
                <div className="col-span-full h-2"></div>
                {[
                    {
                        value: "income",
                        className: "  ",
                        src: "/public/images/add.svg",
                    },
                    {
                        value: "credit",
                        className: "  ",
                        src: "/public/images/add.svg",
                    },
                    {
                        value: "expense",
                        className: "  bg-red-400",
                        src: "/public/images/remove_FILL0_wght400_GRAD0_opsz24.svg",
                    },
                    {
                        value: "debit",
                        className: "  bg-red-400",
                        src: "/public/images/remove_FILL0_wght400_GRAD0_opsz24.svg",
                    },
                    {
                        value: "transfer",
                        className: "  bg-green-400",
                        src: "/public/images/arrow_circle_right_FILL0_wght400_GRAD0_opsz24.svg",
                    },
                ].map((obj2) => (
                    <ButtonSubmit
                        key={obj2.value}
                        type="button"
                        role="button"
                        className={obj2.className}
                        onClick={() => opentransact(obj2.value)}
                    >
                        <IconSmall src={obj2.src} />
                        {obj2.value}
                    </ButtonSubmit>
                ))}
                <ButtonSubmit
                    role="button"
                    onClick={() => openCloseModal("history")}
                >
                    <IconSmall src="/public/images/history_FILL0_wght400_GRAD0_opsz24.svg" />
                    history
                </ButtonSubmit>
            </div>
            <BasicDialog id="history">
                <b>{info.name}</b>
                {info.idaccount && (
                    <AccountHistoryMain noselector info={info} />
                )}
                <Link
                    role="button"
                    to={`/nav/accounts/history?idaccount=${info.idaccount}`}
                    className="    "
                >
                    more history
                </Link>
            </BasicDialog>
            <BasicDialog
                id={`transact`}
                title={`${info.name} ${payLoad.transactiondetails.reason}`}
            >
                <AdvancedForm_v2
                    id="transact form"
                    onSubmit={sendTransaction}
                    formClass=" grid gap-1"
                    key={payLoad.transactiondetails?.reason}
                    title={info.name + " " + payLoad.transactiondetails.reason}
                    {...formfields}
                ></AdvancedForm_v2>
                <br />
            </BasicDialog>
        </div>
    );
}
