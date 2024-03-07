import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { _utilFunction } from "../utils/_utilFunctions";

/**
 *
 * @param {object} defaultParams search params that are passed or parsed from or to search params and params state
 * @returns params:params state, setSingleParams([key,value]),setParams()
 */
export default function useSearchParamsWithState(defaultParams = {}) {
    // let curloc = new URL(document.location.href);
    const [searchParams, setSearchParams] = useSearchParams();
    const keys = Object.keys(defaultParams);
    keys.forEach((key) => {
        defaultParams[key] = searchParams.get(key) || defaultParams[key];
    });

    const [params, setParams] = useState(defaultParams);
    function setSingleParams([key = "ignore", value = "null"]) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, value);
        setSearchParams(newSearchParams);
        setParams({ ...params, [key]: value });
    }
    function setAllParams() {
        const newSearchParams = new URLSearchParams(searchParams);
        setSearchParams(newSearchParams);
        setParams({ ...defaultParams, ...newSearchParams });
    }
    useEffect(() => {
        setAllParams();
    }, [searchParams]);
    return [params, setSingleParams, setAllParams];
}
