const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DirectoryTreePlugin = require('directory-tree-webpack-plugin');
const { dir } = require('./helpers');

const ENV = 'development';

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
      new DirectoryTreePlugin({
        dir: './playground/app/components',
        path: './playground/assets/components/components.json',
        enhance: (item, options) => {
          item.path = item.path.replace(/playground\\app\\components\\/, '');
          return item;
        }
      }),
      new CopyWebpackPlugin([
        { from: '../playground/app/components', to: 'assets/components' },
        { from: '../docs', to: 'docs' },
        { from: '../playground/assets/components/components.json', to: 'assets/components/components.json' }
      ]),
    ],

  })
};
