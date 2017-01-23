var spawn = require('child_process').spawn

module.exports = install

function install (cert, options, cb) {
  var store = options.trust ? 'Root' : 'CA'
  var spawnImport = spawn('certutil', ['-addstore', '-user', store, cert], {shell: true})
  var errorOutput = ''

  spawnImport.on('error', function (err) {
    return cb(err)
  })

  spawnImport.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  spawnImport.stderr.on('data', function (data) {
    errorOutput += data
  })

  spawnImport.on('close', function (code, signal) {
    if (code !== 0) return cb(new Error('Security import exited with error code ' + code + '\n' + errorOutput))

    return cb(null)
  })
}
