const webpack = require("webpack"); // Make sure to require webpack at the top

module.exports = {
  // Other Webpack configuration options
  plugins: [
    // Add this to your plugins array
    new webpack.ProvidePlugin({
      global: "window", // This tells Webpack to replace 'global' with 'window' in your project
    }),
  ],
  // Other Webpack configuration options...
};
