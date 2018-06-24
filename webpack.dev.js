const path = require("path");

module.exports = {
  mode: "development",

  entry: "./src/react-notification-component.js",

  devtool: "cheap-module-source-map",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-notifications-component.js",
    library: "ReactNotifications",
    libraryTarget: "commonjs2"
  },

  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ["babel-loader"],
      include: /src/
    }, {
      test: /\.(js|jsx)$/,
      use: ["eslint-loader"],
      include: /src/
    }]
  },

  externals: {
    "react": {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM"
    }
  }
};