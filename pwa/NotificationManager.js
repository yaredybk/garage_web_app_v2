// list of possible notifications and there tag
// const typesofNotifications = {
//     dailyReport: {
//         title: "Daily report",
//         body: "date: --/--/----",
//         tag: "daily report",
//         icon: "/public/danielgaragemini2.PNG",
//         badge: "/public/images/sync.webp",
//         silent: false,
//     },
//     dailyReport: {
//         title: `daniel garage`,
//         body: `syncing data`,
//         tag: `syncing data`,
//         icon: "/public/danielgaragemini2.PNG",
//         badge: "/public/images/sync.webp",
//         silent: true,
//     },
// };
function extractnotificationData(dd) {
    let nodatatext = "your server did not send any message!";
    let body;
    try {
        let txt = "";
        txt = dd.text();
        if (txt[0] === "#" && txt[1] == "#") {
            txt = txt.slice(2);
            let decompose = txt.split("##");
            dd = JSON.parse(decompose[0]);
            dd.data = decompose[1];
            body = dd?.body ? dd.body : nodatatext;
        } else if (txt[0] === "{") {
            dd = dd.json();
            body = dd?.body ? dd.body : nodatatext;
        } else {
            dd = txt;
            body = dd || nodatatext;
        }
        dd.body = body;
        return dd;
    } catch (error) {
        console.warn(error);
        body = nodatatext;
        return null;
    }
}
export function NotificationManager(e) {
    // self.ServiceWorkerRegistration.sendNotification("test1",{})
    let dd = e.data;
    if (!dd) {
        return console.warn("no data");
    }
    const title = dd.title || "no title";
    dd = extractnotificationData(dd);
    if (dd.data) {
        if (!dd.data.navPath)
            dd.data.navPath = title.includes("report")
                ? "/nav/report/today"
                : "/nav/notification/list";
        if (dd.data.dontnotify) {
            dd.dontnotify = true;
        }
    }
    const options_1 = {
        silent: dd.silent || false,
        tag: dd.tag || "No-data" + Date.now(),
        icon: dd.icon || "/public/danielgaragemini2.PNG",
        badge: dd.badge || "/public/danielgaragemini2.PNG",
        data: dd.data || {
            time: new Date(Date.now()).toString(),
            message: "No data found from server !",
        },
        ...dd,
    };
    function senedNotf(_title, _options) {
        return self.registration.showNotification(_title, _options);
    }
    let promiseChain;
    if (options_1.chunkSize && !isNaN(options_1.chunkSize)) {
        promiseChain = cache_Chunk_DataFromPush(options_1)
            .then((modifiedOptions) => {
                let tmptitle = modifiedOptions.title || title;
                if (!modifiedOptions?.dontnotify)
                    promiseChain = senedNotf(tmptitle, modifiedOptions);
            })
            .catch((modifiedOptions) => {
                let tmptitle = modifiedOptions.title || title;
                promiseChain = senedNotf(tmptitle, options_1);
            });
    }
    // normal push data with cacheName
    else if (
        options_1.data?.cacheName &&
        options_1.data?.cacheName != "dontcache"
    ) {
        promiseChain = cacheDataFromPush(options_1)
            .then((modifiedOptions) => {
                let tmptitle = modifiedOptions.title || title;
                promiseChain = senedNotf(tmptitle, modifiedOptions);
            })
            .catch((err) => {
                console.warn(err);
                promiseChain = senedNotf(title, options_1);
            });
    }
    // normal push data with cacheName
    else promiseChain = senedNotf(title, options_1);
    e.waitUntil(promiseChain);
}
async function cacheDataFromPush(datain) {
    return new Promise((resolve, reject) => {
        let { data } = datain;
        let { urlPath, reportData, cacheName } = data;
        if (!cacheName) {
            console.warn("no cacheName");
            return resolve(datain);
        }
        if (cacheName == "dontcache") {
            return resolve(datain);
        }
        if (!(urlPath && reportData)) return reject(datain);
        try {
            caches.open(cacheName).then((cache) => {
                let dd = JSON.stringify(reportData);
                const cusRes = new Response(dd, {
                    status: 200,
                    statusText: "OK",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                });

                cache
                    // find if there is old entry
                    .match(urlPath)
                    .then(async (response) => {
                        if (response) {
                            // Delete the previous entry.
                            await cache.delete(urlPath);
                        }
                        // Put the new entry in the cache.
                        return await cache.put(urlPath, cusRes);
                    })
                    .then(() => resolve(datain))
                    .catch(() => reject(datain));
            });
        } catch (error) {
            reject(datain);
            console.warn(error);
        }
    });
}
async function cache_Chunk_DataFromPush(datain) {
    return new Promise(async (resolve, reject) => {
        let { index, chunkSize, data } = datain;
        index = Number(index);
        chunkSize = Number(chunkSize);
        // first chunk
        if (index == 0) await caches.delete("notification_chunks");
        const urlPath = "/local/notification_chunks/" + index;
        const cache = await caches.open("notification_chunks");
        try {
            // last chunk
            if (index + 1 >= chunkSize) {
                // Get all of the keys in the cache.
                cache.keys().then((keysArray) => {
                    // Get the response data for each key.
                    Promise.all(
                        keysArray.map(async (key) => {
                            const response = await cache.match(key);
                            return response.text();
                        })
                    )
                        .then(async (responses) => {
                            // Do something with the response data.
                            responses.push(data);
                            if (responses.length < 1) {
                                console.warn(responses);
                                return reject("small chunk size");
                            }
                            let buildChunk = "";
                            responses.forEach((ele) => {
                                buildChunk = buildChunk.concat(ele);
                            });
                            const finalData = JSON.parse(buildChunk);
                            finalData.icon = "/public/danielgaragemini2.PNG";
                            finalData.badge = "/public/danielgaragemini2.PNG";
                            finalData.silent = false;
                            finalData.dontnotify = false;
                            return resolve(cacheDataFromPush(finalData));
                        })
                        .catch((error) => {
                            reject(datain);
                            console.warn(error);
                        });
                });
            } else {
                const cusRes = new Response(data, {
                    status: 200,
                    statusText: "OK",
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                    },
                });
                let modifiedOptions = {
                    dontnotify: index == "0" ? false : true,
                    title: `daniel garage`,
                    // body: `syncing data`,
                    tag: datain?.tag?.split("::")[0],
                    icon: "/public/danielgaragemini2title:.PNG",
                    badge: "/public/images/sync.webp",
                    silent: true,
                    ...datain,
                };
                cache
                    .put(urlPath, cusRes)
                    .then(() => resolve(modifiedOptions))
                    .catch(reject(modifiedOptions));
            }
        } catch (error) {
            reject(datain);
            console.warn(error);
        }
    });
}

export async function NotificationClickManager(event) {
    event.notification.close();
    console.log(event);

    // localStorage.setItem("lastnotification", JSON.stringify(event));
    let { title } = event.notification;
    let { navPath } = event.notification.data;
    // if (event.action === "archive") {
    // User selected the Archive action.
    // archiveEmail();
    // } else {
    let fallback = title.includes("report")
        ? "/nav/report/today"
        : "/nav/notification/list";
    let path = navPath || fallback;
    const urlToOpen = new URL(path, self.location.origin).href;
    clients.openWindow(urlToOpen);

    // const promiseChain = clients
    //     .matchAll({
    //         type: "window",
    //         // origin: self.origin,
    //         includeUncontrolled: true,
    //     })
    //     .then((windowClients) => {
    //         if (windowClients.length === 0) {
    //             clients.openWindow(urlToOpen);
    //         } else {
    //             windowClients[0]?.focus();
    //             windowClients[0]?.navigate(urlToOpen);
    //         }
    //     });
    event.waitUntil(promiseChain);
    // }
}
