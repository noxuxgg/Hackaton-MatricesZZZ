const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: '../../index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: '../../pages', to: 'pages' },
        { from: '../../img', to: 'img' },
        { from: '../../assets/css', to: 'assets/css' },
        { from: '../../favicon.ico', to: 'favicon.ico' },
        { from: '../../icon.png', to: 'icon.png' },
        { from: '../../icon.svg', to: 'icon.svg' },
        { from: '../../robots.txt', to: 'robots.txt' },
        { from: '../../404.html', to: '404.html' },
        { from: '../../site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
