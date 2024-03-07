import { createContext, useEffect, useState } from "react";
// import { useEffectStateArrayData } from "../hooks/EffectStateArrayData";
import { useEffectStateSingleData } from "../hooks/EffectStateSingleData";
let list_region = localStorage.getItem("list_region");
if(list_region)list_region = JSON.parse(list_region);
else
 list_region = [];
let ini1 = {
    list_carmake: [],
    list_carmodel: [],
    list_region,
    list_carbodyparts: [],
    list_accounts: [],
    list_stock: [],
    refetchPreset: () => null,
};
export const GlobalState = createContext(ini1);

export default function GlobalContext({ children }) {
    // const [load, dispatch] = useReducer(loadingReducer, false);
    const [load, setLoad] = useState(false);
    const { data, refetchData } = useEffectStateSingleData("/api/presets",ini1);
    useEffect(() => {
        if (data?.list_region) {
            localStorage.setItem("list_region", JSON.stringify(data.list_region));
        }
    }, [data]);

    return (
        <GlobalState.Provider value={{ ...data, refetchPreset: refetchData }}>
            {children}
        </GlobalState.Provider>
    );
}
