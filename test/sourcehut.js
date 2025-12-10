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
  // missing project
  'https://git.sr.ht/~foo',
  // invalid protocos
  'git://git@git.sr.ht:~foo/bar',
  'ssh://git.sr.ht:~foo/bar',
  // tarball url
  'https://git.sr.ht/~foo/bar/archive/HEAD.tar.gz',
]

const defaults = { type: 'sourcehut', user: '~foo', project: 'bar' }

const valid = {
  // shortucts
  'sourcehut:~foo/bar': { ...defaults, default: 'shortcut' },
  'sourcehut:~foo/bar#branch': { ...defaults, default: 'shortcut', committish: 'branch' },

  // shortcuts (.git)
  'sourcehut:~foo/bar.git': { ...defaults, default: 'shortcut' },
  'sourcehut:~foo/bar.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },

  // no-protocol git+ssh
  'git@git.sr.ht:~foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git@git.sr.ht:~foo/bar#branch': {
    ...defaults, default: 'sshurl', auth: null, committish: 'branch',
  },

  // no-protocol git+ssh (.git)
  'git@git.sr.ht:~foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git@git.sr.ht:~foo/bar.git#branch': {
    ...defaults, default: 'sshurl', auth: null, committish: 'branch',
  },

  // git+ssh urls
  'git+ssh://git@git.sr.ht:~foo/bar': { ...defaults, default: 'sshurl' },
  'git+ssh://git@git.sr.ht:~foo/bar#branch': {
    ...defaults, default: 'sshurl', committish: 'branch',
  },

  // git+ssh urls (.git)
  'git+ssh://git@git.sr.ht:~foo/bar.git': { ...defaults, default: 'sshurl' },
  'git+ssh://git@git.sr.ht:~foo/bar.git#branch': {
    ...defaults, default: 'sshurl', committish: 'branch',
  },

  // https urls
  'https://git.sr.ht/~foo/bar': { ...defaults, default: 'https' },
  'https://git.sr.ht/~foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },

  'https://git.sr.ht/~foo/bar.git': { ...defaults, default: 'https' },
  'https://git.sr.ht/~foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
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
  const sshurl = HostedGit.fromUrl('git+ssh://git.sr.ht/~foo/bar')
  assert.strictEqual(sshurl.default, 'sshurl', 'got the right default')
  assert.strictEqual(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://git.sr.ht/~foo/bar')
  assert.strictEqual(https.default, 'https', 'got the right default')
  assert.strictEqual(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('sourcehut:~foo/bar')
  assert.strictEqual(shortcut.default, 'shortcut', 'got the right default')
  assert.strictEqual(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')
})

test('string methods populate correctly', () => {
  const parsed = HostedGit.fromUrl('git+ssh://git.sr.ht/~foo/bar')
  assert.strictEqual(parsed.getDefaultRepresentation(), parsed.default, 'getDefaultRepresentation()')
  assert.strictEqual(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  assert.strictEqual(parsed.ssh(), 'git@git.sr.ht:~foo/bar.git')
  assert.strictEqual(parsed.sshurl(), 'git+ssh://git@git.sr.ht/~foo/bar.git')
  assert.strictEqual(parsed.edit('/lib/index.js'), 'https://git.sr.ht/~foo/bar', 'no editing, link to browse')
  assert.strictEqual(parsed.edit(), 'https://git.sr.ht/~foo/bar', 'no editing, link to browse')
  assert.strictEqual(parsed.browse(), 'https://git.sr.ht/~foo/bar')
  assert.strictEqual(parsed.browse('/lib/index.js'), 'https://git.sr.ht/~foo/bar/tree/HEAD/lib/index.js')
  assert.strictEqual(
    parsed.browse('/lib/index.js', 'L100'),
    'https://git.sr.ht/~foo/bar/tree/HEAD/lib/index.js#l100'
  )
  assert.strictEqual(parsed.docs(), 'https://git.sr.ht/~foo/bar#readme')
  assert.strictEqual(parsed.https(), 'https://git.sr.ht/~foo/bar.git')
  assert.strictEqual(parsed.shortcut(), 'sourcehut:~foo/bar')
  assert.strictEqual(parsed.path(), '~foo/bar')
  assert.strictEqual(parsed.tarball(), 'https://git.sr.ht/~foo/bar/archive/HEAD.tar.gz')
  assert.strictEqual(parsed.file(), 'https://git.sr.ht/~foo/bar/blob/HEAD/')
  assert.strictEqual(parsed.file('/lib/index.js'), 'https://git.sr.ht/~foo/bar/blob/HEAD/lib/index.js')
  assert.strictEqual(parsed.bugs(), null)

  assert.strictEqual(
    parsed.docs({ committish: 'fix/bug' }),
    'https://git.sr.ht/~foo/bar/tree/fix%2Fbug#readme',
    'allows overriding options'
  )

  assert.deepStrictEqual(parsed.git(), null, 'git() returns null')

  const extra = HostedGit.fromUrl('https://@git.sr.ht/~foo/bar#fix/bug')
  assert.strictEqual(extra.hash(), '#fix/bug')
  assert.strictEqual(extra.https(), 'https://git.sr.ht/~foo/bar.git#fix/bug')
  assert.strictEqual(extra.shortcut(), 'sourcehut:~foo/bar#fix/bug')
  assert.strictEqual(extra.ssh(), 'git@git.sr.ht:~foo/bar.git#fix/bug')
  assert.strictEqual(extra.sshurl(), 'git+ssh://git@git.sr.ht/~foo/bar.git#fix/bug')
  assert.strictEqual(extra.browse(), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug')
  assert.strictEqual(extra.browse('/lib/index.js'), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug/lib/index.js')
  assert.strictEqual(
    extra.browse('/lib/index.js', 'L200'),
    'https://git.sr.ht/~foo/bar/tree/fix%2Fbug/lib/index.js#l200'
  )
  assert.strictEqual(extra.docs(), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug#readme')
  assert.strictEqual(extra.file(), 'https://git.sr.ht/~foo/bar/blob/fix%2Fbug/')
  assert.strictEqual(extra.file('/lib/index.js'), 'https://git.sr.ht/~foo/bar/blob/fix%2Fbug/lib/index.js')

  assert.strictEqual(
    extra.sshurl({ noCommittish: true }),
    'git+ssh://git@git.sr.ht/~foo/bar.git',
    'noCommittish drops committish from urls'
  )
  assert.strictEqual(
    extra.sshurl({ noGitPlus: true }),
    'ssh://git@git.sr.ht/~foo/bar.git#fix/bug',
    'noGitPlus drops git+ prefix from urls'
  )
})
