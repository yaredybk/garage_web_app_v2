import { createContext, useState } from "react";
// import { useEffectStateArrayData } from "../hooks/EffectStateArrayData";
import { useEffectStateSingleData } from "../hooks/EffectStateSingleData";

export const GlobalState = createContext({
    list_carmake: null,
    list_carmodel: null,
    list_region: null,
    list_carbodyparts: null,
    list_accounts: null,
    list_stock: null,
    refetchPreset: () => null,
});

export default function GlobalContext({ children }) {
    // const [load, dispatch] = useReducer(loadingReducer, false);
    const [load, setLoad] = useState(false);
    const { data, refetchData } = useEffectStateSingleData("/api/presets");
    return (
        <GlobalState.Provider value={{ ...data, refetchPreset: refetchData }}>
            {children}
        </GlobalState.Provider>
    );
}
