'use strict'
const HostedGit = require('../index')
const t = require('tap')

const invalid = [
  // invalid protocol
  'git://bitbucket.org/foo/bar',
  // url to get a tarball
  'https://bitbucket.org/foo/bar/get/archive.tar.gz',
  // missing project
  'https://bitbucket.org/foo'
]

// assigning the constructor here is hacky, but the only way to make assertions that compare
// a subset of properties to a found object pass as you would expect
const GitHost = require('../git-host')
const defaults = { constructor: GitHost, type: 'bitbucket', user: 'foo', project: 'bar' }

const valid = {
  // shortucts
  //
  // NOTE auth is accepted but ignored
  'bitbucket:foo/bar': { ...defaults, default: 'shortcut' },
  'bitbucket:foo/bar#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'bitbucket:user@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket:user@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'bitbucket:user:password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket:user:password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'bitbucket::password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket::password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'bitbucket:foo/bar.git': { ...defaults, default: 'shortcut' },
  'bitbucket:foo/bar.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'bitbucket:user@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket:user@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'bitbucket:user:password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket:user:password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'bitbucket::password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'bitbucket::password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  // no-protocol git+ssh
  //
  // NOTE auth is accepted but ignored
  'git@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user:password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  ':password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user:password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  ':password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // git+ssh urls
  //
  // NOTE auth is accepted but ignored
  'git+ssh://bitbucket.org:foo/bar': { ...defaults, default: 'sshurl' },
  'git+ssh://bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl' },
  'git+ssh://bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // ssh urls
  //
  // NOTE auth is accepted but ignored
  'ssh://bitbucket.org:foo/bar': { ...defaults, default: 'sshurl' },
  'ssh://bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@bitbucket.org:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@bitbucket.org:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl' },
  'ssh://bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@bitbucket.org:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@bitbucket.org:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // git+https urls
  //
  // NOTE auth is accepted and respected
  'git+https://bitbucket.org/foo/bar': { ...defaults, default: 'https' },
  'git+https://bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://bitbucket.org/foo/bar.git': { ...defaults, default: 'https' },
  'git+https://bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  // https urls
  //
  // NOTE auth is accepted and respected
  'https://bitbucket.org/foo/bar': { ...defaults, default: 'https' },
  'https://bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'https://user@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@bitbucket.org/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@bitbucket.org/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://bitbucket.org/foo/bar.git': { ...defaults, default: 'https' },
  'https://bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'https://user@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@bitbucket.org/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' }
}

t.test('valid urls parse properly', t => {
  t.plan(Object.keys(valid).length)
  for (const [url, result] of Object.entries(valid)) {
    t.hasStrict(HostedGit.fromUrl(url), result, `${url} parses`)
  }
})

t.test('invalid urls return undefined', t => {
  t.plan(invalid.length)
  for (const url of invalid) {
    t.equal(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})

t.test('toString respects defaults', t => {
  const sshurl = HostedGit.fromUrl('git+ssh://bitbucket.org/foo/bar')
  t.equal(sshurl.default, 'sshurl', 'got the right default')
  t.equal(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://bitbucket.org/foo/bar')
  t.equal(https.default, 'https', 'got the right default')
  t.equal(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('bitbucket:foo/bar')
  t.equal(shortcut.default, 'shortcut', 'got the right default')
  t.equal(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')

  t.end()
})

t.test('string methods populate correctly', t => {
  const parsed = HostedGit.fromUrl('git+ssh://bitbucket.org/foo/bar')
  t.equal(parsed.getDefaultRepresentation(), parsed.default, 'getDefaultRepresentation()')
  t.equal(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  t.equal(parsed.ssh(), 'git@bitbucket.org:foo/bar.git')
  t.equal(parsed.sshurl(), 'git+ssh://git@bitbucket.org/foo/bar.git')
  t.equal(parsed.browse(), 'https://bitbucket.org/foo/bar')
  t.equal(parsed.browse('/lib/index.js'), 'https://bitbucket.org/foo/bar/src/master/lib/index.js')
  t.equal(parsed.browse('/lib/index.js', 'L100'), 'https://bitbucket.org/foo/bar/src/master/lib/index.js#l100')
  t.equal(parsed.docs(), 'https://bitbucket.org/foo/bar#readme')
  t.equal(parsed.https(), 'git+https://bitbucket.org/foo/bar.git')
  t.equal(parsed.shortcut(), 'bitbucket:foo/bar')
  t.equal(parsed.path(), 'foo/bar')
  t.equal(parsed.tarball(), 'https://bitbucket.org/foo/bar/get/master.tar.gz')
  t.equal(parsed.file(), 'https://bitbucket.org/foo/bar/raw/master/')
  t.equal(parsed.file('/lib/index.js'), 'https://bitbucket.org/foo/bar/raw/master/lib/index.js')
  t.equal(parsed.bugs(), 'https://bitbucket.org/foo/bar/issues')

  t.equal(parsed.docs({ committish: 'fix/bug' }), 'https://bitbucket.org/foo/bar/src/fix%2Fbug#readme', 'allows overriding options')

  t.same(parsed.git(), null, 'git() returns null')

  const extra = HostedGit.fromUrl('https://user@bitbucket.org/foo/bar#fix/bug')
  t.equal(extra.hash(), '#fix/bug')
  t.equal(extra.https(), 'git+https://user@bitbucket.org/foo/bar.git#fix/bug')
  t.equal(extra.shortcut(), 'bitbucket:foo/bar#fix/bug')
  t.equal(extra.ssh(), 'git@bitbucket.org:foo/bar.git#fix/bug')
  t.equal(extra.sshurl(), 'git+ssh://git@bitbucket.org/foo/bar.git#fix/bug')
  t.equal(extra.browse(), 'https://bitbucket.org/foo/bar/src/fix%2Fbug')
  t.equal(extra.browse('/lib/index.js'), 'https://bitbucket.org/foo/bar/src/fix%2Fbug/lib/index.js')
  t.equal(extra.browse('/lib/index.js', 'L200'), 'https://bitbucket.org/foo/bar/src/fix%2Fbug/lib/index.js#l200')
  t.equal(extra.docs(), 'https://bitbucket.org/foo/bar/src/fix%2Fbug#readme')
  t.equal(extra.file(), 'https://bitbucket.org/foo/bar/raw/fix%2Fbug/')
  t.equal(extra.file('/lib/index.js'), 'https://bitbucket.org/foo/bar/raw/fix%2Fbug/lib/index.js')

  t.equal(extra.sshurl({ noCommittish: true }), 'git+ssh://git@bitbucket.org/foo/bar.git', 'noCommittish drops committish from urls')
  t.equal(extra.sshurl({ noGitPlus: true }), 'ssh://git@bitbucket.org/foo/bar.git#fix/bug', 'noGitPlus drops git+ prefix from urls')

  t.end()
})
