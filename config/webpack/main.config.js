var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var jeet = require('jeet');
var nib = require('nib');

var dirname = path.join(__dirname, '../', '../');

module.exports = {
  // the base path which will be used to resolve entry points
  context: dirname,
  devtool: 'source-map',
  // the main entry point for our application's frontend JSON
  entry: {
    application: './frontend/application'
  },
  output: {
    // this is our app/assets/javascripts directory, which is part of the Sprockets pipeline
    path: path.join(dirname, 'static'),
    // the filename of the compiled bundle, e.g. app/assets/javascripts/bundle.js
    filename: 'application.js',
    // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
    publicPath: '/',
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  resolve: {
    // tell webpack which extensions to auto search when it resolves modules. With this,
    // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
    extensions: ['.js', '.es6', '.css', '.png', '.gif', '.jpg', '.jpeg'],
    // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
    // Bower, we want it to look in there too
    modules: ['node_modules']
  },
  plugins: [
    // This will now automatically inject the $ and jQuery variables into every module,
    // so we no longer need to require them
    new webpack.ProvidePlugin({
      $:      'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      // **IMPORTANT** This is needed so that each bootstrap js file required by
      // bootstrap-webpack has access to the jQuery object
      { test: /bootstrap\/js\//, use: 'imports-loader?jQuery=jquery' },
      // font-awesome + bootstrap
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,      use: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,      use: "file-loader" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,      use: "url-loader?limit=10000&mimetype=image/svg+xml" },
      // Extract css files
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback : "style-loader",
          use : "css-loader!url-loader"
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback : "style-loader",
          use : "css-loader!less-loader"
        })
      },
      {
        test: /\.config\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback : "style-loader",
          use : "css-loader!sass-loader"
        })
      },
      {
        test: function(s) { return !s.match(/\.config\.scss$/) && !!s.match(/\.scss$/); },
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader!url-loader!sass?sourceMap"
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'stylus-loader']
        })
      },
      // Images
      { test: /\.(jpe?g|png|gif|svg)$/i, use: 'url-loader?limit=10000!img?progressive=true' },
      // es6 files
      {
        test: /\.(es6|jsx)$/,
        exclude: /(node_modules|vendor)/,
        use: {
          loader : 'babel-loader',
          options: {
            presets: ['env', 'stage-2'],
            plugins: []
          }
        },
      }
    ]
  }
};

