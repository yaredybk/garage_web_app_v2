import { createContext, useReducer, useState } from "react";

export const LoadingState = createContext({ load: false, setLoad: () => null });
export function loadingReducer(load, action) {
    console.log(load, action);
    return load;
}
export default function LoadingContext({ children }) {
    // const [load, dispatch] = useReducer(loadingReducer, false);
    const [load, setLoad] = useState(false);
    return (
        <LoadingState.Provider value={{ load, setLoad }}>
            {children}
        </LoadingState.Provider>
    );
}
