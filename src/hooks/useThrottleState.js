import { useEffect, useState } from "react";

let timeout1,
    waitingtimeout1,
    timeoutvalue1 = {};
export function useThrottleState(statein = {}, time_ms = 1000) {
    const [tstate, setTstate] = useState(statein);
    function throttleTstate(valuein) {
        timeoutvalue1 = valuein;
        if (timeout1) return (waitingtimeout1 = timeout1);

        timeout1 = setTimeout(() => {
            if (timeout1 === waitingtimeout1) {
                // has changed during timeout
                timeout1 = undefined;
                throttleTstate(timeoutvalue1);
            } else {
                timeout1 = undefined;
            }
        }, time_ms);
        setTstate(timeoutvalue1);
    }
    useEffect(() => {
        throttleTstate(statein);
    }, [statein]);

    return { tstate, throttleTstate, setTstate };
}
