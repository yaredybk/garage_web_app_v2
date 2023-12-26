import axios from "axios";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { axioslinks, payment_method, transaction_in } from "../preset/Var.js";

const dbLink = axioslinks.devDbLink;
export default function Transact({ downPreset = null }) {
    let typesList =["IN","OUT","Transfer"];
    const [allinfo, setAllinfo] =useState({
        from: null,
        fromref: null,
        to: null,
        toref: null,
        amount: null,
        reason: null,
        fbalance: null,
        tbalance: null,
        type:typesList[0]
    }) ;
    return (
        <Routes>
            <Route path="/out" element={renderOut()} />
            <Route path="/in" element={renderIn()} />
            <Route path="/account" element={transferFromTo()} />
        </Routes>
    );
    function renderSelect(fromto, from = allinfo?.from, to = allinfo?.to) {
        switch (fromto) {
            case "to":
                return (
                    <select
                    required
                        className="  p-2 px-4"
                        name="refno"
                        id="refno"
                        onChange={(e) => {
                            let val = e.target.value;
                            if (!isNaN(val)) {
                                getBalance(allinfo?.to, 1, val);
                            } else {
                                setAllinfo({
                                    ...allinfo,
                                    toref: null,
                                    tbalance: null,
                                });
                            }
                        }}
                        //    value={ formpaymentmethod}
                    >
                        <option value={""} disabled selected>select </option>
                        {to === 4
                            ? downPreset?.list_stock.map((obj, i) => (
                                  <option
                                      key={obj?.name + obj?.id}
                                      value={obj.id}
                                  >
                                      {obj.name}
                                  </option>
                              ))
                            : downPreset?.list_agent.map((obj, i) => (
                                  <option
                                      key={obj?.name + obj?.id}
                                      value={obj.id}
                                  >
                                      {obj.name}
                                  </option>
                              ))}
                    </select>
                );
            case "from":
                return (
                    <select
                    required
                        className=" p-2 px-4"
                        name="refno"
                        id="refno"
                        // onChange={(e) => {
                        //     // makeTransaction(1, e.target.value, obj.id);
                        //     // setformPaymentmethod(e.target.value)
                        // }}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (!isNaN(val)) {
                                getBalance(allinfo?.from, 0, val);
                            } else {
                                setAllinfo({
                                    ...allinfo,
                                    fromref: null,
                                    fbalance: null,
                                });
                            }
                        }}
                        //    value={ formpaymentmethod}
                    >
                    <option value={""} disabled selected>select </option>
                        {from === 4
                            ? downPreset?.list_stock.map((obj, i) => (
                                  <option
                                      key={obj?.name + obj?.id}
                                      value={obj.id}
                                  >
                                      {obj.name}
                                  </option>
                              ))
                            : downPreset?.list_agent.map((obj, i) => (
                                  <option
                                      key={obj?.name + obj?.id}
                                      value={obj.id}
                                  >
                                      {obj.name}
                                  </option>
                              ))}
                    </select>
                );
                break;

            default:
                break;
        }
    }
    function renderIn() {
        return (
            <div className=" bg-slate-300 rounded-md m-auto">
                <section>
                    <header>
                        <h1>ገቢ መመዝገቢያ</h1>
                        <br />
                    </header>
                    <form
                        id="transactout"
                        onSubmit={(e) => {
                            e.preventDefault();
                            let desc = e.target.desc.value;
                            let amount = e.target.amount.value;
                            let method = e.target.method.value;
                            let dataa = {
                                desc: desc,
                                amount: amount,
                                method: method,
                            };
                            axios
                                .post(`${dbLink}/transactin`, dataa)
                                .then((res) => {
                                    document
                                        .getElementById("transactout")
                                        .reset();
                                })
                                .catch((err) => {
                                    window.alert(
                                        "ERROR: unable to make a transaction"
                                    );
                                    console.log(err);
                                });
                        }}
                        className="grid p-1 gap-2 "
                    >
                        <div className=" grid justify-between  p-1">
                            <label htmlFor="desc">description</label>
                            <textarea
                                className="p-1"
                                type="text"
                                name="desc"
                                id="desc"
                            />
                        </div>
                        <div className=" grid justify-between  p-1">
                            <label htmlFor="amount">amount</label>
                            <input
                                className="p-1"
                                type="text"
                                name="amount"
                                id="amount"
                            />
                        </div>

                        {/* select */}
                        <div className="grid items-stretch justify-around">
                            <label htmlFor="method">method</label>
                            <select
                                defaultValue={5}
                                name="method"
                                id="method"
                                onChange={(e) => {
                                    // console.log(e.target.value);
                                    // makeTransaction(1, e.target.value, obj.id);
                                }}
                            >
                                {downPreset?.payment_types?.map((obj, i) =>
                                    obj.id > 4 ? (
                                        <option key={obj.desc} value={obj.id}>
                                            {obj.desc}
                                        </option>
                                    ) : null
                                )}
                            </select>
                        </div>
                        <div className=" grid place-items-center">
                            <button className=" bg-blue-500 m-auto p-1 px-3">
                                <b>Submit</b>
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
    function renderOut() {
        return (
            <div className=" bg-slate-300 rounded-md m-auto">
                <section>
                    <header>
                        <h1>ወጪ መመዝገቢያ</h1>
                        <br />
                    </header>
                    <form
                        id="transactout"
                        onSubmit={(e) => {
                            e.preventDefault();
                            let desc = e.target.desc.value;
                            let amount = e.target.amount.value;
                            let method = e.target.method.value;
                            let dataa = {
                                desc: desc,
                                amount: amount,
                                method: method,
                            };
                            axios
                                .post(`${dbLink}/transactout`, dataa)
                                .then((res) => {
                                    document
                                        .getElementById("transactout")
                                        .reset();
                                })
                                .catch((err) => {
                                    window.alert(
                                        "ERROR: unable to make a transaction"
                                    );
                                    console.log(err);
                                });
                        }}
                        className="grid p-1 gap-2 "
                    >
                        <div className=" grid justify-between  p-1">
                            <label htmlFor="desc">description</label>
                            <textarea
                                className="p-1"
                                type="text"
                                name="desc"
                                id="desc"
                            />
                        </div>
                        <div className=" grid justify-between  p-1">
                            <label htmlFor="amount">amount</label>
                            <input
                                className="p-1"
                                type="text"
                                name="amount"
                                id="amount"
                            />
                        </div>
                        <div className="grid items-stretch justify-around">
                            <label htmlFor="method">method</label>
                            <select
                                defaultValue={5}
                                name="method"
                                id="method"
                                onChange={(e) => {
                                    // console.log(e.target.value);
                                    // makeTransaction(1, e.target.value, obj.id);
                                }}
                            >
                                {downPreset?.payment_types?.map((obj, i) =>
                                    obj.id > 4 ? (
                                        <option key={obj.desc} value={obj.id}>
                                            {obj.desc}
                                        </option>
                                    ) : null
                                )}
                            </select>
                        </div>
                        <div className=" grid place-items-center">
                            <button className=" bg-blue-500 m-auto p-1 px-3">
                                <b>Submit</b>
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
    function getBalance(acc = null, fromto = null, which = null) {
        
        axios
            .get(`${dbLink}/balance/${acc}?ref=${which ? which : -10}`)
            .then((res) => {
                switch (fromto) {
                    case 0:
                        setAllinfo({
                            ...allinfo,
                            fbalance: res.data?.balance,
                            from:acc,
                            fromref:which
                        });
                        break;
                    case 1:
                        setAllinfo({
                            ...allinfo,
                            tbalance: res.data?.balance,
                            to:acc,
                            toref:which
                        });
                        break;

                    default:
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
                switch (fromto) {
                    case 0:
                        setAllinfo({ ...allinfo, fbalance: null,from:null,fromref:null });
                        break;
                    case 1:
                        setAllinfo({ ...allinfo, tbalance: null,to:null,toref:null });
                        break;

                    default:
                        break;
                }
            });
    }
    function transferFromTo() {
        return (
            <form
                id="form"
                className=" grid gap-5 bg-slate-300 rounded-md p-1 py-4 max-w-full max-h-fit h-fit"
                onSubmit={(e) => {
                    e.preventDefault();
                    let obj = {...allinfo};
                    axios
                        .post(`${dbLink}/transfer`, obj)
                        .then((res) => {
                            let form = document.querySelector("#form");
                            form.reset();
                            setAllinfo({...allinfo,
                                from: null,
                                fromref: null,
                                to: null,
                                toref: null,
                                amount: null,
                                reason: null,
                                fbalance: null,
                                tbalance: null,
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }}
            >
                <div className="grid grid-cols-3 gap-1 p-1">
                    {
                        typesList.map((val,key)=>(
                            <button type="button" onClick={()=>
                                setAllinfo({
                                    from: null,
                                    fromref: null,
                                    to: null,
                                    toref: null,
                                    amount: null,
                                    reason: null,
                                    fbalance: null,
                                    tbalance: null,
                                    type:val
                                })
                            } className={allinfo.type == val ? "bg-blue-800 text-white font-bold w-full":" bg-blue-300 w-full"}>{val}</button>

                        ))
                    }
                </div>
                {/* from */}
                {allinfo.type != typesList[0] &&
                <section className=" flex gap-2 p-1 max-sm:grid">
                    <label className="w-16 py-2">
                        <b>From</b>
                    </label>
                    <select
                        required
                        onChange={(e) => {
                            let val = Number(e.target.value);
                            if (val == 4 || val == 7) {
                                setAllinfo({
                                    ...allinfo,
                                    fbalance: null,
                                    from: val,
                                });
                            } else 
                            if (val) {
                                getBalance(val, 0);
                            } else {
                                setAllinfo({
                                    ...allinfo,
                                    from: null,
                                    fbalance: null,
                                });
                            }
                        }}
                        className="p-2 px-4"
                        name="From"
                        id="From"
                    >
                    <option value=""  selected>select </option>
                        {downPreset?.payment_types?.map((val) =>
                            val.id < 4 ? null : (
                                <option key={val.desc} value={val.id}>
                                    {val.desc}
                                </option>
                            )
                        )}
                    </select>
                    {allinfo?.from == 4 || allinfo?.from == 7
                        ? renderSelect("from")
                        : <span className=" w-28 p-1 bg-slate-300 outline outline-1 outline-slate-400" ></span>}
                    <input
                        type="text"
                        required
                        readOnly
                        className="bg-slate-200 px-2"
                        name="fbalance"
                        // hidden
                        size={8}
                        value={allinfo?.fbalance && allinfo.fbalance }
                    />
                </section>
                }
                {/* to */}
                {allinfo.type != typesList[1] &&
                <section className=" flex gap-2 p-1 max-sm:grid">
                    <label className="w-16 py-2">
                        <b>To</b>
                    </label>
                    <select
                        required
                        onChange={(e) => {
                            let val = Number(e.target.value);
                            if (val === 4 || val === 7) {
                                setAllinfo({
                                    ...allinfo,
                                    tbalance: null,
                                    to: val,
                                });
                            } else if (val) {
                                getBalance(val, 1);
                            } else {
                                setAllinfo({
                                    ...allinfo,
                                    from: null,
                                    tbalance: null,
                                });
                            }
                        }}
                        className=" p-2 px-4"
                        name="To"
                        id="To"
                    >
                    <option value="" selected>select </option>
                        {downPreset?.payment_types?.map((val) =>
                            val.id < 4 ? null : (
                                <option key={val.desc} value={val.id}>
                                    {val.desc}
                                </option>
                            )
                        )}
                    </select>
                    {allinfo?.to === 4 || allinfo?.to === 7
                        ? renderSelect("to")
                        : <span className=" w-28 p-1 bg-slate-300 outline outline-1 outline-slate-400" ></span>}
                    <input
                        type="text"
                        readOnly
                        className=" bg-slate-200 px-2"
                        name="tbalance"
                        size={8}
                        value={allinfo?.tbalance && allinfo.tbalance }
                    />
                </section>}
                <section className=" flex gap-2 p-1 max-sm:grid">
                    <label className="w-16 py-2">
                        <b>reason</b>
                    </label>
                    <input
                    type="text"
                        onChange={(e)=>{
                            setAllinfo({...allinfo,reason:e.target.value})
                        }}
                        className=" p-1"
                        name="reason"
                        id="reason"
                        required
                    ></input>
                </section>
                <section className=" flex gap-2 p-1 max-sm:grid">
                    <label className="w-16 py-2">
                        <b>Amount</b>
                    </label>
                    <input
                        className=" p-1"
                        type="number"
                        inputMode="numeric"
                        name="amount"
                        id="amount"
                        // size={8}
                        required
                        onChange={(e)=>{
                            setAllinfo({...allinfo,amount:e.target.value})
                        }}
                    />
                    <span className="py-1" >birr</span>
                </section>
                <button
                    className=" bg-blue-500 p-2 px-6 font-extrabold"
                    type="submit"
                >
                    Apply
                </button>
            </form>
        );
    }
}
