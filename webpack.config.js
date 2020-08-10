const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'index':'./src/index.js',
    "eve.custom": "./node_modules/evejs/dist/eve.custom.js"
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader']},
      { test: /\.css$/, use:  ['style-loader', 'css-loader'] },
      { test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2)$/, use: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    open: true,
  }
};
