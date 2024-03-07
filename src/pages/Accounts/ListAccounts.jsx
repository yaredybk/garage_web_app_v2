import { useParams } from "react-router-dom";
import PageList_v2 from "../../layout/PageList_v2";
import PageListPerson_v2 from "../../layout/PageListPerson_v2";
import { useState } from "react";
import BasicDialog from "../../components/dialog/BasicDialog";
import TransactUniversal from "../../components/transaction/TransactUniversal";
import { openCloseModal } from "../../utils/userInterface";
import xaxios from "../../utils/xaxios";

export default function ListAccounts() {
    let { role = "all" } = useParams();
    let filter = role == "all" ? "" : `&filter=role='${role}'`;
    // let cols =
    //     "cols=idaccount,name,role,phoneno,level,percent,proffession,status,salary,salarytype";
    let url1 = `/api/getlist?from=balance${role}_view_v1${filter}&orderby=idaccount`;
    const [selectedAccount, setSelectedAccount] = useState({});
    const [fresh, refresh] = useState(undefined);
    function openAccount(datain) {
        setSelectedAccount(datain);
        openCloseModal("account_details", "open");
    }
    function onTransaction() {
        refresh(Date.now());
        // openCloseModal("account_details","close")
    }
    return (
        <main className="listaccounts">
            <PageListPerson_v2
                refresh={fresh}
                onClick={openAccount}
                totalcols={{
                    show: true,
                    cols: ["balance", "inactive"],
                    display: ["balance", "inactive"],
                }}
                nopaginate
                url={url1}
                pagetype="person"
                info={{
                    h1: "name",
                    pre: "A",
                    h2: "idaccount",
                    h3: "balance",
                    h4: "inactive",
                }}
            />
            <BasicDialog id="account_details" title={selectedAccount.name}>
                <TransactUniversal
                    url={url1}
                    info={selectedAccount}
                    onTransaction={onTransaction}
                />
            </BasicDialog>
        </main>
    );
}
