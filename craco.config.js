const webpack = require('webpack')

const CracoLessPlugin = require('craco-less')

const WorkerLoaderPlugin = require('craco-worker-loader')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  plugins: [
    {
      plugin: WorkerLoaderPlugin
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: {'@primary-color': '#1DA57A'},
            javascriptEnabled: true,
            module: true
          }
        }
      }
    }
  ],
  webpack: {
    output: {
      globalObject: 'this'
    },
    configure: {
      target: 'electron-main',
      module: {
        rules: [
          {
            test: /\.worker\.(ts|js)$/i,
            loader: 'worker-loader'
          }
        ]
      },
      resolve: {
        fallback: {
          fs: false,
          process: require.resolve('process/browser'),
          zlib: require.resolve('browserify-zlib'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer'),
          asset: require.resolve('assert'),
          crypto: require.resolve('crypto-browserify')
        }
      },
      devServer: {
        hot: true,
        watchOptions: {
          poll: true
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        }),
        new ReactRefreshWebpackPlugin()
      ]
    }
  }
}
