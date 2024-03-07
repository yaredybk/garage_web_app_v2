import { useContext, useEffect, useState } from "react";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import BreakLine from "../../components/BreakLine";
import FoldedSection from "../../components/FoldedSection";
import { LoadingState } from "../../context/LoadingContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import NewClient from "../clients/NewClient";
import BasicDialog from "../../components/dialog/BasicDialog";
import IconSmall from "../../components/IconSmall";
import xaxios from "../../utils/xaxios";
import JobHistory from "../../pages/job/JobHistory";
import RenderClients from "../clients/RenderClients";
import RenderClient from "../clients/RenderClient";
import RenderPlate2 from "../../components/RenderPlate2";
import RenderPlate3 from "../../components/RenderPlate3";
import { openCloseModal } from "../../utils/userInterface";

export default function RenderCarWithInspection({
    idcar = null,
    minimal = false,
    ui = "all",
    uploadData = () => null,
}) {
    let filteredData = null;
    const { setLoad, load } = useContext(LoadingState);
    const { pathname } = useLocation();
    const patheslist = ["/nav/appt", "/nav/check-in", "/nav/jobs/edit"];
    const navigate = useNavigate();
    const [refreshdata, setRefreshdata] = useState(1);
    const { data } = useEffectStateSingleData(
        "/api/getsingle/inspection/car?idcar=" + idcar,
        setRefreshdata
    );
    useEffect(() => {
        // console.log("car", data);
        if (!filteredData) return;
        // console.log(filteredData);
        uploadData(filteredData);
    }, [data]);

    const [infoo, setInfoo] = useState({ idclient: null });
    // if (load) return <div>Loading ...</div>;
    if (!data) return <div>NODATA</div>;
    filteredData = data[0];
    if (!filteredData) return <div>NODATA</div>;

    return (
        <div className=" flex flex-wrap max-sm:grid gap-2">
            
                <BasicForm
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="bg-blue-300 bg-opacity-20 flex-col w-fit"
                    title={
                        <span className="flex items-center gap-1">
                            <IconSmall src="/public/images/caricon.svg"></IconSmall>
                            Inspection Car Info
                        </span>
                    }
                >
                    <div className="grid  gap-2">
                        <span className="flex">
                            <RenderPlate3 inspection plateobj={filteredData} />
                        </span>
                        {filteredData.phoneno ? (
                            <a
                                href={"tel:" + filteredData.phoneno}
                                className=" px-4 py-1 justify-center print:hidden flex gap-2 items-center "
                            >
                                <IconSmall
                                    src="/public/call_1.svg"
                                    alt="contact"
                                />
                                Contact Client
                            </a>
                        ) : (
                            <b className=" mx-auto text-red-500">
                                No client details
                            </b>
                        )}
                        {!minimal && (
                            <FoldedSection title="more">
                                <div className="grid grid-cols-3 max-md:grid-cols-2">
                                    {filteredData &&
                                        Object.keys(filteredData)?.map(
                                            (key, ind) => (
                                                <InputContainer
                                                    key={key + ind}
                                                    htmlFor={key}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type="text"
                                                        className=" bg-blue-200 text-black border-none"
                                                        name={key}
                                                        id={key}
                                                        size={10}
                                                        placeholder={key}
                                                        readOnly
                                                        disabled={
                                                            key == "idclient"
                                                                ? false
                                                                : true
                                                        }
                                                        value={
                                                            filteredData[key]
                                                                ? filteredData[
                                                                      key
                                                                  ]
                                                                : ""
                                                        }
                                                    />
                                                </InputContainer>
                                            )
                                        )}
                                </div>
                            </FoldedSection>
                        )}
                    </div>
                </BasicForm>
            
                <span className=" grid gap-1">
                    <ButtonSubmit type="button" onClick={newInspection}>
                        + New Inspection
                    </ButtonSubmit>
                </span>
                {/* fix-me change to inspection history */}
            <JobHistory type="inspection" idcar={idcar} />
        </div>
    );
    
    function newInspection() {
        xaxios
            .post(`/api/addnew/inspection`, { idcar,carinfo:data }, setLoad)
            .then((res) => {
                if(res.insertId)
                navigate(`/nav/inspections/edit/${res.insertId}`,{state:{carinfo:data}});
            });
    }
}
