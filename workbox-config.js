module.exports = {
    globDirectory: "dist/",
    globPatterns: ["**/*.{js,css,PNG,otf,ttf,html,svg,jpg,png,webp,gif}"],
    swDest: "dist/sw.js",
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^source/],
};
