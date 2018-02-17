const webpack = require('webpack');
const { srcRoot, dir, METADATA } = require('./helpers');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function() {
  return {
    context: srcRoot,
    resolve: {
      extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
      modules: [
        'node_modules',
        dir('src'),
      ]
    },
    performance: {
      hints: false
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      exprContextCritical: false,
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg|jpeg|jpg|gif)$/,
          loader: 'url-loader',
          query: {
            limit: '100000'
          }
        },
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.css$/,
          include: [dir('src'), dir('playground/app'), dir('playground/styles')],
          use: [
            { loader: 'to-string-loader', options: { sourceMap: true } },
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
          ]
        },
        {
          test: /\.scss$/,
          include: [ dir('src'), dir('playground/app'), dir('playground/styles')],
          use: [
            { loader: 'to-string-loader', options: { sourceMap: true } },
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ]
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin('styles/[name].css'),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        PRODUCTION: METADATA.isProd
      })
    ]
  };
};
