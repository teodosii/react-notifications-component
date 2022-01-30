const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') 
const CopyPlugin = require('copy-webpack-plugin') 
const TerserPlugin = require('terser-webpack-plugin') 
const webpack = require('webpack') 
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin') 
const path = require('path') 
 
const ESLintWebpackPlugin = require('eslint-webpack-plugin') 
 
module.exports = { 
  mode: 'production', 
  entry: './src/index.ts', 
  devtool: 'source-map', 
 
  output: { 
    path: path.resolve(__dirname, 'dist'), 
    filename: 'index.js',  
    libraryTarget: 'umd',  
    library: 'react-notifications-component',  
  }, 
 
  optimization: { 
    minimizer: [ 
      new TerserPlugin(), 
      new OptimizeCSSAssetsPlugin({}), 
      new CopyPlugin({ 
        patterns: [ 
          { from: 'src/scss', to: 'scss' }, 
        ] 
      }) 
    ] 
  }, 
 
  resolve: { 
    extensions: ['.js', '.ts', '.tsx', '.scss'], 
    alias: { 
      src: path.resolve(__dirname, 'src'), 
      samples: path.resolve(__dirname, 'samples'), 
      tests: path.resolve(__dirname, 'tests') 
    }, 
    plugins: [ 
      new TsconfigPathsPlugin({ configFile: './tsconfig.json' }) 
    ] 
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
    new ESLintWebpackPlugin({ 
      extensions: ['ts', 'tsx'], 
      files: ['src'], 
      fix: true, 
      eslintPath: 'eslint', 
      emitError: true, 
      emitWarning: true 
    }), 
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
} 
