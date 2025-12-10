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
  // invalid protocol
  'git://bitbucket.org/foo/bar',
  // url to get a tarball
  'https://bitbucket.org/foo/bar/get/archive.tar.gz',
  // missing project
  'https://bitbucket.org/foo',
]

const defaults = { type: 'bitbucket', user: 'foo', project: 'bar' }

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
  'https://:password@bitbucket.org/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },
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
  const sshurl = HostedGit.fromUrl('git+ssh://bitbucket.org/foo/bar')
  assert.strictEqual(sshurl.default, 'sshurl', 'got the right default')
  assert.strictEqual(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://bitbucket.org/foo/bar')
  assert.strictEqual(https.default, 'https', 'got the right default')
  assert.strictEqual(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('bitbucket:foo/bar')
  assert.strictEqual(shortcut.default, 'shortcut', 'got the right default')
  assert.strictEqual(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')
})

test('string methods populate correctly', () => {
  const parsed = HostedGit.fromUrl('git+ssh://bitbucket.org/foo/bar')
  assert.strictEqual(parsed.getDefaultRepresentation(), parsed.default, 'getDefaultRepresentation()')
  assert.strictEqual(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  assert.strictEqual(parsed.ssh(), 'git@bitbucket.org:foo/bar.git')
  assert.strictEqual(parsed.sshurl(), 'git+ssh://git@bitbucket.org/foo/bar.git')
  assert.strictEqual(parsed.edit(), 'https://bitbucket.org/foo/bar')
  assert.strictEqual(parsed.edit('/lib/index.js'), 'https://bitbucket.org/foo/bar/src/HEAD/lib/index.js?mode=edit')
  assert.strictEqual(parsed.browse(), 'https://bitbucket.org/foo/bar')
  assert.strictEqual(parsed.browse('/lib/index.js'), 'https://bitbucket.org/foo/bar/src/HEAD/lib/index.js')
  assert.strictEqual(parsed.browse('/lib/index.js', 'L100'), 'https://bitbucket.org/foo/bar/src/HEAD/lib/index.js#l100')
  assert.strictEqual(parsed.docs(), 'https://bitbucket.org/foo/bar#readme')
  assert.strictEqual(parsed.https(), 'git+https://bitbucket.org/foo/bar.git')
  assert.strictEqual(parsed.shortcut(), 'bitbucket:foo/bar')
  assert.strictEqual(parsed.path(), 'foo/bar')
  assert.strictEqual(parsed.tarball(), 'https://bitbucket.org/foo/bar/get/HEAD.tar.gz')
  assert.strictEqual(parsed.file(), 'https://bitbucket.org/foo/bar/raw/HEAD/')
  assert.strictEqual(parsed.file('/lib/index.js'), 'https://bitbucket.org/foo/bar/raw/HEAD/lib/index.js')
  assert.strictEqual(parsed.bugs(), 'https://bitbucket.org/foo/bar/issues')

  assert.strictEqual(parsed.docs({ committish: 'fix/bug' }), 'https://bitbucket.org/foo/bar/src/fix%2Fbug#readme', 'allows overriding options')

  assert.deepStrictEqual(parsed.git(), null, 'git() returns null')

  const extra = HostedGit.fromUrl('https://user@bitbucket.org/foo/bar#fix/bug')
  assert.strictEqual(extra.hash(), '#fix/bug')
  assert.strictEqual(extra.https(), 'git+https://user@bitbucket.org/foo/bar.git#fix/bug')
  assert.strictEqual(extra.shortcut(), 'bitbucket:foo/bar#fix/bug')
  assert.strictEqual(extra.ssh(), 'git@bitbucket.org:foo/bar.git#fix/bug')
  assert.strictEqual(extra.sshurl(), 'git+ssh://git@bitbucket.org/foo/bar.git#fix/bug')
  assert.strictEqual(extra.browse(), 'https://bitbucket.org/foo/bar/src/fix%2Fbug')
  assert.strictEqual(extra.browse('/lib/index.js'), 'https://bitbucket.org/foo/bar/src/fix%2Fbug/lib/index.js')
  assert.strictEqual(extra.browse('/lib/index.js', 'L200'), 'https://bitbucket.org/foo/bar/src/fix%2Fbug/lib/index.js#l200')
  assert.strictEqual(extra.docs(), 'https://bitbucket.org/foo/bar/src/fix%2Fbug#readme')
  assert.strictEqual(extra.file(), 'https://bitbucket.org/foo/bar/raw/fix%2Fbug/')
  assert.strictEqual(extra.file('/lib/index.js'), 'https://bitbucket.org/foo/bar/raw/fix%2Fbug/lib/index.js')

  assert.strictEqual(extra.sshurl({ noCommittish: true }), 'git+ssh://git@bitbucket.org/foo/bar.git', 'noCommittish drops committish from urls')
  assert.strictEqual(extra.sshurl({ noGitPlus: true }), 'ssh://git@bitbucket.org/foo/bar.git#fix/bug', 'noGitPlus drops git+ prefix from urls')
})
