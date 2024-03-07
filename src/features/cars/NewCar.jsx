import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import xaxios, { GetData } from "../../utils/xaxios";
import { useContext, useState } from "react";
import { LoadingState } from "../../context/LoadingContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import { GlobalState } from "../../context/GlobalContext";
import { objectToQuery } from "../../utils/ObjectToQuery";
import BreakLine from "../../components/BreakLine";
import CarMakeList from "./CarMakeList";
import CarModelList from "./CarModelList";
import IconSmall from "../../components/IconSmall";
import ButtonSubmitRed from "../../components/button/ButtonSubmitRed";
import FoldedForm from "../../components/form/FoldedForm";

export default function NewCar({
    openCar = null,
    type = undefined | "inspection",
    onNewRegistration = (insertId) => null,
    onChange = (event) => null,
    onClear = () => null,
    open = true,
    ...props
}) {
    const { load, setLoad } = useContext(LoadingState);
    const { list_region } = useContext(GlobalState);
    // console.log(load);
    // setLoad(true);
    const [unregistered, setunregistered] = useState(false);
    const [carMake, setCarMake] = useState(null);
    const [carModel, setCarModel] = useState(null);

    function addNewCar(datain) {
        let tmp = type == "inspection" ? "inspection/car" : "car";
        if (unregistered) {
            xaxios
                .post("/api/addnew/" + tmp, datain, setLoad)
                .then((dd) => {
                    // console.log(dd);
                    if (dd.insertId) {
                        // setunregistered(null);
                        // document
                        //     .querySelectorAll("form")
                        //     .forEach((value) => value.reset());
                        // modal && document.getElementById(modal)?.close();
                        openCar && openCar(dd.insertId);
                        onNewRegistration(dd.insertId);
                    }
                })
                .catch(console.log);
        } else {
            GetData(
                "/api/getsingle/" + tmp + "?" + objectToQuery(datain),
                setLoad
            )
                .then((dd) => {
                    // console.log(dd);
                    if (dd[0]?.idcar) {
                        // modal && document.getElementById(modal)?.close();
                        openCar && openCar(dd[0]?.idcar, dd[0]);
                    } else {
                        setunregistered(true);
                    }
                })
                .catch(console.log);
        }
    }
    function manageCarIdentityChange(event) {
        // unregister car if info changed
        let name = event.target?.name;
        let tmplen = event.target?.value?.length;
        switch (name) {
            case "Code":
                setunregistered(null);
                if (tmplen == 1) {
                    focusOn("Pre");
                }
                break;
            case "Region":
                setunregistered(null);
                focusOn("Pre");
                break;
            case "Pre":
                setunregistered(null);
                focusOn("Plate");
                break;
            case "Plate":
                setunregistered(null);
                break;

            default:
                break;
        }
    }
    return (
        <div {...props} id="newcarform">
            <FoldedForm
                open={open}
                formClass=" grid gap-2"
                onSubmit={addNewCar}
                onChange={onChange}
                title="New car form"
            >
                <div className="flex gap-2">
                    <InputContainer htmlFor="Code">
                        <input
                            onChange={manageCarIdentityChange}
                            type="text"
                            inputMode="numeric"
                            name="Code"
                            required
                            autoFocus
                            id="Code"
                            size={1}
                            autoComplete="on"
                            pattern="[0-9]?[0-9]?[0-9]"
                        />
                    </InputContainer>

                    {list_region && (
                        <InputContainer htmlFor="Region">
                            <select
                                onChange={manageCarIdentityChange}
                                inputMode="numeric"
                                name="Region"
                                required
                                id="Region"
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
                    <InputContainer htmlFor="Pre">
                        <input
                            type="text"
                            autoCapitalize="on"
                            onKeyDown={(e) => {
                                if (
                                    e.target.value == "" &&
                                    e.key == "Backspace"
                                ) {
                                    document.getElementById("Code")?.focus();
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                let val = e.target.value;
                                e.target.value = val.toLocaleUpperCase();
                                manageCarIdentityChange(e);
                            }}
                            inputMode="text"
                            pattern="[A-Z]"
                            name="Pre"
                            id="Pre"
                            size={1}
                        />
                    </InputContainer>
                    <InputContainer htmlFor="Plate">
                        <input
                            onKeyDown={(e) => {
                                if (
                                    e.target.value == "" &&
                                    e.key == "Backspace"
                                ) {
                                    document.getElementById("Pre")?.focus();
                                    e.preventDefault();
                                }
                            }}
                            onChange={manageCarIdentityChange}
                            type="text"
                            inputMode="numeric"
                            name="Plate"
                            required
                            id="Plate"
                            autoComplete="off"
                            pattern="[0-9]?[0-9]?[0-9]{3}"
                            size={4}
                            title="min 3-digit and max 5-digit"
                        />
                    </InputContainer>
                </div>
                {/* )} */}
                {unregistered && (
                    <>
                        <BreakLine />
                        <InputContainer htmlFor="Make">
                            <input
                                onChange={(e) => {
                                    setCarMake(e.target.value);
                                    // document.getElementById("Model").value = "";
                                }}
                                list="carmakelist"
                                autoCapitalize="off"
                                required
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="Make"
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
                                autoFocus
                                required
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="Model"
                                id="Model"
                                size={8}
                                placeholder="Car Model"
                            />
                            <CarModelList
                                carMake={carMake}
                                carModel={carModel}
                            />
                        </InputContainer>
                        <InputContainer htmlFor="Color">
                            <input
                                autoComplete="on"
                                className=" "
                                type="text"
                                name="Color"
                                id="Color"
                                size={8}
                                placeholder="Car Color"
                            />
                        </InputContainer>
                    </>
                )}
                <BreakLine />
                <ButtonSubmit title={unregistered ? "register" : "check ?"}>
                    {unregistered ? (
                        <>
                            <IconSmall
                                src="/public/images/doneall.svg"
                                alt=""
                            />
                            register
                        </>
                    ) : (
                        <>
                            <IconSmall src="/public/images/search.svg" alt="" />{" "}
                            check
                        </>
                    )}
                </ButtonSubmit>
                <ButtonSubmitRed
                    type="button"
                    onClick={() => {
                        setunregistered(null);
                        setCarMake("");
                        setCarModel("");
                        document
                            .querySelectorAll("form")
                            .forEach((value) => value.reset());
                        document.getElementById("Code")?.focus();
                        onClear({ target: {} });
                    }}
                >
                    <IconSmall src="/public/images/close.svg" />
                    clear all
                </ButtonSubmitRed>
            </FoldedForm>
        </div>
    );

    function focusOn(id) {
        document.getElementById(id)?.focus();
    }
}
