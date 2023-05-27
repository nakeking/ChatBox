const webpack = require("webpack")

const CracoLessPlugin = require('craco-less');
const CracoCSSModules = require('craco-css-modules');

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: {'@primary-color': '#1DA57A'},
            javascriptEnabled: true,
            module: true,
          },
        },
      },
    }
  ],
  webpack: {
    configure: {
      target: 'electron-main',
      resolve: {
        fallback: {
          fs: false,
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
          crypto: require.resolve('crypto-browserify'),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ],
    },
  },
}