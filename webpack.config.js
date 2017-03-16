// In webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var ParallelUglifyPluginConfig = new ParallelUglifyPlugin({
     uglifyJS: {
        // These pass straight through to uglify. 
      },
    })

 module.exports = {
  entry: {
    entry: ['./app/index.js','./app/dungeon.js','./app/common.js','./app/entities.js']
  },
  module: {
    loaders: [
            {
                test: /\.scss$/,
                loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
            {
              //test: /\.tsx|.\ts$/, 
              test: /.\ts$/, 
              include: __dirname + '/typescript', 
              exclude: /node_modules/, 
              loader: "typescript-loader"
            },
            {
              test: /\.png|\.jpg$/,
              loader: "file-loader"
            }
    ]
  },
  output: {
    filename: "index_bundle.js",
    path: __dirname + '/dist'
  },
  //plugins: [HTMLWebpackPluginConfig,ParallelUglifyPluginConfig]
  plugins: [HTMLWebpackPluginConfig]
}