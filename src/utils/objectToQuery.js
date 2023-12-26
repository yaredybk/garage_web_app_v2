export function objectToQuery(objin) {
    if (!objin) {
        console.log("ObjectToQuery: invalid object");
        return "";
    }
    let qqsrt = "";
    Object.keys(objin).map((key, ind) => {
        qqsrt = qqsrt.concat("&", key, "=", objin[key]);
    });
    qqsrt = qqsrt.replace(/^&/, "");
    return qqsrt;
}
