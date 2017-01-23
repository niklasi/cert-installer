
module.exports = install

function install (cert, options, cb) {
  var platform = process.platform

  if (platform === 'darwin') return require('./lib/macos')(cert, options, cb)
  if (platform === 'win32') return require('./lib/windows')(cert, options, cb)

  throw new Error('Platform ' + platform + ' is not supported.')
}
