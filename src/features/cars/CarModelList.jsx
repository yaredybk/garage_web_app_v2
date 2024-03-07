import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../context/GlobalContext";

export default function CarModelList({ carMake = "", carModel = "" }) {
    const { list_carmodel, list_carmake } = useContext(GlobalState);
    const [filteredModel, setFilteredModel] = useState(list_carmodel);
    const [filteredMake, setFilteredMake] = useState(list_carmake);
    useEffect(() => {
        if (!carMake) return setFilteredModel(list_carmodel);
        if (carMake == "") return setFilteredModel(list_carmodel);
        let ff = list_carmodel.filter(
            (obj) => obj.make?.includes(carMake) || obj.make == carMake
        );
        setFilteredModel(ff);
    }, [carMake]);
    useEffect(() => {
        if (!carModel) return;

        let ff = filteredModel.filter((obj) => obj.model == carModel);
        if (ff.length == 0)
            ff = list_carmodel.filter((obj) => obj.model == carModel);

        if (ff.length === 1) {
            const Makeinput = document.getElementById("Make");
            if (Makeinput.value === "") Makeinput.value = ff[0]?.make;
            let ff2 = list_carmodel.filter(
                (obj) => obj.make?.includes(ff[0]?.make) || obj.make == ff[0]?.make
            );
            setFilteredModel(ff2);
        }

    }, [carModel]);

    return (
        <>
            <datalist id="carmakelist">
                {filteredMake?.map((carmakeobj, ind) => (
                    <option
                        key={ind + carmakeobj?.make}
                        value={carmakeobj?.make}
                    ></option>
                ))}
            </datalist>
            <datalist id="carmodellist">
                {filteredModel?.map((carmakeobj, ind) => (
                    <option
                        key={ind + carmakeobj?.model}
                        value={carmakeobj?.model}
                    ></option>
                ))}
            </datalist>
        </>
    );
}
