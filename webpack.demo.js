const webpackMerge = require('webpack-merge');
const { dir } = require('./helpers');

let playgroundConfig = require('./webpack.playground.js');

module.exports = function() {

  return webpackMerge(playgroundConfig(), {

    context: dir('playground'),

    entry: {
      polyfills: './polyfills.ts',
      main: './main.ts'
    },

    output: {
      path: dir('demo'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },

    devtool: 'source-map',

    resolve: {
      mainFields: [ 'es2015', 'browser', 'module', 'main' ],
      extensions: ['.ts', '.js', '.scss'],
      modules: ['node_modules']
    },

    module: {
    },
    plugins: [
    ]

  })
};
