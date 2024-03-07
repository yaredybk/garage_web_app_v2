import { useContext, useEffect, useState } from "react";
/**
 * useSubTotalFunctions
 * @param {Array} list input list
 * @param {string} addcolname colomun name if sub elements are array of objects
 * @param {Number} addcolindex colomun name if sub elements are array of values
 * @returns {net1,count1, setnet1, reCalculate} result array, row count,
 *  array of subtotals orderd based on addcolname/addcolindex
 */
export function useSubTotalFunctions(
    list = [],
    addcolname = ["colname_"],
    addcolindex = [-1]
) {
    function getstate() {
        var tmp = [];
        if (addcolname && addcolname[0] != "colname_") {
            addcolname.forEach((ee) => {
                tmp.push(0);
            });
        }
        if (addcolindex && addcolindex[0] != -1) {
            addcolindex.forEach((ee) => {
                tmp.push(0);
            });
        }
        return tmp;
    }
    const [net1, setnet1] = useState(getstate);
    const [count1, setcount1] = useState(0);
    useEffect(() => {
        if (list?.length) reCalculate();
    }, [list]);

    function reCalculate() {
        if (!(list && list.length)) return;
        setcount1(list.length);
        if (addcolname[0] == "colname_" && addcolindex[0] == -1) return;
        let tmpnet = getstate();
        if (addcolname[0] != "colname_")
            list.forEach((obj) => {
                addcolname.forEach((col, ind) => {
                    tmpnet[ind] += Number(obj[col]);
                });
            });
        else if (addcolindex[0] != "colname_")
            list.forEach((obj) => {
                addcolindex.forEach((col, ind) => {
                    tmpnet[ind] += Number(obj[col]);
                });
            });
        setnet1(tmpnet);
    }
    return { net1, count1, setnet1, reCalculate };
}
/**
 * useSubTotalWithGroupFunctions
 * @param {Array} list input list
 * @param {string} addcolname colomun name if sub elements are array of objects
 * @param {Number} addcolindex colomun name if sub elements are array of values
 * @returns array of counts grouped by there values, orderd based on addcolname/addcolindex
 */
export function useCountWithGroupFunctions(
    list = [],
    addcolname = ["colname_"],
    addcolindex = [-1]
) {
    function getstate() {
        var tmp = [];
        if (addcolname && addcolname[0] != "colname_") {
            addcolname.forEach((ee) => {
                tmp.push({});
            });
        }
        if (addcolindex && addcolindex[0] != -1) {
            addcolindex.forEach((ee) => {
                tmp.push({});
            });
        }
        return tmp;
    }
    const [groupedcout1, setgroupedcout1] = useState(getstate);
    const [gcount1, setgcount1] = useState(0);
    useEffect(() => {
        if (list?.length) reCalculate();
    }, [list]);

    function reCalculate() {
        if (!(list && list.length)) return;
        setgcount1(list.length);
        if (addcolname[0] == "colname_" && addcolindex[0] == -1) return;
        let tmpnet = getstate();
        if (addcolname[0] != "colname_")
            list.forEach((obj) => {
                addcolname.forEach((col, ind) => {
                    if (Object.hasOwn(tmpnet[ind], obj[col])) {
                        tmpnet[ind][obj[col]]++;
                    } else {
                        tmpnet[ind][obj[col]] = 1;
                    }
                });
            });
        else if (addcolindex[0] != "colname_")
            list.forEach((obj) => {
                addcolindex.forEach((col, ind) => {
                    tmpnet[ind] += Number(obj[col]);
                });
            });
        setgroupedcout1(tmpnet);
    }
    return { groupedcout1, gcount1, setgroupedcout1, reCalculate };
}
