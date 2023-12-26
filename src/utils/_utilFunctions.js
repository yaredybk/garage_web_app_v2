/**
 * Return: date of today in "2023-11-25" form
 */
function today() {
    let curloc = new URL(document.location.href);
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
}

export const _utilFunction = { today };
