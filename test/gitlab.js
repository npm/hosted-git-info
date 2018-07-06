'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('fromUrl(gitlab url)', function (t) {
  function verify (host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? '#' + branch : ''
    t.ok(hostinfo, label)
    if (!hostinfo) return
    t.is(hostinfo.https(), 'git+https://gitlab.com/111/222.git' + hash, label + ' -> https')
    t.is(hostinfo.browse(), 'https://gitlab.com/111/222' + (branch ? '/tree/' + branch : ''), label + ' -> browse')
    t.is(hostinfo.browse('C'), 'https://gitlab.com/111/222/tree/' + (branch || 'master') + '/C', label + ' -> browse(path)')
    t.is(hostinfo.browse('C', 'A'), 'https://gitlab.com/111/222/tree/' + (branch || 'master') + '/C#a', label + ' -> browse(path, fragment)')
    t.is(hostinfo.docs(), 'https://gitlab.com/111/222' + (branch ? '/tree/' + branch : '') + '#readme', label + ' -> docs')
    t.is(hostinfo.ssh(), 'git@gitlab.com:111/222.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@gitlab.com/111/222.git' + hash, label + ' -> sshurl')
    t.is(hostinfo.shortcut(), 'gitlab:111/222' + hash, label + ' -> shortcut')
    t.is(hostinfo.file('C'), 'https://gitlab.com/111/222/raw/' + (branch || 'master') + '/C', label + ' -> file')
    t.is(hostinfo.tarball(), 'https://gitlab.com/111/222/repository/archive.tar.gz?ref=' + (branch || 'master'), label + ' -> tarball')
  }

  require('./lib/standard-tests')(verify, 'gitlab.com', 'gitlab')
  require('./lib/standard-tests')(verify, 'www.gitlab.com', 'gitlab')

  t.end()
})
