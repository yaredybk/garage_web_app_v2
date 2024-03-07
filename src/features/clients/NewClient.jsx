// import React from "react";
import "./client.css";
import BasicForm from "../../components/form/BasicForm";
import InputContainer from "../../components/input/InputContainer";
import xaxios, { GetData } from "../../utils/xaxios";
import { useContext, useState } from "react";
import { LoadingState } from "../../context/LoadingContext";
import ButtonSubmit from "../../components/button/ButtonSubmit";
import IconSmall from "../../components/IconSmall";

export default function NewClient({
    onNewRegistration = (insertId) => null,
    openClient = null,
    modal = null,
}) {
    const { load, setLoad } = useContext(LoadingState);
    // console.log(load);
    // setLoad(true);
    const [unregistered, setunregistered] = useState(false);

    function addNewClient(datain) {
        if (unregistered)
            xaxios
                .post("/api/addnew/client", datain, setLoad)
                .then((dd) => {
                    // console.log(dd);
                    if (dd.insertId) {
                        // modal && document.getElementById(modal)?.close();
                        openClient && openClient(dd.insertId);
                        onNewRegistration(dd.insertId);
                    }
                })
                .catch(console.log);
        else
            GetData("/api/getsingle/client?Phone=" + datain?.Phone, setLoad)
                .then((dd) => {
                    // console.log(dd);
                    if (dd[0]?.idclient) {
                        // modal && document.getElementById(modal)?.close();
                        openClient && openClient(dd[0]?.idclient);
                    } else {
                        setunregistered(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    openClient && openClient(dd.insertId);
                });
    }
    return (
        <div id="newclientform">
            <BasicForm
                onSubmit={addNewClient}
                onChange={() => null}
                className="bg-red-500 bg-opacity-20"
                title={
                    <span className=" flex items-center gap-2">
                        <IconSmall src="/public/images/person2.png"></IconSmall>{" "}
                        New client form
                    </span>
                }
            >
                {true && (
                    <InputContainer htmlFor="Phone">
                        <span>+251 </span>
                        <input
                            onChange={(e) => {
                                if (e.target.value?.match(/^\+251|^251|^0/))
                                    e.target.value?.replace(
                                        /^\+251|^251|^0/,
                                        ""
                                    );
                                setunregistered(false);
                            }}
                            type="text"
                            inputMode="numeric"
                            name="Phone"
                            required
                            width="8rem"
                            autoFocus
                            id="Phone"
                            autoComplete="off"
                            pattern="[0-9]{9}"
                        />
                    </InputContainer>
                )}
                {unregistered && (
                    <InputContainer htmlFor="Name">
                        <input
                            required
                            autoFocus
                            autoComplete="off"
                            className=" "
                            type="text"
                            name="Name"
                            id="Name"
                            placeholder="Client Name"
                        />
                    </InputContainer>
                )}
                {unregistered && (
                    <InputContainer htmlFor="Gender">
                        <select
                            className=" "
                            type="select"
                            name="Gender"
                            id="Gender"
                            placeholder="gender"
                        >
                            <option value=""></option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </InputContainer>
                )}

                <ButtonSubmit
                    title={
                        unregistered ? (
                            <>
                                <IconSmall
                                    src="/public/images/doneall.svg"
                                    alt=""
                                />
                                register
                            </>
                        ) : (
                            <>
                                <IconSmall
                                    src="/public/images/search.svg"
                                    alt=""
                                />{" "}
                                check{" "}
                            </>
                        )
                    }
                />
                <button
                    className=" float-right  bg-red-500  "
                    type="button"
                    onClick={clearForm}
                >
                    <IconSmall src="/public/images/close.svg" />
                    clear
                </button>
            </BasicForm>
        </div>
    );
    function clearForm() {
        setunregistered(null);
        document.querySelectorAll("form").forEach((value) => value.reset());
    }
}
