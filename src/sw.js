var settings = { status: "local" };

import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute, Route } from "workbox-routing";
// import {} from 'workbox-cli';
// import workbox from 'workbox-cli'
import {
    NotificationClickManager,
    NotificationManager,
} from "../pwa/NotificationManager";
import precache_list from "./precache_list.json";
import {
    NetworkFirst,
    NetworkOnly,
    CacheFirst,
    CacheOnly,
    StaleWhileRevalidate,
} from "workbox-strategies";
const wbs = {
    NetworkFirst,
    NetworkOnly,
    CacheFirst,
    CacheOnly,
    StaleWhileRevalidate,
};
// expiration
const expiration_2m = new ExpirationPlugin({
    // two monthes  m *  h * d  * m
    maxAgeSeconds: 60 * 60 * 24 * 30 * 2,
    maxEntries: 400,
});
const cachinglists = [
    {
        strategy: "NetworkFirst",
        path: /\/api\/getsingle\/jobinfo_full\//,
        cacheName: "jobs_cache",
    },
    {
        strategy: "CacheFirst",
        path: /\/files\/image\/cars/,
        cacheName: "image_cars_cache",
    },
    {
        strategy: "NetworkFirst",
        path: /\/api\/getsingle\/car/,
        cacheName: "cars_cache",
    },
    {
        strategy: "NetworkFirst",
        path: /\/api\/getsingle\/client/,
        cacheName: "client_cache",
    },
    {
        strategy: "NetworkFirst",
        path: /\/api\/getlist\/report\/transactions/,
        cacheName: "report_transactions_cache",
    },
    {
        strategy: "NetworkFirst",
        path: /\/api\/getlist/,
        cacheName: "list_others_cache",
    },
    {
        strategy: "CacheOnly",
        path: /\/local\/notification_chunks/,
        cacheName: "notification_chunks_cache",
    },
    { strategy: "CacheOnly", path: /\/local/, cacheName: "local_only" },
    {
        strategy: "StaleWhileRevalidate",
        path: /\/api\/presets/,
        cacheName: "list_presets",
    },
    {
        strategy: "NetworkOnly",
        path: /\/api\/getlist\/report\/sendtoadmin/,
        cacheName: "force_online",
    },
];
// precache static files
precacheAndRoute(self.__WB_MANIFEST);
precacheAndRoute(precache_list);
// precache navigaion
// export const navigationRoutes =
registerRoute(
    // navigationRoutes
    new NavigationRoute(createHandlerBoundToURL("index.html"), {
        denylist: [/\/api/],
        allowlist: [/^\/$/, /\/nav/],
    })
);
for (const ele of cachinglists) {
    registerRoute(
        new Route(
            ({ url }) => {
                return (
                    settings.status !== "local" && url.pathname.match(ele.path)
                );
            },
            new CacheOnly({
                cacheName: ele.cacheName,
                Plugin: [expiration_2m],
            })
        )
    );
}

for (const ele of cachinglists) {
    registerRoute(
        new Route(
            ({ url }) => {
                return url.pathname.match(ele.path);
            },
            new wbs[ele.strategy]({
                cacheName: ele.cacheName,
                Plugin: [expiration_2m],
            })
        )
    );
}
// precache list of files

// registerRoute(jobsCache);
// registerRoute(reportsRoute);
// registerRoute(AllListsRoutes);
// registerRoute(LocalNotificationRoute);
// registerRoute(AllLocalRoutes);
// registerRoute(presetsRoute);
// registerRoute(ignoreRoute);

self.addEventListener("push", NotificationManager);
self.addEventListener("notificationclick", NotificationClickManager, false);
self.navigator.connection.addEventListener("change", (event) => {
    const connecType = self.navigator.connection;
    console.log("connection change", connecType);
});
self.addEventListener("message", hadleMessage);
// self.addEventListener("install", (event) => {
//     try {
//         let ans = confirm("Found an update.\nInstall Now ?");
//         if (ans) {
//             self.skipWaiting();
//             console.warn("serviceworker installation skipped");
//         }
//     } catch (error) {
//         console.warn("error during skipping ", error);
//     }
// });

// precache([

//     // "/api/getlist/client",
//     // "/api/getlist/appt",
//     // "/api/getlist/car",
//     // "/api/getlist/carbody",
//     // "/api/getlist/list_region",
//     // "/api/getlist/checkin",
//     // "/api/getlist/jobtransaction/:id",
//     // "/api/getlist/report/transactions",
//     // "/api/getlist/transaction/history",
//     // "/api/getlist/transaction/employees_balance",
//     // "/api/getlist/transaction/internal_balance",
//     // "/api/getlist/accounts",
//     // "/api/getlist/stocks",
// ]);

// routes to be cached
// "/api/getlist",
// "/api/getsingle",
// "/api/presets",
// "/api/transaction",
// "/api/notification",

// A new route that matches same-origin image requests and handles
// them with the cache-first, falling back to network strategy:

// self.addEventListener("online", (event) => {
//     console.log("you are online");
// });
// self.addEventListener("offline", (event) => {
//     console.warn("you are offline");
// });
async function hadleMessage(event) {
    const { name, value } = event.data;
    if (name === "status" && value) {
        settings[name] = value;
        console.log("status:", value);
    }
}
