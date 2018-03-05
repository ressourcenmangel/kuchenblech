const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Is production?
const isProduction = process.env.NODE_ENV === 'production';

// Webpack configuration
module.exports = () => ({
  entry: {
    main: './src/assets/javascripts/main.js',
    styles: './src/assets/stylesheets/main.scss',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['src/assets/stylesheets', 'node_modules'],
              },
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '../fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.(svg|png|gif|jpg|jpeg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '../images/[name].[ext]',
          },
        },
      },
    ],
  },
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  stats: 'errors-only',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/javascripts'),
  },
  plugins: [
    new ExtractTextPlugin('../stylesheets/main.css'),
    new webpack.DefinePlugin({
      process: false,
      'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
  ],
});
