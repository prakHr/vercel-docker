const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // Correct the alias path here if necessary
      '@src': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.json', '.wasm'],
  },
  entry: './src/googleSearch.js', // Ensure entry path is correct
};
