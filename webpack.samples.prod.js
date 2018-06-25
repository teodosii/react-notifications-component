const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",

  entry: "./samples/js/index.js",

  devtool: "source-map",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "samples.js"
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
      test: /\.(css|scss)$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
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

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./samples/html/index.html"
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};