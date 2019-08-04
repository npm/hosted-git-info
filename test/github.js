'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('fromUrl(github url)', function (t) {
  function verify (host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? '#' + branch : ''
    var treebranch = branch ? '/tree/' + branch : ''
    t.equal(hostinfo._fill(), undefined)
    t.ok(hostinfo, label)
    if (!hostinfo) return
    t.is(hostinfo.https(), 'git+https://github.com/111/222.git' + hash, label + ' -> https')
    t.is(hostinfo.git(), 'git://github.com/111/222.git' + hash, label + ' -> git')
    t.is(hostinfo.browse(), 'https://github.com/111/222' + treebranch, label + ' -> browse')
    t.is(hostinfo.browse('C'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C', label + ' -> browse(path)')
    t.is(hostinfo.browse('C', 'A'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C#a', label + ' -> browse(path, fragment)')
    t.is(hostinfo.bugs(), 'https://github.com/111/222/issues', label + ' -> bugs')
    t.is(hostinfo.docs(), 'https://github.com/111/222' + treebranch + '#readme', label + ' -> docs')
    t.is(hostinfo.ssh(), 'git@github.com:111/222.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@github.com/111/222.git' + hash, label + ' -> sshurl')
    t.is(hostinfo.sshurl({ noGitPlus: true }), 'ssh://git@github.com/111/222.git' + hash, label + ' -> sshurl (no git plus)')
    t.is(hostinfo.path(), '111/222' + hash, ' -> path')
    t.is(hostinfo.hash(), hash, ' -> hash')
    t.is(hostinfo.path({ noCommittish: true }), '111/222', ' -> path (no committish)')
    t.is(hostinfo.shortcut(), 'github:111/222' + hash, label + ' -> shortcut')
    t.is(hostinfo.file('C'), 'https://raw.githubusercontent.com/111/222/' + (branch || 'master') + '/C', label + ' -> file')
    t.is(hostinfo.tarball(), 'https://codeload.github.com/111/222/tar.gz/' + (branch || 'master'), label + ' -> tarball')
  }

  // github shorturls
  verify('111/222', 'github-short')
  verify('111/222#branch', 'github-short#branch', 'branch')

  // insecure protocols
  verify('git://github.com/111/222', 'git')
  verify('git://github.com/111/222.git', 'git.git')
  verify('git://github.com/111/222#branch', 'git#branch', 'branch')
  verify('git://github.com/111/222.git#branch', 'git.git#branch', 'branch')

  verify('http://github.com/111/222', 'http')
  verify('http://github.com/111/222.git', 'http.git')
  verify('http://github.com/111/222#branch', 'http#branch', 'branch')
  verify('http://github.com/111/222.git#branch', 'http.git#branch', 'branch')

  require('./lib/standard-tests')(verify, 'github.com', 'github')

  require('./lib/standard-tests')(verify, 'www.github.com', 'github')

  t.equal(HostedGit.fromUrl('git+ssh://github.com/foo.git'), undefined)

  t.end()
})
