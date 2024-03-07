import { useContext, useEffect, useState } from "react";
import { GetData } from "../utils/xaxios";
import { LoadingState } from "../context/LoadingContext";
/**
 * data fetching hook
 * @param {string} url url link to fetch the data
 * @param {any} datain initial data in
 * @param {boolean} effect if true fetch data at useEffect
 * @returns {data:any,setData:function,refetchData:function}
 */
export function useEffectStateSingleData(url = null, datain = undefined,effect=true) {
    const { setLoad } = useContext(LoadingState);
    const [data, setData] = useState(datain);
    // if (!url) {
    //     return { data, setData: () => null, refetchData: () => null };
    // }
    useEffect(() => {
        if (url && effect) refetchData();
    }, [url]);
    function refetchData() {
        if(url)
        GetData(url, setLoad).then(setData).catch(console.warn);
    }
    return { data, setData, refetchData };
}
