'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('fromUrl(generic url)', function (t) {
  function verify (host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? '#' + branch : ''
    t.ok(hostinfo, label)
    if (!hostinfo) return
    t.is(hostinfo.https(), 'git+https://generic.com/111/222.git' + hash, label + ' -> https')
    t.is(hostinfo.git(), 'git://generic.com/111/222.git' + hash, label + ' -> git')
    t.is(hostinfo.ssh(), 'git@generic.com:111/222.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@generic.com/111/222.git' + hash, label + ' -> sshurl')
  }

  // insecure protocols
  verify('git://generic.com/111/222', 'git')
  verify('git://generic.com/111/222.git', 'git.git')
  verify('git://generic.com/111/222#branch', 'git#branch', 'branch')
  verify('git://generic.com/111/222.git#branch', 'git.git#branch', 'branch')

  verify('http://generic.com/111/222', 'http')
  verify('http://generic.com/111/222.git', 'http.git')
  verify('http://generic.com/111/222#branch', 'http#branch', 'branch')
  verify('http://generic.com/111/222.git#branch', 'http.git#branch', 'branch')

  require('./lib/standard-tests')(verify, 'generic.com', 'generic')

  t.end()
})
