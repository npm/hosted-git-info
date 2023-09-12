'use strict'
const HostedGit = require('..')
const t = require('tap')

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
  const sshurl = HostedGit.fromUrl('git+ssh://git.sr.ht/~foo/bar')
  t.equal(sshurl.default, 'sshurl', 'got the right default')
  t.equal(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://git.sr.ht/~foo/bar')
  t.equal(https.default, 'https', 'got the right default')
  t.equal(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('sourcehut:~foo/bar')
  t.equal(shortcut.default, 'shortcut', 'got the right default')
  t.equal(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')

  t.end()
})

t.test('string methods populate correctly', t => {
  const parsed = HostedGit.fromUrl('git+ssh://git.sr.ht/~foo/bar')
  t.equal(parsed.getDefaultRepresentation(), parsed.default, 'getDefaultRepresentation()')
  t.equal(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  t.equal(parsed.ssh(), 'git@git.sr.ht:~foo/bar.git')
  t.equal(parsed.sshurl(), 'git+ssh://git@git.sr.ht/~foo/bar.git')
  t.equal(parsed.edit('/lib/index.js'), 'https://git.sr.ht/~foo/bar', 'no editing, link to browse')
  t.equal(parsed.edit(), 'https://git.sr.ht/~foo/bar', 'no editing, link to browse')
  t.equal(parsed.browse(), 'https://git.sr.ht/~foo/bar')
  t.equal(parsed.browse('/lib/index.js'), 'https://git.sr.ht/~foo/bar/tree/HEAD/lib/index.js')
  t.equal(
    parsed.browse('/lib/index.js', 'L100'),
    'https://git.sr.ht/~foo/bar/tree/HEAD/lib/index.js#l100'
  )
  t.equal(parsed.docs(), 'https://git.sr.ht/~foo/bar#readme')
  t.equal(parsed.https(), 'https://git.sr.ht/~foo/bar.git')
  t.equal(parsed.shortcut(), 'sourcehut:~foo/bar')
  t.equal(parsed.path(), '~foo/bar')
  t.equal(parsed.tarball(), 'https://git.sr.ht/~foo/bar/archive/HEAD.tar.gz')
  t.equal(parsed.file(), 'https://git.sr.ht/~foo/bar/blob/HEAD/')
  t.equal(parsed.file('/lib/index.js'), 'https://git.sr.ht/~foo/bar/blob/HEAD/lib/index.js')
  t.equal(parsed.bugs(), null)

  t.equal(
    parsed.docs({ committish: 'fix/bug' }),
    'https://git.sr.ht/~foo/bar/tree/fix%2Fbug#readme',
    'allows overriding options'
  )

  t.same(parsed.git(), null, 'git() returns null')

  const extra = HostedGit.fromUrl('https://@git.sr.ht/~foo/bar#fix/bug')
  t.equal(extra.hash(), '#fix/bug')
  t.equal(extra.https(), 'https://git.sr.ht/~foo/bar.git#fix/bug')
  t.equal(extra.shortcut(), 'sourcehut:~foo/bar#fix/bug')
  t.equal(extra.ssh(), 'git@git.sr.ht:~foo/bar.git#fix/bug')
  t.equal(extra.sshurl(), 'git+ssh://git@git.sr.ht/~foo/bar.git#fix/bug')
  t.equal(extra.browse(), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug')
  t.equal(extra.browse('/lib/index.js'), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug/lib/index.js')
  t.equal(
    extra.browse('/lib/index.js', 'L200'),
    'https://git.sr.ht/~foo/bar/tree/fix%2Fbug/lib/index.js#l200'
  )
  t.equal(extra.docs(), 'https://git.sr.ht/~foo/bar/tree/fix%2Fbug#readme')
  t.equal(extra.file(), 'https://git.sr.ht/~foo/bar/blob/fix%2Fbug/')
  t.equal(extra.file('/lib/index.js'), 'https://git.sr.ht/~foo/bar/blob/fix%2Fbug/lib/index.js')

  t.equal(
    extra.sshurl({ noCommittish: true }),
    'git+ssh://git@git.sr.ht/~foo/bar.git',
    'noCommittish drops committish from urls'
  )
  t.equal(
    extra.sshurl({ noGitPlus: true }),
    'ssh://git@git.sr.ht/~foo/bar.git#fix/bug',
    'noGitPlus drops git+ prefix from urls'
  )

  t.end()
})
