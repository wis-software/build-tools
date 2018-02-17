const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { dir } = require('./helpers');

const ENV = 'development';

let commonConfig = require('./webpack.common.js');

module.exports = function() {

  return webpackMerge(commonConfig(), {

    context: dir('playground'),

    entry: {
      polyfills: './polyfills.ts',
      main: './main.ts'
    },

    output: {
      path: dir('playground_dist'),
      filename: '[name].[hash].js',
      chunkFilename: '[id].[hash].chunk.js',
      hotUpdateChunkFilename: "[id].[hash].hot-update.js",
      publicPath: '/'
    },

    resolve: {
      mainFields: [ 'es2015', 'browser', 'module', 'main' ],
      extensions: ['.ts', '.js', '.scss'],
      modules: ['node_modules', dir('package')]
    },

    devtool: 'inline-source-map',

    module: {
      exprContextCritical: false,
      rules: [
        {
          test: /\.ts$/,
          use: [
            'awesome-typescript-loader',
            'angular2-template-loader',
            {
              loader: 'angular-router-loader',
              options: {
                loader: 'system-loader'
              }
            }
          ],
          exclude: [ /\.(spec|e2e)\.ts$/ ]
        },
        {
          test: /\.scss$/,
          include: [dir('playground'),dir('tools/assets')],
          exclude: [dir('playground/app'), dir('playground/styles')],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { sourceMap: true } },
              { loader: 'postcss-loader', options: { sourceMap: true } },
              { loader: 'resolve-url-loader', options: { sourceMap: true } },
              { loader: 'sass-loader', options: { sourceMap: true } }
            ]
          })
        },
        {
          test: /\.css$/,
          include: [dir('playground')],
          exclude: [dir('playground/app'), dir('playground/styles')],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader']
          })
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunksSortMode: 'dependency',
      }),

      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),

      /**
       * This enables tree shaking of the vendor modules
       */
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),

      /**
       * Specify the correct order the scripts will be injected in
       */
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),

      new CommonsChunkPlugin({
        name: ['manifest'],
        minChunks: Infinity,
      }),

      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core/,
        __dirname,
        {} // a map of your routes
      ),
      new DllBundlesPlugin({
        bundles: {
          polyfills: [
            'core-js',
            {
              name: 'zone.js',
              path: 'zone.js/dist/zone.js'
            },
            {
              name: 'zone.js',
              path: 'zone.js/dist/long-stack-trace-zone.js'
            },
          ],
          vendor: [
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/core',
            '@angular/common',
            '@angular/forms',
            '@angular/material',
            'rxjs',
          ]
        },
        dllDir: dir('dll'),
        webpackConfig: webpackMergeDll(commonConfig({env: ENV}), {
          devtool: 'cheap-module-source-map',
          plugins: []
        }),
      }),
      new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' }
      ])
    ],

    devServer: {
      port: 8000,
      host: 'localhost',
      historyApiFallback: {
        index: '/',
        disableDotRule: true
      },
      watchOptions: {
        ignore: /node_modules/
      },
    }

  })
};
