import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../context/GlobalContext";

export default function CarMakeList() {
    const { list_carmake } = useContext(GlobalState);

    return (
        <datalist id="carmakelist">
            {list_carmake?.map((carmakeobj, ind) => (
                <option
                    key={carmakeobj?.make}
                    value={carmakeobj?.make}
                ></option>
            ))}
        </datalist>
    );
}
