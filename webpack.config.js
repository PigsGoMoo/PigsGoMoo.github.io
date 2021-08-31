// 'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    DoTheMath: './DoTheMath/src/index.js',
    PoeHideoutCalc: './PoeHideoutCalc/src/index.js',
  },

  // devServer: {
  //   contentBase: './public',
  //   inline: true,
  //   hot: true
  // },
  output: {
    path: path.resolve(__dirname, 'scripts'),
    publicPath: '/public/',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: '/src',
        exclude: [/node_modules/, /PoeHideoutCalc/],
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /DoTheMath/],
        use: 'babel-loader',
      },
    ],
  },
};
