'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('basic', function (t) {
  t.is(HostedGit.fromUrl('https://google.com'), undefined, 'null on failure')
  t.is(HostedGit.fromUrl('https://github.com/abc/def').getDefaultType(), 'https', 'match https urls')
  t.is(HostedGit.fromUrl('ssh://git@github.com/abc/def').getDefaultType(), 'sshurl', 'match ssh urls')
  t.is(HostedGit.fromUrl('git+ssh://git@github.com/abc/def').getDefaultType(), 'sshurl', 'match git+ssh urls')
  t.is(HostedGit.fromUrl('git+https://github.com/abc/def').getDefaultType(), 'https', 'match git+https urls')
  t.is(HostedGit.fromUrl('git@github.com:abc/def').getDefaultType(), 'sshurl', 'match ssh connect strings')
  t.is(HostedGit.fromUrl('git://github.com/abc/def').getDefaultType(), 'git', 'match git urls')
  t.is(HostedGit.fromUrl('github:abc/def').getDefaultType(), 'shortcut', 'match shortcuts')
  t.end()
})
