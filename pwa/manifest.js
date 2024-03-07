export const manifest = {
    name: "Dainel garage system",
    short_name: "Daniel Garage",
    start_url: "/",
    display: "standalone",
    background_color: "#9c38ee",
    lang: "en",
    scope: "/",
    description: "Complete garage management service",
    id: "/",
    theme_color: "#9c38ee",
    icons: [
        {
            src: "/pwa/android/android-launchericon-512-512.png",
            sizes: "512x512",
        },
        {
            src: "/pwa/android/android-launchericon-192-192.png",
            sizes: "192x192",
        },
        {
            src: "/pwa/android/android-launchericon-144-144.png",
            sizes: "144x144",
        },
        {
            src: "/pwa/android/android-launchericon-96-96.png",
            sizes: "96x96",
        },
        {
            src: "/pwa/android/android-launchericon-72-72.png",
            sizes: "72x72",
        },
        {
            src: "/pwa/android/android-launchericon-48-48.png",
            sizes: "48x48",
        },
    ],
    orientation: "portrait",
    categories: ["productivity", "Business", "Finance"],
    prefer_related_applications: false,
    related_applications: [],
    shortcuts: [
        {
            name: "Daily report report page",
            short_name: "Report",
            description: "Daily report report page",
            url: "/nav/report/today",
        },
    ],
    screenshots: [
        {
            src: "/public/danielgarage1.PNG",
            sizes: "640x480",
            type: "image/png",
        },
    ],
    splash_screens: [
        {
            src: "/public/danielgaragemini2.PNG",
            sizes: "160x160",
            type: "image/png",
        },
    ],
    share_target: {
        action: "/api/share-target/",
        method: "POST",
        enctype: "multipart/form-data",
        params: {
            title: "title",
            text: "text",
            url: "url",
            files: [
                {
                    name: "photo",
                    accept: [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        ".jpeg",
                        ".png",
                        ".jpg",
                    ],
                },
                {
                    name: "pdf",
                    accept: ["application/pdf", ".pdf"],
                },
            ],
        },
    },
    theme_display: "fullscreen",
    developer: {
        name: "Yared Bekuru",
        email: "yb12ybk@gmail.com",
    },
    permissions: [],
    actions: [
        {
            action: "Share",
            title: "Share this app",
            url: "/share",
        },
    ],
    serviceworker: {
        script: "/sw.js",
    },
    version: "2.0.0",
};
