const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    devServer: {
        overlay: true
    }
}