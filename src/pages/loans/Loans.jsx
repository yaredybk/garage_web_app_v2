import React from "react";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import PageList_v1 from "../../layout/PageList_v1";
import {  useSubTotalFunctions } from "./../../hooks/useGroupFunctions";

export default function Loans() {
    const { data } = useEffectStateSingleData(
        `/api/getlist?from=loans_v_v1`+
        `&cols=idjob,amount,balance,inactive,description,createdat,name,make,model,code,region,plate`+
        ``
    );
    const { net1, count1 } = useSubTotalFunctions(data?.payLoad, ["amount"]);
    return (
        <main className="loans">
            <br />
            <center className="warnning red">
                <em className=" text-lg flex justify-between font-bold ">
                    <span>
                        {count1} UNPAID JOB{count1 != 1 && "S"}
                    </span>{" "}
                    <span>NET: {net1[0]} birr</span>
                </em>
            </center>
            <br />
            <PageList_v1
                list={data?.payLoad}
                info={{
                    h1: "name",
                    pre: "J",
                    h2: "idjob",
                    h3: "make",
                    h32: "model",
                    h4: "amount",
                }}
                display="icon"
                openurl="/nav/jobs/edit/"
                id="idjob"
            />
        </main>
    );
}
