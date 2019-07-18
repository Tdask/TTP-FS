const webpack = require("webpack");

module.exports = env => {
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: [
      "@babel/polyfill", // enables async-await
      "./client/index.js"
    ],
    mode: "development",
    output: {
      path: __dirname,
      filename: "./public/bundle.js"
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [new webpack.DefinePlugin(envKeys)]
  };
};
