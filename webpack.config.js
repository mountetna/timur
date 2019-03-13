var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = env => ({
  context: path.resolve(__dirname, 'lib/client'),
  resolve: {
    extensions: [ '.js', '.jsx', '.scss', '.png', '.jpg', '.jpeg', '.svg' ],
    alias: {
      'code-mirror': path.join(__dirname, 'node_modules/codemirror/lib'),
      'react-table': path.join(__dirname, 'node_modules/react-table')
    }
  },
  entry: ['./jsx/timur.jsx', './scss/application.scss' ],
  output: {
    filename: 'public/js/timur.bundle.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, 'lib/client/jsx'),
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          presets: ['env', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },

      {
        test: /\.(jpe?g|png|svg)$/i,

        include: [
          path.resolve(__dirname, 'lib/client/img'),
        ],

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

        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'public/css/timur.bundle.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
      }
    })
  ],
});
