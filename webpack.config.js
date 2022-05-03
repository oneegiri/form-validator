const path = require("path");

module.exports = {
    mode: "development", //production
    entry: {
        main: path.resolve(__dirname, "assets/main.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "validator.min.js", //"[name].[contenthash].min.js"
        assetModuleFilename: "[name][ext]",
        clean: true,
    },
    devtool: "inline-source-map"
};
