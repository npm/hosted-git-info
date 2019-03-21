'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('fromUrl(gist url)', function (t) {
  function verify (host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? '#' + branch : ''
    t.ok(hostinfo, label)
    if (!hostinfo) return
    t.is(hostinfo.https(), 'git+https://gist.github.com/222.git' + hash, label + ' -> https')
    t.is(hostinfo.git(), 'git://gist.github.com/222.git' + hash, label + ' -> git')
    t.is(hostinfo.browse(), 'https://gist.github.com/222' + (branch ? '/' + branch : ''), label + ' -> browse')
    t.is(hostinfo.browse(''), 'https://gist.github.com/222' + (branch ? '/' + branch : ''), label + ' -> browse(path)')
    t.is(hostinfo.browse('C'), 'https://gist.github.com/222' + (branch ? '/' + branch : '') + '#file-c', label + ' -> browse(path)')
    t.is(hostinfo.browse('C/D'), 'https://gist.github.com/222' + (branch ? '/' + branch : '') + '#file-cd', label + ' -> browse(path)')
    t.is(hostinfo.browse('C', 'A'), 'https://gist.github.com/222' + (branch ? '/' + branch : '') + '#file-c', label + ' -> browse(path, fragment)')
    t.is(hostinfo.browse('C/D', 'A'), 'https://gist.github.com/222' + (branch ? '/' + branch : '') + '#file-cd', label + ' -> browse(path)')
    t.is(hostinfo.bugs(), 'https://gist.github.com/222', label + ' -> bugs')
    t.is(hostinfo.docs(), 'https://gist.github.com/222' + (branch ? '/' + branch : ''), label + ' -> docs')
    t.is(hostinfo.ssh(), 'git@gist.github.com:/222.git' + hash, label + ' -> ssh')
    t.is(hostinfo.sshurl(), 'git+ssh://git@gist.github.com/222.git' + hash, label + ' -> sshurl')
    t.is(hostinfo.shortcut(), 'gist:222' + hash, label + ' -> shortcut')
    if (hostinfo.user) {
      t.is(hostinfo.file(''), 'https://gist.githubusercontent.com/111/222/raw/' + (branch ? branch + '/' : ''), label + ' -> file')
      t.is(hostinfo.file('C'), 'https://gist.githubusercontent.com/111/222/raw/' + (branch ? branch + '/' : '') + 'C', label + ' -> file')
      t.is(hostinfo.file('C/D'), 'https://gist.githubusercontent.com/111/222/raw/' + (branch ? branch + '/' : '') + 'C/D', label + ' -> file')
      t.is(hostinfo.tarball(), 'https://gist.github.com/111/222/archive/' + (branch || 'master') + '.tar.gz', label + ' -> tarball')
    }
  }

  verify('git@gist.github.com:222.git', 'git@')
  var hostinfo = HostedGit.fromUrl('git@gist.github.com:/ef860c7z5e0de3179341.git')
  if (t.ok(hostinfo, 'git@hex')) {
    t.is(hostinfo.https(), 'git+https://gist.github.com/ef860c7z5e0de3179341.git', 'git@hex -> https')
  }
  verify('git@gist.github.com:/222.git', 'git@/')
  verify('git://gist.github.com/222', 'git')
  verify('git://gist.github.com/222.git', 'git.git')
  verify('git://gist.github.com/222#branch', 'git#branch', 'branch')
  verify('git://gist.github.com/222.git#branch', 'git.git#branch', 'branch')

  require('./lib/standard-tests')(verify, 'gist.github.com', 'gist')

  verify(HostedGit.fromUrl('gist:111/222').toString(), 'round-tripped shortcut')
  verify('gist:222', 'shortened shortcut')

  t.end()
})
