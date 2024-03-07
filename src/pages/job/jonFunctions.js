export function extractBalanceSubnetByIdaccount(arrayin) {
    let tmp = [];
    let tmptotal = {};
    // console.log(arrayin);
    try {
        arrayin?.forEach((obj1, ind) => {
            let { name, idaccount, reason, amount } = obj1;
            if (
                ![
                    "service",
                    "tojob",
                    "sharedservice",
                    "sharedtojob",
                    "sharedfromjob",
                ].includes(reason)
            )
                return;
            let operator = {
                service: 1,
                tojob: 1,
                sharedservice: 1,
                sharedtojob: 1,
                sharedfromjob: -1,
            };
            let newnet = operator[reason] * Number(amount);
            if (!tmp.includes(idaccount)) {
                tmp.push(idaccount);
                tmptotal[idaccount] = { subtotal: newnet, name };
            } else {
                let pp = tmptotal[idaccount].subtotal;
                tmptotal[idaccount] = { subtotal: pp + newnet, name };
            }
        });
        Object.keys(tmptotal).forEach((key) => {
            if (!tmptotal[key].subtotal) {
                delete tmptotal[key];
            }
        });
    } catch (error) {
        console.log("unable to extract balance", error);
    }
    // console.log("ext bal: ",tmptotal);
    return tmptotal;
}
export function shareBalanceToAccounts(accounts, amountin, keyToBefirst) {
    let accountstmp = accounts;
    let amounttmp = amountin;
    let tmporder = [];
    try {
        
    } catch (error) {
        console.log("unable to share balance",error);
    }
    if (keyToBefirst) {
        tmporder.push(keyToBefirst);
        Object.keys(accounts).forEach((key) => {
            if (key == keyToBefirst) return;
            if (!tmporder.includes(key)) tmporder.push(key);
        });
    } else {
        Object.keys(accounts).forEach((key) => {
            if (!tmporder.includes(key)) tmporder.push(key);
        });
    }
    // console.log(tmporder);
    tmporder.forEach((key) => {
        if (!amounttmp) {
            accountstmp[key].shared = 0;
            return;
        }
        amounttmp -= accounts[key].subtotal;
        if (amounttmp >= 0) {
            //remaining >0
            accountstmp[key].shared = accounts[key].subtotal;
        } else {
            accountstmp[key].shared = accounts[key].subtotal + amounttmp;
            amounttmp = 0;
        }
    });
    return { accounts: accountstmp, order: tmporder };
}
// module.exports = { extractBalanceSubnetByIdaccount, shareBalanceToAccounts };
