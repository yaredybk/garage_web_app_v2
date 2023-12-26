import { ExpirationPlugin } from "workbox-expiration";
import { Route } from "workbox-routing";
import {
    NetworkFirst,
    NetworkOnly,
    CacheFirst,
    CacheOnly,
    StaleWhileRevalidate,
} from "workbox-strategies";
// expiration
const expiration_2m = new ExpirationPlugin({
    // two monthes  m *  h * d  * m
    maxAgeSeconds: 60 * 60 * 24 * 30 * 2,
    maxEntries: 400,
});

// presets
export const presetsRoute = new Route(
    ({ url }) => {
        return url.pathname.match(/\/api\/presets/);
    },
    new NetworkFirst({
        cacheName: "list_presets",
    })
);

// singleRouter.route("/client").get(getclient);
// singleRouter.route("/appt").get(getappt);
// singleRouter.route("/car").get(getcar);
// singleRouter.route("/checkin/:id").get(getcheckin);
// singleRouter.route("/job/:id").get(getcheckin);

//  cars
export const carsCache = new Route(
    ({ url }) => {
        //                          /api/getlist/jobtransaction/
        return url.pathname.match(/\/api\/getlist\/client\//);
    },
    new NetworkFirst({
        cacheName: "cars_cache",
        Plugin: [expiration_2m],
    })
);
// jobs
export const job_transactionCache = new Route(
    ({ url }) => {
        //                          /api/getlist/jobtransaction/
        return url.pathname.match(/\/api\/getlist\/jobtransaction\//);
    },
    new NetworkFirst({
        cacheName: "job_transaction_cache",
        Plugin: [expiration_2m],
    })
);
// reports
export const reportsRoute = new Route(
    ({ url }) => {
        return url.pathname.match(/\/api\/getlist\/report\/transactions/);
    },
    new NetworkFirst({
        cacheName: "report_transactions",
        Plugin: [expiration_2m],
    })
);
// do not cache routes
export const ignoreRoute = new Route(
    ({ url }) => {
        return url.pathname.match(/\/api\/getlist\/report\/sendtoadmin/);
    },
    new NetworkOnly({
        cacheName: "force_online",
    })
);
// list routes
export const AllListsRoutes = new Route(
    ({ url }) => {
        return url.pathname.match(/\/api\/getlist/);
    },
    new NetworkFirst({
        cacheName: "list_others",
    })
);
// only cache routes
export const LocalNotificationRoute = new Route(
    ({ url }) => {
        return url.pathname.match(/\/local\/notification_chunks/);
    },
    new CacheOnly({
        cacheName: "notification_chunks",
    })
);
export const AllLocalRoutes = new Route(
    ({ url }) => {
        return url.pathname.match(/\/local/);
    },
    new CacheOnly({
        cacheName: "local_only",
    })
);
