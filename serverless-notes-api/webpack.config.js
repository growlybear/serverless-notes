var glob = require('glob')
var path = require('path')
var nodeExternals = require('webpack-node-externals')

// required for create-react-app babel transform
process.env.NODE_ENV = 'production'

function globEntries(globPath) {
  var files = glob.sync(globPath)
  var entries = {}

  for (var i = 0; i < files.length; i++) {
    var entry = files[i]
    entries[path.basename(entry, path.extname(entry))] = './' + entry
  }

  return entries
}

module.exports = {
  // use all js files in project root as an entry,
  // except for webpack.config
  entry: globEntries('!(webpack.config).js'),
  target: 'node',
  // aws-sdk is not compatible with webpack,
  // so exclude all node dependencies
  externals: [nodeExternals()],
  // run babel on all .js files but
  // skip everything in node_modules
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: __dirname,
      exclude: /node_modules/
    }]
  },
  // need this output block as we are going to create
  // multiple api's with a js file for each
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}
