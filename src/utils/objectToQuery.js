export function objectToQuery(objin, separator = "&",quote="") {
    if (!objin) {
        console.log("ObjectToQuery: invalid object");
        return "";
    }
    let qqsrt = "";
    Object.keys(objin).map((key, ind) => {
        if (objin[key]) qqsrt = qqsrt.concat(`${separator}${key}=${quote}${objin[key]}${quote}`);
    });
    if (qqsrt.length) qqsrt = qqsrt.slice(1);
    return qqsrt;
}
