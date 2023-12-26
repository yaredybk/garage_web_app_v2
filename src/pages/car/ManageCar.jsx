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
import RenderClient2 from "../../features/clients/RenderClient2";
import FoldedSection from "../../components/FoldedSection";
import NewClient from "../../features/clients/NewClient";
import RenderClients from "../../features/clients/RenderClients";
import IconSmall from "../../components/IconSmall";
import RenderClient from "../../features/clients/RenderClient";

export default function ManageCar() {
    const [carMake, setCarMake] = useState(null);
    const [infoo, setInfoo] = useState(null);
    const [carModel, setCarModel] = useState(null);
    const { list_region } = useContext(GlobalState);
    const { setLoad } = useContext(LoadingState);
    const { id } = useParams();
    const carInfo = useEffectStateSingleData(`/api/getsingle/car?idcar=${id}`);
    function getCarInfo(caridin, jobidin = null) {
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

    function editPlate() {
        // console.log(carInfo.data[0]);
        let plateObject = carInfo.data[0];
        const element = document.getElementById("code");
        element.value = plateObject.code;
        const rr = document.getElementById("region");
        rr.value = plateObject.region;
        let { plate } = plateObject;
        if (plate.match(/[a-zA-Z]/)) {
            console.log(plate);
            let pre = plate[0];
            plate = plate.slice(1);
            const pp = document.getElementById("plate");
            pp.value = plate;
            const preel = document.getElementById("pre");
            preel.value = pre;
            console.log(plate, pre);
        } else {
            plate = plate.slice(1);
            const pp = document.getElementById("plate");
            pp.value = plateObject[plate];
        }
        // Object.keys(carInfo.data[0]).forEach((key) => {
        //     const element = document.getElementById(key);
        //     if (element) {
        //         element.value = plateObject[key];
        //     }
        // });
        openCloseModal("edit plate no");
    }
    function editMakeModel() {
        // console.log(carInfo.data[0]);
        let plateObject = carInfo.data[0];
        const element = document.getElementById("Make");
        element.value = plateObject.make;
        const rr = document.getElementById("Model");
        rr.value = plateObject.model;

        // Object.keys(carInfo.data[0]).forEach((key) => {
        //     const element = document.getElementById(key);
        //     if (element) {
        //         element.value = plateObject[key];
        //     }
        // });
        openCloseModal("edit Make/Model");
    }
    function manageCarIdentityChange(event) {
        // unregister car if info changed
        let name = event.target?.name;
        let tmplen = event.target?.value?.length;
        switch (name) {
            case "Code":
                if (tmplen == 1) {
                    focusOn("Pre");
                }
                break;
            case "Region":
                focusOn("Pre");
                break;
            case "Pre":
                focusOn("Plate");
                break;
            case "Plate":
                break;

            default:
                break;
        }
    }
    function sendplate(datain) {
        datain.where = { idcar: id };
        if (datain.plate) {
            datain.plate = "".concat(datain.pre, datain.plate);
            delete datain.pre;
        }
        xaxios
            .post("/api/update/car", datain, setLoad)
            .then(() => {
                openCloseModal("all", "close");
                document.getElementById("new_account_form")?.reset();
                carInfo.refetchData();
            })
            .catch(() => carInfo.refetchData());
    }
    return (
        carInfo.data && (
            <div className="managecar">
                <RenderCar key={JSON.stringify(carInfo.data)} idcar={id} />
                <FoldedSection open title="Owner Info">
                    {carInfo.data[0].idclient ? (
                        <div className=" w-fit gap-2 grid-cols-2 max-sm:grid-cols-1 grid m-2">
                            <RenderClient2 clientobj={carInfo.data[0]} />
                            <ButtonSubmitRed onClick={detachClient}>
                                Detach client
                            </ButtonSubmitRed>
                        </div>
                    ) : (
                        <span className=" p-2 bg-red-200 text-red-900">
                            This vehicle does not have a registerd Owner
                            <ButtonSubmitRed
                                onClick={() => {
                                    openCloseModal("addclient2", "open");
                                }}
                            >
                                + Add client
                            </ButtonSubmitRed>
                        </span>
                    )}
                </FoldedSection>
                <br />
                <div className="flex flex-wrap gap-2 ">
                    <ButtonSubmit onClick={editMakeModel}>
                        Edit Make / Model
                    </ButtonSubmit>
                    <ButtonSubmit onClick={editPlate}>
                        Edit Plate no
                    </ButtonSubmit>

                    {/* <ButtonSubmit onClick={changeowner}>change owner</ButtonSubmit> */}
                </div>
                <BasicDialog id="edit plate no">
                    <BasicForm
                        formClass=" grid gap-2 place-items-center"
                        title="edit plate"
                        onSubmit={sendplate}
                    >
                        <InputContainer htmlFor="code">
                            <input
                                onChange={manageCarIdentityChange}
                                type="text"
                                inputMode="numeric"
                                name="code"
                                required
                                autoFocus
                                id="code"
                                size={1}
                                autoComplete="on"
                                pattern="[0-9]?[0-9]?[0-9]"
                            />
                        </InputContainer>

                        {list_region && (
                            <InputContainer htmlFor="region">
                                <select
                                    onChange={manageCarIdentityChange}
                                    inputMode="numeric"
                                    name="region"
                                    required
                                    id="region"
                                    defaultValue="2"
                                >
                                    <option value="">...</option>
                                    {list_region?.map((lobj, ind) => (
                                        <option
                                            key={"lobj" + ind}
                                            value={lobj?.idregion}
                                        >
                                            {lobj?.en}/{lobj?.am}
                                        </option>
                                    ))}
                                </select>
                            </InputContainer>
                        )}
                        <InputContainer htmlFor="pre">
                            <input
                                type="text"
                                autoCapitalize="on"
                                onChange={(e) => {
                                    let val = e.target.value;
                                    e.target.value = val.toLocaleUpperCase();
                                    manageCarIdentityChange(e);
                                }}
                                inputMode="text"
                                pattern="[A-Z]"
                                name="pre"
                                id="pre"
                                size={1}
                            />
                        </InputContainer>
                        <InputContainer htmlFor="plate">
                            <input
                                onChange={manageCarIdentityChange}
                                type="text"
                                inputMode="numeric"
                                name="plate"
                                required
                                id="plate"
                                autoComplete="off"
                                pattern="[0-9]?[0-9]?[0-9]{3}"
                                size={4}
                                title="min 3-digit and max 5-digit"
                            />
                        </InputContainer>
                        <ButtonSubmitRed>Update</ButtonSubmitRed>
                    </BasicForm>
                </BasicDialog>
                <BasicDialog id="edit Make/Model">
                    <BasicForm
                        formClass=" grid gap-2 place-items-center"
                        title="make/model"
                        onSubmit={sendplate}
                    >
                        <InputContainer htmlFor="Make">
                            <input
                                onChange={(e) => {
                                    setCarMake(e.target.value);
                                    // document.getElementById("Model").value = "";
                                }}
                                list="carmakelist"
                                autoCapitalize="off"
                                required
                                autoFocus
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="make"
                                id="Make"
                                size={8}
                                placeholder="Car Make"
                            />
                            {/*
                <CarMakeList carModel={carModel} /> */}
                        </InputContainer>
                        <InputContainer htmlFor="Model">
                            <input
                                list="carmodellist"
                                onChange={(e) => {
                                    setCarModel(e.target.value);
                                    // document.getElementById("Make").value = "";
                                }}
                                autoCapitalize="off"
                                required
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="model"
                                id="Model"
                                size={8}
                                placeholder="Car Model"
                            />
                            <CarModelList
                                carMake={carMake}
                                carModel={carModel}
                            />
                        </InputContainer>
                        <CarModelList carMake={carMake} carModel={carModel} />
                        <ButtonSubmitRed>Update</ButtonSubmitRed>
                    </BasicForm>
                </BasicDialog>
                <BasicDialog id="addclient2">
                    <NewClient
                        openClient={(id) => {
                            setInfoo({ ...infoo, idclient: id });
                            openCloseModal(
                                "clientwindow3",
                                "closeopen",
                                "addclient"
                            );
                        }}
                    />
                    <FoldedSection title="recent clients">
                        <RenderClients
                            // key={info2?.idcar}
                            openClient={(id) => {
                                setInfoo({ ...infoo, idclient: id });
                                openCloseModal(
                                    "clientwindow3",
                                    "closeopen",
                                    "addclient"
                                );
                            }}
                        />
                    </FoldedSection>
                </BasicDialog>
                <BasicDialog id="clientwindow3">
                    {infoo?.idclient && (
                        <RenderClient
                            clientid={infoo.idclient}
                            key={infoo.idclient}
                            // minimal={true}
                        />
                    )}
                    <div className="grid p-1 gap-2 ">
                        <button
                            className=" bg-green-500 flex items-center animate-ping-1 justify-center gap-2 text-white font-bold py-2 px-4 w-full my-2"
                            onClick={() => attachClient()}
                        >
                            <IconSmall
                                src="/public/images/link_1.svg"
                                alt="link"
                            />
                            Link Client
                        </button>
                    </div>
                </BasicDialog>
            </div>
        )
    );
    function attachClient() {
        xaxios
            .post(
                "/api/update/car",
                {
                    where: { idcar: id },
                    idclient: infoo.idclient,
                },
                setLoad
            )
            .then((res) => {
                carInfo.refetchData();
                openCloseModal("all", "close");
                // console.log(res);
                // setInfoo({ ...infoo, idcar: null });
            })
            .catch(console.log);
    }
    function detachClient() {
        const ans = confirm("detach client?");
        if (ans)
            xaxios
                .post(
                    "/api/update/car",
                    {
                        where: { idcar: id },
                        idclient: null,
                    },
                    setLoad
                )
                .then((res) => {
                    carInfo.refetchData();
                    // console.log(res);
                    // setInfoo({ ...infoo, idcar: null });
                })
                .catch(console.log);
    }
}
