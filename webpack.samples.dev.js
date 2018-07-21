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
    filename: "bundle.js"
  },

  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist"),
    compress: true
  },

  resolve: {
    alias: {
      "rc-notifications": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"),
      samples: path.resolve(__dirname, "samples"),
      tests: path.resolve(__dirname, "tests")
    },
    extensions: [".js", ".css", ".scss"]
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ["babel-loader"],
      exclude: /node_modules/
    }, {
      test: /\.(css|scss)$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "sass-loader" }
      ]
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