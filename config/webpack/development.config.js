var webpack = require('webpack');
var _ = require('lodash');
var config = module.exports = require('./main.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');

config.plugins.push(
  new WebpackNotifierPlugin({ alwaysNotify: true }),
  //new webpack.optimize.CommonsChunkPlugin('common', 'common-bundle.js'),
  new ExtractTextPlugin("[name].css"),
  new webpack.LoaderOptionsPlugin({
    // test: /\.xxx$/, // may apply this only for some modules
    options: {
      eslint: {
        failOnWarning: true,
        failOnError: true
      },
      debug: true,
      displayErrorDetails: true,
      outputPathinfo: true
  }
})
);


