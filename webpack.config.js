// const path = require("path");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HTMLWebpackPlugin = require("html-webpack-plugin");
import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";

module.exports = {
    mode: "development",
    entry: ["@babel/polyfill", "./public/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].js",
        publicPath: "/",
    },
    devServer: {
        inline: false,
        historyApiFallback: true,
        port: 3000,
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new HTMLWebpackPlugin({ template: "./public/index.html" }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(jpg|jpeg|png|svg)/,
                use: ["file-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-env",
                            {
                                plugins: ["@babel/plugin-proposal-class-properties"],
                            },
                        ],
                    },
                },
            },
            {
                test: /\.(eot|gif|otf|ttf|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: ["file-loader"],
            },
        ],
    },
};
