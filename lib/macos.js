var spawn = require('child_process').spawn

module.exports = install

function install (cert, options, cb) {
  getDefaultKeychain(function (err, keychain) {
    if (err) return cb(err)

    return importCert(cert, keychain, function (err) {
      if (err) return cb(err)

      return trustCert(cert, cb)
    })
  })
}

function importCert (cert, keychain, cb) {
  var spawnImport = spawn('security', ['import', cert, '-k', keychain], {shell: true})
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

function trustCert (cert, cb) {
  var spawnTrust = spawn('security', ['add-trusted-cert', cert], {shell: true})
  var errorOutput = ''

  spawnTrust.on('error', function (err) {
    return cb(err)
  })

  spawnTrust.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  spawnTrust.stderr.on('data', function (data) {
    errorOutput += data
  })

  spawnTrust.on('close', function (code, signal) {
    if (code !== 0) return cb(new Error('Security add-trusted-cert exited with error code ' + code + '\n' + errorOutput))

    return cb(null)
  })
}

function getDefaultKeychain (cb) {
  var defaultKeychain = ''
  var errorOutput = ''

  var spawnKeychain = spawn('security', ['default-keychain'])

  spawnKeychain.on('error', function (err) {
    return cb(err)
  })

  spawnKeychain.stdout.on('data', function (data) {
    defaultKeychain += data.toString()
  })

  spawnKeychain.stderr.on('data', function (data) {
    errorOutput += data
  })

  spawnKeychain.on('close', function (code, signal) {
    if (code !== 0) return cb(new Error('Security default-keychain exited with error code ' + code + '\n' + errorOutput))

    return cb(null, defaultKeychain)
  })
}
