var path = require('path');
var srcPath = path.join(__dirname, 'src');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: path.join(srcPath, './app.ts'),
    common: [
        'reflect-metadata/Reflect.js',
        'zone.js/dist/zone.js'
      ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'common.js',
        minChunks: Infinity
    })
  ],

  output: {
    filename: "[name].js"
  },

  devtool: 'source-map',

  resolve: {
    root: path.join(__dirname, "node_modules"),
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    // Two lines below fix dependency resolution when npm linking the component.
    fallback: path.join(__dirname, "node_modules")
  },
  resolveLoader: {fallback: path.join(__dirname, "node_modules")},

  module: {
    loaders: [
      {
        test: /\.ts$/, loader: 'ts-loader'
      }
    ]
  },
  noParse: [
    path.join(__dirname, 'node_modules', 'zone.js', 'dist')
  ]
};
