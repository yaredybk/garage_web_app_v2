import { useContext, useEffect, useState } from "react";
import { GetData } from "../utils/xaxios";
import { checkArray } from "../utils/datacorrection";
import { LoadingState } from "../context/LoadingContext";
export function useEffectStateArrayData(url = null, defaultVal = null) {
    const [list1, setList1] = useState(defaultVal);
    const { setLoad } = useContext(LoadingState);
    // fix set load because it is starting infinte loop with other components
    function refetchData() {
        if (!url) return setList1([]);
        GetData(url, setLoad)
            .then((data) => {
                // console.log(data);
                setList1(checkArray(data));
            })
            .catch(() => {
                setList1([]);
            });
    }
    useEffect(() => {
        refetchData();
    }, [url]);
    if (!url) {
        return { list1, setList1: () => null };
    }

    return { list1, setList1, refetchData };
}
