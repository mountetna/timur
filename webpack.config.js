var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = (env) => ({
  context: path.resolve(__dirname),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.png', '.jpg', '.jpeg', '.svg'],
    alias: {
      'code-mirror': path.join(__dirname, 'node_modules/codemirror/lib'),
      react: path.join(__dirname, 'node_modules/react'),
      'react-dom': path.join(__dirname, 'node_modules/react-dom'),
      'react-redux': path.join(__dirname, 'node_modules/react-redux')
    },
    symlinks: false
  },
  entry: ['./lib/client/jsx/timur.jsx', './lib/client/scss/application.scss'],
  output: {
    filename: 'public/js/timur.bundle.js',
    path: __dirname,
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, 'lib/client/jsx'),
          path.resolve(__dirname, 'node_modules/etna-js/'),
          '/etna/packages/etna-js'
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.(js|ts)x?$/
      },

      {
        loader: ['style-loader', 'css-loader'],
        include: [
          path.resolve(__dirname, 'node_modules/etna-js/'),
          path.resolve(__dirname, 'node_modules/animate.css/'),
          path.resolve(__dirname, 'node_modules/react-notifications-component'),
          path.resolve(__dirname, 'node_modules/codemirror/'),
          '/etna/packages/etna-js'
        ],
        test: /\.css$/
      },

      {
        loader: 'file-loader',
        include: [
          path.resolve(__dirname, 'node_modules/etna-js/'),
          '/etna/packages/etna-js'
        ],
        test: /\.(jpe?g|png|svg)$/i,

        options: {
          name: '[name].[ext]',
          outputPath: 'public/images/',
          publicPath: '/images'
        }
      },

      {
        test: /\.(jpe?g|png|svg)$/i,

        include: [path.resolve(__dirname, 'lib/client/img')],

        loader: 'file-loader',

        options: {
          name: '[name].[ext]',
          outputPath: 'public/images/',
          publicPath: '/images'
        }
      },

      {
        // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        include: [
          path.resolve(
            __dirname,
            'node_modules/react-loader-spinner/dist/loader/css'
          ),
          path.resolve(__dirname, 'lib/client/scss')
        ],

        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // define where to save the file
      filename: 'public/css/timur.bundle.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env ? env.NODE_ENV : 'development')
      }
    })
  ]
});
