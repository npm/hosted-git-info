'use strict'
const HostedGit = require('../index')
const t = require('tap')

const invalid = [
  // gitlab urls can contain a /-/ segment, make sure we ignore those
  'https://gitlab.com/foo/-/something',
  // missing project
  'https://gitlab.com/foo',
  // tarball, this should not parse so that it can be used for pacote's remote fetcher
  'https://gitlab.com/foo/bar/repository/archive.tar.gz',
  'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=49b393e2ded775f2df36ef2ffcb61b0359c194c9'
]

// assigning the constructor here is hacky, but the only way to make assertions that compare
// a subset of properties to a found object pass as you would expect
const GitHost = require('../git-host')
const defaults = { constructor: GitHost, type: 'gitlab', user: 'foo', project: 'bar' }
const subgroup = { constructor: GitHost, type: 'gitlab', user: 'foo/bar', project: 'baz' }
const valid = {
  // shortcuts
  //
  // NOTE auth is accepted but ignored
  // NOTE subgroups are respected, but the subgroup is treated as the project and the real project is lost
  'gitlab:foo/bar': { ...defaults, default: 'shortcut' },
  'gitlab:foo/bar#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gitlab:user@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'gitlab:user@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab:user:password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'gitlab:user:password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab::password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'gitlab::password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gitlab:foo/bar.git': { ...defaults, default: 'shortcut' },
  'gitlab:foo/bar.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gitlab:user@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'gitlab:user@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab:user:password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'gitlab:user:password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab::password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'gitlab::password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gitlab:foo/bar/baz': { ...subgroup, default: 'shortcut' },
  'gitlab:foo/bar/baz#branch': { ...subgroup, default: 'shortcut', committish: 'branch' },
  'gitlab:user@foo/bar/baz': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab:user@foo/bar/baz#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab:user:password@foo/bar/baz': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab:user:password@foo/bar/baz#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab::password@foo/bar/baz': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab::password@foo/bar/baz#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },

  'gitlab:foo/bar/baz.git': { ...subgroup, default: 'shortcut' },
  'gitlab:foo/bar/baz.git#branch': { ...subgroup, default: 'shortcut', committish: 'branch' },
  'gitlab:user@foo/bar/baz.git': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab:user@foo/bar/baz.git#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab:user:password@foo/bar/baz.git': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab:user:password@foo/bar/baz.git#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },
  'gitlab::password@foo/bar/baz.git': { ...subgroup, default: 'shortcut', auth: null },
  'gitlab::password@foo/bar/baz.git#branch': { ...subgroup, default: 'shortcut', auth: null, committish: 'branch' },

  // no-protocol git+ssh
  //
  // NOTE auth is _required_ (see invalid list) but ignored
  'user@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user:password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  ':password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'user@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user:password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  ':password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'user@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'user@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'user:password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  ':password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  'user@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'user@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'user:password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  ':password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  // git+ssh urls
  //
  // NOTE auth is accepted but ignored
  // NOTE subprojects are accepted, but the subproject is treated as the project and the real project is lost
  'git+ssh://gitlab.com:foo/bar': { ...defaults, default: 'sshurl' },
  'git+ssh://gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  'git+ssh://gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl' },
  'git+ssh://gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://user@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://user:password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://:password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl' },
  'git+ssh://gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://user@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://user:password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'git+ssh://:password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  // ssh urls
  //
  // NOTE auth is accepted but ignored
  // NOTE subprojects are accepted, but the subproject is treated as the project and the real project is lost
  'ssh://gitlab.com:foo/bar': { ...defaults, default: 'sshurl' },
  'ssh://gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gitlab.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@gitlab.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  'ssh://gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gitlab.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@gitlab.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl' },
  'ssh://gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', committish: 'branch' },
  'ssh://user@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://user@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://user:password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gitlab.com:foo/bar/baz': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://:password@gitlab.com:foo/bar/baz#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl' },
  'ssh://gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', committish: 'branch' },
  'ssh://user@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://user@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://user:password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gitlab.com:foo/bar/baz.git': { ...subgroup, default: 'sshurl', auth: null },
  'ssh://:password@gitlab.com:foo/bar/baz.git#branch': { ...subgroup, default: 'sshurl', auth: null, committish: 'branch' },

  // git+https urls
  //
  // NOTE auth is accepted and respected
  // NOTE subprojects are accepted, but the subproject is treated as the project and the real project is lost
  'git+https://gitlab.com/foo/bar': { ...defaults, default: 'https' },
  'git+https://gitlab.com/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://gitlab.com/foo/bar.git': { ...defaults, default: 'https' },
  'git+https://gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://gitlab.com/foo/bar/baz': { ...subgroup, default: 'https' },
  'git+https://gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', committish: 'branch' },
  'git+https://user@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: 'user' },
  'git+https://user@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: 'user:password' },
  'git+https://user:password@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: ':password' },
  'git+https://:password@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https' },
  'git+https://gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', committish: 'branch' },
  'git+https://user@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: 'user' },
  'git+https://user@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: 'user:password' },
  'git+https://user:password@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: ':password' },
  'git+https://:password@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: ':password', committish: 'branch' },

  // https urls
  //
  // NOTE auth is accepted and respected
  // NOTE subprojects are accepted, but the subproject is treated as the project and the real project is lost
  'https://gitlab.com/foo/bar': { ...defaults, default: 'https' },
  'https://gitlab.com/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'https://user@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gitlab.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@gitlab.com/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://gitlab.com/foo/bar.git': { ...defaults, default: 'https' },
  'https://gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'https://user@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gitlab.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@gitlab.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://gitlab.com/foo/bar/baz': { ...subgroup, default: 'https' },
  'https://gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', committish: 'branch' },
  'https://user@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: 'user' },
  'https://user@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: 'user:password' },
  'https://user:password@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gitlab.com/foo/bar/baz': { ...subgroup, default: 'https', auth: ':password' },
  'https://:password@gitlab.com/foo/bar/baz#branch': { ...subgroup, default: 'https', auth: ':password', committish: 'branch' },

  'https://gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https' },
  'https://gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', committish: 'branch' },
  'https://user@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: 'user' },
  'https://user@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: 'user:password' },
  'https://user:password@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gitlab.com/foo/bar/baz.git': { ...subgroup, default: 'https', auth: ':password' },
  'https://:password@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: ':password', committish: 'branch' }
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
  const sshurl = HostedGit.fromUrl('git+ssh://gitlab.com/foo/bar')
  t.equal(sshurl.default, 'sshurl', 'got the right default')
  t.equal(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://gitlab.com/foo/bar')
  t.equal(https.default, 'https', 'got the right default')
  t.equal(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('gitlab:foo/bar')
  t.equal(shortcut.default, 'shortcut', 'got the right default')
  t.equal(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')

  t.end()
})

t.test('string methods populate correctly', t => {
  const parsed = HostedGit.fromUrl('git+ssh://gitlab.com/foo/bar')
  t.equal(parsed.getDefaultRepresentation(), parsed.default)
  t.equal(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  t.equal(parsed.ssh(), 'git@gitlab.com:foo/bar.git')
  t.equal(parsed.sshurl(), 'git+ssh://git@gitlab.com/foo/bar.git')
  t.equal(parsed.browse(), 'https://gitlab.com/foo/bar')
  t.equal(parsed.browse('/lib/index.js'), 'https://gitlab.com/foo/bar/tree/master/lib/index.js')
  t.equal(parsed.browse('/lib/index.js', 'L100'), 'https://gitlab.com/foo/bar/tree/master/lib/index.js#l100')
  t.equal(parsed.docs(), 'https://gitlab.com/foo/bar#readme')
  t.equal(parsed.https(), 'git+https://gitlab.com/foo/bar.git')
  t.equal(parsed.shortcut(), 'gitlab:foo/bar')
  t.equal(parsed.path(), 'foo/bar')
  t.equal(parsed.tarball(), 'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=master')
  t.equal(parsed.file(), 'https://gitlab.com/foo/bar/raw/master/')
  t.equal(parsed.file('/lib/index.js'), 'https://gitlab.com/foo/bar/raw/master/lib/index.js')
  t.equal(parsed.bugs(), 'https://gitlab.com/foo/bar/issues')

  t.same(parsed.git(), null, 'git() returns null')

  t.equal(parsed.docs({ committish: 'fix/bug' }), 'https://gitlab.com/foo/bar/tree/fix%2Fbug#readme', 'allows overriding options')

  const extra = HostedGit.fromUrl('https://user@gitlab.com/foo/bar#fix/bug')
  t.equal(extra.hash(), '#fix/bug')
  t.equal(extra.https(), 'git+https://user@gitlab.com/foo/bar.git#fix/bug')
  t.equal(extra.shortcut(), 'gitlab:foo/bar#fix/bug')
  t.equal(extra.ssh(), 'git@gitlab.com:foo/bar.git#fix/bug')
  t.equal(extra.sshurl(), 'git+ssh://git@gitlab.com/foo/bar.git#fix/bug')
  t.equal(extra.browse(), 'https://gitlab.com/foo/bar/tree/fix%2Fbug')
  t.equal(extra.browse('/lib/index.js'), 'https://gitlab.com/foo/bar/tree/fix%2Fbug/lib/index.js')
  t.equal(extra.browse('/lib/index.js', 'L200'), 'https://gitlab.com/foo/bar/tree/fix%2Fbug/lib/index.js#l200')
  t.equal(extra.docs(), 'https://gitlab.com/foo/bar/tree/fix%2Fbug#readme')
  t.equal(extra.file(), 'https://gitlab.com/foo/bar/raw/fix%2Fbug/')
  t.equal(extra.file('/lib/index.js'), 'https://gitlab.com/foo/bar/raw/fix%2Fbug/lib/index.js')
  t.equal(extra.tarball(), 'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=fix%2Fbug')

  t.equal(extra.sshurl({ noCommittish: true }), 'git+ssh://git@gitlab.com/foo/bar.git', 'noCommittish drops committish from urls')
  t.equal(extra.sshurl({ noGitPlus: true }), 'ssh://git@gitlab.com/foo/bar.git#fix/bug', 'noGitPlus drops git+ prefix from urls')

  t.end()
})
