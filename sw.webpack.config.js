const path = require('path');
const rules = [
  {
    test: /\.ts$/,
    loader: 'ts-loader',
    options: {
      configFile: path.resolve('./tsconfig.json')
    }
  },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/, use: ['style-loader', 'css-loader'] }
];

module.exports = [
  {
    entry: './src/sw.ts',
    output: {
      filename: 'service-worker.js',
      path: path.resolve(__dirname, 'monstra', 'labextension', 'static')
    },
    module: {
      rules
    }
  }
];
