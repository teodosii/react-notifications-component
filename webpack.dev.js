const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'cheap-module-source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js', 
    libraryTarget: 'umd', 
    library: 'react-notifications-component', 
  },

  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['ts', 'tsx'],
      files: ['src'],
      fix: true,
      eslintPath: 'eslint',
      emitError: true,
      emitWarning: true
    }),
    new CleanWebpackPlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      samples: path.resolve(__dirname, 'samples'),
      tests: path.resolve(__dirname, 'tests')
    }
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss)$/,
        use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
        include: /src/
      }
    ]
  },

  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  }
}
