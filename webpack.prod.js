const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/react-notifications.prod.js',
    library: 'ReactNotifications',
    libraryTarget: 'commonjs2'
  },

  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({}),
      new CopyPlugin([{ from: 'src/scss', to: 'scss' }, { from: 'build/index.js', to: 'index.js' }])
    ]
  },

  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      samples: path.resolve(__dirname, 'samples'),
      tests: path.resolve(__dirname, 'tests')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: /src/
      },
      {
        test: /\.(js|jsx)$/,
        use: ['eslint-loader'],
        include: /src/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ],
        include: /src/
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'theme.css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

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
};
