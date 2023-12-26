import { useContext, useEffect, useState } from "react";
import { GetData } from "../utils/xaxios";
import { LoadingState } from "../context/LoadingContext";
export function useEffectStateSingleData(url = null, executeRefetch = null) {
    const { setLoad } = useContext(LoadingState);
    if (!url) {
        return { data, setData: () => null, refetchData: () => null };
    }
    useEffect(() => {
        refetchData();
    }, [url]);

    useEffect(() => {
        executeRefetch && executeRefetch(() => refetchData);

        return () => {};
    }, []);
    function refetchData() {
        GetData(url, setLoad).then((data) => {
            setData(data);
        });
    }
    const [data, setData] = useState(undefined);
    return { data, setData, refetchData };
}
