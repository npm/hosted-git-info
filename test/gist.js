'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('fromUrl(gist url)', function (t) {
  var proj = new Array(33).join('2')
  function verify (host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? '#' + branch : ''
    t.ok(hostinfo, label)
    if (!hostinfo) return
    t.is(hostinfo.https(), 'git+https://gist.github.com/' + proj + '.git' + hash, label + ' -> https')
    t.is(hostinfo.git(), 'git://gist.github.com/' + proj + '.git' + hash, label + ' -> git')
    t.is(hostinfo.browse(), 'https://gist.github.com/' + proj + (branch ? '/' + branch : ''), label + ' -> browse')
    t.is(hostinfo.browse('C'), 'https://gist.github.com/' + proj + (branch ? '/' + branch : '') + '#file-c', label + ' -> browse(path)')
    t.is(hostinfo.browse('C/D'), 'https://gist.github.com/' + proj + (branch ? '/' + branch : '') + '#file-cd', label + ' -> browse(path)')
    t.is(hostinfo.browse('C', 'A'), 'https://gist.github.com/' + proj + (branch ? '/' + branch : '') + '#file-c', label + ' -> browse(path, fragment)')
    t.is(hostinfo.browse('C/D', 'A'), 'https://gist.github.com/' + proj + (branch ? '/' + branch : '') + '#file-cd', label + ' -> browse(path)')
    t.is(hostinfo.bugs(), 'https://gist.github.com/' + proj, label + ' -> bugs')
    t.is(hostinfo.docs(), 'https://gist.github.com/' + proj + (branch ? '/' + branch : ''), label + ' -> docs')
    t.is(hostinfo.ssh(), 'git@gist.github.com:/' + proj + '.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@gist.github.com/' + proj + '.git' + hash, label + ' -> sshurl')
    t.is(hostinfo.shortcut(), 'gist:' + proj + hash, label + ' -> shortcut')
    if (hostinfo.user) {
      t.is(hostinfo.file(''), 'https://gist.githubusercontent.com/111/' + proj + '/raw/' + (branch ? branch + '/' : ''), label + ' -> file')
      t.is(hostinfo.file('C'), 'https://gist.githubusercontent.com/111/' + proj + '/raw/' + (branch ? branch + '/' : '') + 'C', label + ' -> file')
      t.is(hostinfo.file('C/D'), 'https://gist.githubusercontent.com/111/' + proj + '/raw/' + (branch ? branch + '/' : '') + 'C/D', label + ' -> file')
      t.is(hostinfo.tarball(), 'https://codeload.github.com/gist/' + proj + '/tar.gz/' + (branch || 'master'), label + ' -> tarball')
      t.is(hostinfo.tarball({ noCommittish: true }), 'https://codeload.github.com/gist/' + proj + '/tar.gz/' + (branch || 'master'), label + ' -> tarball')
    }
  }

  verify('git@gist.github.com:' + proj + '.git', 'git@')
  var hostinfo = HostedGit.fromUrl('git@gist.github.com:/c2b12db30a49324325a3781302668408.git')
  if (t.ok(hostinfo, 'git@hex')) {
    t.is(hostinfo.https(), 'git+https://gist.github.com/c2b12db30a49324325a3781302668408.git', 'git@hex -> https')
  }
  verify('git@gist.github.com:/' + proj + '.git', 'git@/')
  verify('git://gist.github.com/' + proj, 'git')
  verify('git://gist.github.com/' + proj + '.git', 'git.git')
  verify('git://gist.github.com/' + proj + '#branch', 'git#branch', 'branch')
  verify('git://gist.github.com/' + proj + '.git#branch', 'git.git#branch', 'branch')

  require('./lib/standard-tests')(verify, 'gist.github.com', 'gist', proj)

  verify(HostedGit.fromUrl('gist:111/' + proj).toString(), 'round-tripped shortcut')
  verify('gist:' + proj, 'shortened shortcut')

  t.end()
})
