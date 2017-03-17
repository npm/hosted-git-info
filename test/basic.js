'use strict'
var HostedGit = require('../index')
var test = require('tap').test

test('basic', function (t) {
  t.is(HostedGit.fromUrl('https://google.com'), undefined, 'null on failure')
  t.is(HostedGit.fromUrl('https://github.com/abc/def').getDefaultRepresentation(), 'https', 'match https urls')
  t.is(HostedGit.fromUrl('https://github.com/abc/def/').getDefaultRepresentation(), 'https', 'match URLs with a trailing slash')
  t.is(HostedGit.fromUrl('ssh://git@github.com/abc/def').getDefaultRepresentation(), 'sshurl', 'match ssh urls')
  t.is(HostedGit.fromUrl('git+ssh://git@github.com/abc/def').getDefaultRepresentation(), 'sshurl', 'match git+ssh urls')
  t.is(HostedGit.fromUrl('git+https://github.com/abc/def').getDefaultRepresentation(), 'https', 'match git+https urls')
  t.is(HostedGit.fromUrl('git@github.com:abc/def').getDefaultRepresentation(), 'sshurl', 'match ssh connect strings')
  t.is(HostedGit.fromUrl('git://github.com/abc/def').getDefaultRepresentation(), 'git', 'match git urls')
  t.is(HostedGit.fromUrl('github:abc/def').getDefaultRepresentation(), 'shortcut', 'match shortcuts')

  t.is(HostedGit.fromUrl('git+ssh://git@nothosted.com/abc/def'), undefined, 'non-hosted URLs get undefined response')
  t.is(HostedGit.fromUrl('git://nothosted.com'), undefined, 'non-hosted empty URLs get undefined response')
  t.is(HostedGit.fromUrl('git://github.com/balderdashy/waterline-%s.git'), undefined, 'invalid URLs get undefined response')
  t.is(HostedGit.fromUrl('git://github.com'), undefined, 'Invalid hosted URLs get undefined response')
  t.end()
})
