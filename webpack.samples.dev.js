const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",

  entry: "./samples/js/index.js",

  devtool: "cheap-module-source-map",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "samples.js"
  },

  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist"),
    compress: true
    
    // enable this based on your network
    // host: "192.168.100.3",
    // port: 8008
  },

  resolve: {
    alias: {
      "react-notifications-component": path.resolve(__dirname, "dist/react-notifications-component.js")
    },
    extensions: [".js", ".jsx", ".json"]
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ["babel-loader"],
      include: /samples/
    }, {
      test: /\.(js|jsx)$/,
      use: ["eslint-loader"],
      include: /src/
    }, {
      test: /\.(css|scss)$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "sass-loader" }
      ],
      include: /samples/
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: ["file-loader"]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ["file-loader"]
    }]
  },

  plugins: [
    new CleanWebpackPlugin("dist/index.html", {
      watch: true,
      beforeEmit: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "./samples/html/index.html"
    }),
    new webpack.NamedModulesPlugin()
  ]
};