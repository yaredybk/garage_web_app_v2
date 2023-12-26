import { useParams } from "react-router-dom";
import RenderPlate2 from "../../components/RenderPlate2";
import xaxios from "../../utils/xaxios";
import { useContext, useEffect, useState } from "react";
import { useEffectStateSingleData } from "../../hooks/EffectStateSingleData";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { openCloseModal } from "../../utils/userInterface";
import BasicDialog from "../../components/dialog/BasicDialog";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import { GlobalState } from "../../context/GlobalContext";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import { LoadingState } from "../../context/LoadingContext";
import CarModelList from "../../features/cars/CarModelList";
import RenderCar from "../../features/cars/RenderCar";
import RenderClient from "../../features/clients/RenderClient";
import RenderClient2 from "./../../features/clients/RenderClient2";
import IconSmall from "../../components/IconSmall";
import BreakLine from "../../components/BreakLine";
import FoldedSection from "../../components/FoldedSection";
import RenderCars from "../../features/cars/RenderCars";
export default function ManageClient() {
    const [carMake, setNameGender] = useState(null);
    const [idcar, setIdcar] = useState(null);
    const [carModel, setCarModel] = useState(null);
    const { list_region } = useContext(GlobalState);
    const { setLoad } = useContext(LoadingState);
    const { id } = useParams();
    const clientInfo = useEffectStateSingleData(
        `/api/getsingle/client?idclient=${id}`
    );
    function getclientInfo(caridin, jobidin = null) {
        if (!(caridin || jobidin)) {
            return;
        }
        // let str = caridin
        //     ? `${axioslinks.devDbLink}/find/CAR/id/${caridin} `
        //     : `${axioslinks.devDbLink}/find/CAR/jobid/${jobidin}`;
        xaxios
            .GetData(str)
            .then((data) => {
                if (data.length === 1) {
                    setobjcopy({
                        ...data[0],
                    });
                } else {
                    setobjcopy(null);
                }
            })
            .catch((err) => {
                console.warn(err);
                setobjcopy(null);
            });
    }

    function editPhoneno() {
        let plateObject = clientInfo.data[0];
        const element = document.getElementById("phone");
        element.value = plateObject.phoneno?.split("+251")[1];
        openCloseModal("edit phone number");
    }
    function editNameGender() {
        let plateObject = clientInfo.data[0];
        const element = document.getElementById("name");
        element.value = plateObject.name;
        const rr = document.getElementById("gender");
        rr.value = plateObject.gender;
        openCloseModal("edit name/gender");
    }
    function sendClientinfo(datain) {
        datain.idclient = id;
        const ll = datain.phone ? "/api/update/phone" : "/api/update/client";
        xaxios
            .post(ll, datain, setLoad)
            .then(() => {
                openCloseModal("all", "close");
                document.getElementById("new_account_form")?.reset();
                clientInfo.refetchData();
            })
            .catch(() => clientInfo.refetchData());
    }
    return (
        clientInfo.data &&
        clientInfo.data[0] && (
            <div className=" grid grid-cols-[auto,auto] max-sm:grid-cols-1 gap-4 p-4">
                <BasicForm
                    formClass=" grid  gap-1  justify-center "
                    className=" bg-opacity-20 max-w-fit   "
                    title={
                        <span className="flex items-center gap-1">
                            <IconSmall src="/public/images/person2.png"></IconSmall>
                            Client info
                        </span>
                    }
                >
                    <div className=" grid grid-cols-[1fr,2fr] gap-1 w-fit mx-auto ">
                        <InputContainer htmlFor="id">
                            <input
                                type="text"
                                name="idclient"
                                className="  bg-white w-10 text-black border-none"
                                value={clientInfo.data[0].idclient}
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer htmlFor="name">
                            <input
                                name="name"
                                type="text"
                                size={10}
                                className="  bg-white text-black border-none"
                                value={clientInfo.data[0].name}
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer className=" col-span-2" htmlFor="phone">
                            <a
                                href={"tel:" + clientInfo.data[0].phoneno}
                                className=" flex-1 px-4 py-1  print:hidden  justify-center flex gap-2 items-center "
                            >
                                <IconSmall
                                    src="/public/call_1.svg"
                                    alt="contact"
                                />
                                {clientInfo.data[0].phoneno}
                            </a>
                        </InputContainer>
                    </div>
                    <FoldedSection title="New Appointment">
                        <InputContainer htmlFor="apptdate">
                            <input
                                type="date"
                                name="apptdate"
                                id="apptdate"
                                required
                            />
                        </InputContainer>
                        <InputContainer htmlFor="appttime">
                            <input
                                type="time"
                                name="appttime"
                                id="appttime"
                                defaultValue="08:00"
                            />
                        </InputContainer>
                        <InputContainer htmlFor="note">
                            <textarea
                                rows={3}
                                cols={30}
                                name="note"
                                id="note"
                            />
                        </InputContainer>
                        <button
                            type="submit"
                            className="btn-blue h-fit my-auto"
                        >
                            + Add New Appointment
                        </button>
                    </FoldedSection>
                </BasicForm>
                <FoldedSection
                    open
                    title={clientInfo.data[0]?.name + "'s cars"}
                >
                    <RenderCars
                        url={
                            "/api/getlist/car?idclient=" +
                            clientInfo.data[0].idclient
                        }
                        openCar={(id) => {
                            openModal(id, "carwindow");
                        }}
                    />
                </FoldedSection>
                <ButtonSubmit onClick={editNameGender}>
                    Edit Name / Gender
                </ButtonSubmit>
                <ButtonSubmit onClick={editPhoneno}>
                    edit phone number
                </ButtonSubmit>
                <BasicDialog id="edit phone number">
                    <BasicForm
                        formClass=" grid gap-2 place-items-center"
                        title="edit plate"
                        onSubmit={sendClientinfo}
                    >
                        <InputContainer htmlFor="phone">
                            <input
                                type="text"
                                inputMode="numeric"
                                name="phone"
                                required
                                width="8rem"
                                autoFocus
                                id="phone"
                                autoComplete="off"
                                pattern="[0-9]{9}"
                            />
                        </InputContainer>

                        <ButtonSubmitRed>Update</ButtonSubmitRed>
                    </BasicForm>
                </BasicDialog>
                <BasicDialog id="edit name/gender">
                    <BasicForm
                        formClass=" grid gap-2 place-items-center"
                        title="name/gender"
                        onSubmit={sendClientinfo}
                    >
                        <InputContainer htmlFor="Name">
                            <input
                                list="carmakelist"
                                autoCapitalize="words"
                                required
                                autoFocus
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="name"
                                id="name"
                                size={8}
                                placeholder="name"
                            />
                            {/*
                <CarMakeList carModel={carModel} /> */}
                        </InputContainer>
                        <InputContainer htmlFor="gender">
                            <select className=" " name="gender" id="gender">
                                <option value=""></option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </select>
                        </InputContainer>
                        <CarModelList carMake={carMake} carModel={carModel} />
                        <ButtonSubmitRed>Update</ButtonSubmitRed>
                    </BasicForm>
                </BasicDialog>
                <BasicDialog id="carwindow">
                    <RenderCar key={idcar} idcar={idcar} />
                </BasicDialog>
            </div>
        )
    );
    function openModal(id, modalid) {
        setIdcar(id);
        openCloseModal(modalid);
    }
}
