/* eslint-disable max-len */
'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

// Helper function to assert actual object contains all expected properties
const assertHasStrict = (actual, expected, message) => {
  for (const [key, value] of Object.entries(expected)) {
    assert.strictEqual(actual[key], value, `${message} (${key})`)
  }
}

const invalid = [
  // gitlab urls can contain a /-/ segment, make sure we ignore those
  'https://gitlab.com/foo/-/something',
  // missing project
  'https://gitlab.com/foo',
  // tarball, this should not parse so that it can be used for pacote's remote fetcher
  'https://gitlab.com/foo/bar/repository/archive.tar.gz',
  'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=49b393e2ded775f2df36ef2ffcb61b0359c194c9',
]

const defaults = { type: 'gitlab', user: 'foo', project: 'bar' }
const subgroup = { type: 'gitlab', user: 'foo/bar', project: 'baz' }
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
  'https://:password@gitlab.com/foo/bar/baz.git#branch': { ...subgroup, default: 'https', auth: ':password', committish: 'branch' },
}

test('valid urls parse properly', () => {
  for (const [url, result] of Object.entries(valid)) {
    const parsed = HostedGit.fromUrl(url)
    assertHasStrict(parsed, result, `${url} parses`)
  }
})

test('invalid urls return undefined', () => {
  for (const url of invalid) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})

test('toString respects defaults', () => {
  const sshurl = HostedGit.fromUrl('git+ssh://gitlab.com/foo/bar')
  assert.strictEqual(sshurl.default, 'sshurl', 'got the right default')
  assert.strictEqual(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://gitlab.com/foo/bar')
  assert.strictEqual(https.default, 'https', 'got the right default')
  assert.strictEqual(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('gitlab:foo/bar')
  assert.strictEqual(shortcut.default, 'shortcut', 'got the right default')
  assert.strictEqual(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')
})

test('string methods populate correctly', () => {
  const parsed = HostedGit.fromUrl('git+ssh://gitlab.com/foo/bar')
  assert.strictEqual(parsed.getDefaultRepresentation(), parsed.default)
  assert.strictEqual(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  assert.strictEqual(parsed.ssh(), 'git@gitlab.com:foo/bar.git')
  assert.strictEqual(parsed.sshurl(), 'git+ssh://git@gitlab.com/foo/bar.git')
  assert.strictEqual(parsed.edit(), 'https://gitlab.com/foo/bar')
  assert.strictEqual(parsed.edit('/lib/index.js'), 'https://gitlab.com/foo/bar/-/edit/HEAD/lib/index.js')
  assert.strictEqual(parsed.browse(), 'https://gitlab.com/foo/bar')
  assert.strictEqual(parsed.browse('/lib/index.js'), 'https://gitlab.com/foo/bar/tree/HEAD/lib/index.js')
  assert.strictEqual(parsed.browse('/lib/index.js', 'L100'), 'https://gitlab.com/foo/bar/tree/HEAD/lib/index.js#l100')
  assert.strictEqual(parsed.docs(), 'https://gitlab.com/foo/bar#readme')
  assert.strictEqual(parsed.https(), 'git+https://gitlab.com/foo/bar.git')
  assert.strictEqual(parsed.shortcut(), 'gitlab:foo/bar')
  assert.strictEqual(parsed.path(), 'foo/bar')
  assert.strictEqual(parsed.tarball(), 'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=HEAD')
  assert.strictEqual(parsed.file(), 'https://gitlab.com/foo/bar/raw/HEAD/')
  assert.strictEqual(parsed.file('/lib/index.js'), 'https://gitlab.com/foo/bar/raw/HEAD/lib/index.js')
  assert.strictEqual(parsed.bugs(), 'https://gitlab.com/foo/bar/issues')

  assert.deepStrictEqual(parsed.git(), null, 'git() returns null')

  assert.strictEqual(parsed.docs({ committish: 'fix/bug' }), 'https://gitlab.com/foo/bar/tree/fix%2Fbug#readme', 'allows overriding options')

  const extra = HostedGit.fromUrl('https://user@gitlab.com/foo/bar#fix/bug')
  assert.strictEqual(extra.hash(), '#fix/bug')
  assert.strictEqual(extra.https(), 'git+https://user@gitlab.com/foo/bar.git#fix/bug')
  assert.strictEqual(extra.shortcut(), 'gitlab:foo/bar#fix/bug')
  assert.strictEqual(extra.ssh(), 'git@gitlab.com:foo/bar.git#fix/bug')
  assert.strictEqual(extra.sshurl(), 'git+ssh://git@gitlab.com/foo/bar.git#fix/bug')
  assert.strictEqual(extra.browse(), 'https://gitlab.com/foo/bar/tree/fix%2Fbug')
  assert.strictEqual(extra.browse('/lib/index.js'), 'https://gitlab.com/foo/bar/tree/fix%2Fbug/lib/index.js')
  assert.strictEqual(extra.browse('/lib/index.js', 'L200'), 'https://gitlab.com/foo/bar/tree/fix%2Fbug/lib/index.js#l200')
  assert.strictEqual(extra.docs(), 'https://gitlab.com/foo/bar/tree/fix%2Fbug#readme')
  assert.strictEqual(extra.file(), 'https://gitlab.com/foo/bar/raw/fix%2Fbug/')
  assert.strictEqual(extra.file('/lib/index.js'), 'https://gitlab.com/foo/bar/raw/fix%2Fbug/lib/index.js')
  assert.strictEqual(extra.tarball(), 'https://gitlab.com/foo/bar/repository/archive.tar.gz?ref=fix%2Fbug')

  assert.strictEqual(extra.sshurl({ noCommittish: true }), 'git+ssh://git@gitlab.com/foo/bar.git', 'noCommittish drops committish from urls')
  assert.strictEqual(extra.sshurl({ noGitPlus: true }), 'ssh://git@gitlab.com/foo/bar.git#fix/bug', 'noGitPlus drops git+ prefix from urls')
})

test('from manifest', () => {
  assert.strictEqual(HostedGit.fromManifest(), undefined, 'no manifest returns undefined')
  assert.strictEqual(HostedGit.fromManifest(), undefined, 'no manifest returns undefined')
  assert.strictEqual(HostedGit.fromManifest(false), undefined, 'false manifest returns undefined')
  assert.strictEqual(HostedGit.fromManifest(() => {}), undefined, 'function manifest returns undefined')

  const unknownHostRepo = {
    name: 'foo',
    repository: {
      url: 'https://nope.com',
    },
  }
  assert.deepStrictEqual(HostedGit.fromManifest(unknownHostRepo), 'https://nope.com/')

  const insecureUnknownHostRepo = {
    name: 'foo',
    repository: {
      url: 'http://nope.com',
    },
  }
  assert.deepStrictEqual(HostedGit.fromManifest(insecureUnknownHostRepo), 'https://nope.com/')

  const insecureGitUnknownHostRepo = {
    name: 'foo',
    repository: {
      url: 'git+http://nope.com',
    },
  }
  assert.deepStrictEqual(HostedGit.fromManifest(insecureGitUnknownHostRepo), 'http://nope.com')

  const badRepo = {
    name: 'foo',
    repository: {
      url: '#',
    },
  }
  assert.strictEqual(HostedGit.fromManifest(badRepo), null)

  const manifest = {
    name: 'foo',
    repository: {
      type: 'git',
      url: 'git+ssh://gitlab.com/foo/bar.git',
    },
  }

  const parsed = HostedGit.fromManifest(manifest)
  assert.deepStrictEqual(parsed.browse(), 'https://gitlab.com/foo/bar')

  const monorepo = {
    name: 'clowncar',
    repository: {
      type: 'git',
      url: 'git+ssh://gitlab.com/foo/bar.git',
      directory: 'packages/foo',
    },
  }

  const honk = HostedGit.fromManifest(monorepo)
  assert.deepStrictEqual(honk.browse(monorepo.repository.directory), 'https://gitlab.com/foo/bar/tree/HEAD/packages/foo')

  const stringRepo = {
    name: 'foo',
    repository: 'git+ssh://gitlab.com/foo/bar.git',
  }
  const stringRepoParsed = HostedGit.fromManifest(stringRepo)
  assert.deepStrictEqual(stringRepoParsed.browse(), 'https://gitlab.com/foo/bar')

  const nonStringRepo = {
    name: 'foo',
    repository: 42,
  }
  assert.throws(() => HostedGit.fromManifest(nonStringRepo))
})
