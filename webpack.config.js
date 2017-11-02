var path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'app/assets/javascripts'),
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  entry: [
    './timur.jsx'
  ],
  module: {
    loaders: [
      {
        loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "app/assets/javascripts"),
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
    ]
  },
  output: {
    filename: "public/js/timur.bundle.js",
    path: __dirname
  }
}
