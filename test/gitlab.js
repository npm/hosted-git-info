'use strict'
 HostedGit = require('../index')
 test = require('tap').test

test('fromUrl(gitlab url)', (t) {
   verify (host, label, branch) {
    hostinfo = HostedGit.fromUrl(host)
    hash = branch ? '#' + branch : ''
    t.ok(hostinfo, label)
    (!hostinfo)
    t.is(hostinfo.https(), 'git+https://gitlab.com/111/222.git' + hash, label + ' -> https')
    t.is(hostinfo.browse(), 'https://gitlab.com/111/222' + (branch ? '/tree/' + branch : ''), label + ' -> browse')
    t.is(hostinfo.docs(), 'https://gitlab.com/111/222' + (branch ? '/tree/' + branch : '') + '#README', label + ' -> docs')
    t.is(hostinfo.ssh(), 'git@gitlab.com:111/222.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@gitlab.com/111/222.git' + hash, label + ' -> sshurl')
    t.is(hostinfo.shortcut(), 'gitlab:111/222' + hash, label + ' -> shortcut')
    t.is(hostinfo.file('C'), 'https://gitlab.com/111/222/raw/' + (branch || 'master') + '/C', label + ' -> file')
  }

  require('./lib/standard-tests')(verify, 'gitlab.com', 'gitlab')

  t.end()
})
