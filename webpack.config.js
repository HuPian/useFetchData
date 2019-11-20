const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-plugin');
module.exports = {
  entry:"./example/index.tsx",
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname ,'dist')
  },
  module:{
    rules: [
      {
        test: /\.tsx?$/,
        exclude:[path.resolve(__dirname,'node_modules')],
        use: "awesome-typescript-loader"
      },
      {
        test: /\.css/,
        use:['style-loader','css-loader']
      }
    ]
  },
  resolve:{
    extensions:['.ts','.js'],
  },
  mode:"development",
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: 'index.html',
    }),
    new OpenBrowserPlugin({
      url: 'http://0.0.0.0:8900/index.html',
    }),
  ],
  devServer: {
    compress: true,
    port: 8900,
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    proxy:{}
  },
};