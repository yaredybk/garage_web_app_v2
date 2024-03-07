// import axios from "axios";

import xaxios from "../../utils/xaxios";

// import { axioslinks } from "../../preset/Var";
const searchForOptions = ["cars", "clients"];
// , "jobs"
const usingOptions = [
    ["plate", "idcar", "idclient"],
    ["phoneno", "idclient", "name"],
];
// ["job_id", "car_id"],

/**
 * @param {object} obj input object to check
 * @returns true if object has key else false
 */
function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}

// const promise1 = new Promise((resolve, reject) => {
//   resolve('Success!');
// });

// promise1.then((value) => {
//   console.log(value);
//   // Expected output: "Success!"
// });

async function advanced_search_1({
    searchfor = null,
    searchValue = null,
    using = null,
    where = {},
}) {
    // console.log(searchfor, searchValue, using);
    // if (!(searchfor && searchValue && using))
    //     return new Promise(function (resolve, reject) {
    //         /* stuff using username, password */
    //         reject("invalid data");
    //     });
    return xaxios
        .post(
            `/api/search/advanced/level_1?searchfor=${searchForOptions[searchfor]}&using=${usingOptions[searchfor][using]}&searchValue=${searchValue}`,
            where
        )
        .then((data) => {
            // let { data } = res;
            // console.log(data);
            return data;
        })
        .catch((err) => {
            console.warn(err);
            return null;
        });
}

export { advanced_search_1, searchForOptions, usingOptions };
