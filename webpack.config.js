// 'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './DoTheMath/src/index.js',

  // devServer: {
  //   contentBase: './public',
  //   inline: true,
  //   hot: true
  // },
  output: {
    path: path.resolve(__dirname, 'DoTheMath', 'public'),
    publicPath: '/public/',
    filename: 'bundle.js',
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
        exclude: /node_modules/,
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
    ],
  },
};
