/* global module, __dirname */

module.exports = {
  devtool: 'sourcemap',
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
};