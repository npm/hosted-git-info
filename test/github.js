const HostedGit = require('../index')
const t = require('tap')

const invalid = [
  // foo/bar shorthand but specifying auth
  'user@foo/bar',
  'user:password@foo/bar',
  ':password@foo/bar',
  // foo/bar shorthand but with a space in it
  'foo/ bar',
  // string that ends with a slash, probably a directory
  'foo/bar/',
  // git@github.com style, but omitting the username
  'github.com:foo/bar',
  'github.com/foo/bar',
  // invalid URI encoding
  'github:foo%0N/bar',
  // missing path
  'git+ssh://git@github.com:',
  // a deep url to something we don't know
  'https://github.com/foo/bar/issues'
]

// assigning the constructor here is hacky, but the only way to make assertions that compare
// a subset of properties to a found object pass as you would expect
const GitHost = require('../git-host')
const defaults = { constructor: GitHost, type: 'github', user: 'foo', project: 'bar' }
const valid = {
  // extreme shorthand
  //
  // NOTE these do not accept auth at all
  'foo/bar': { ...defaults, default: 'shortcut' },
  'foo/bar#branch': { ...defaults, default: 'shortcut', committish: 'branch' },

  'foo/bar.git': { ...defaults, default: 'shortcut' },
  'foo/bar.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },

  // shortcuts
  //
  // NOTE auth is accepted but ignored
  'github:foo/bar': { ...defaults, default: 'shortcut' },
  'github:foo/bar#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'github:user@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'github:user@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'github:user:password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'github:user:password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'github::password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  'github::password@foo/bar#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'github:foo/bar.git': { ...defaults, default: 'shortcut' },
  'github:foo/bar.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'github:user@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'github:user@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'github:user:password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'github:user:password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'github::password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  'github::password@foo/bar.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  // git urls
  //
  // NOTE auth is accepted and respected
  'git://github.com/foo/bar': { ...defaults, default: 'git' },
  'git://github.com/foo/bar#branch': { ...defaults, default: 'git', committish: 'branch' },
  'git://user@github.com/foo/bar': { ...defaults, default: 'git', auth: 'user' },
  'git://user@github.com/foo/bar#branch': { ...defaults, default: 'git', auth: 'user', committish: 'branch' },
  'git://user:password@github.com/foo/bar': { ...defaults, default: 'git', auth: 'user:password' },
  'git://user:password@github.com/foo/bar#branch': { ...defaults, default: 'git', auth: 'user:password', committish: 'branch' },
  'git://:password@github.com/foo/bar': { ...defaults, default: 'git', auth: ':password' },
  'git://:password@github.com/foo/bar#branch': { ...defaults, default: 'git', auth: ':password', committish: 'branch' },

  'git://github.com/foo/bar.git': { ...defaults, default: 'git' },
  'git://github.com/foo/bar.git#branch': { ...defaults, default: 'git', committish: 'branch' },
  'git://git@github.com/foo/bar.git': { ...defaults, default: 'git', auth: 'git' },
  'git://git@github.com/foo/bar.git#branch': { ...defaults, default: 'git', auth: 'git', committish: 'branch' },
  'git://user:password@github.com/foo/bar.git': { ...defaults, default: 'git', auth: 'user:password' },
  'git://user:password@github.com/foo/bar.git#branch': { ...defaults, default: 'git', auth: 'user:password', committish: 'branch' },
  'git://:password@github.com/foo/bar.git': { ...defaults, default: 'git', auth: ':password' },
  'git://:password@github.com/foo/bar.git#branch': { ...defaults, default: 'git', auth: ':password', committish: 'branch' },

  // no-protocol git+ssh
  //
  // NOTE auth is _required_ (see invalid list) but ignored
  'user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'user:password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  ':password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'user:password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  ':password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // git+ssh urls
  //
  // NOTE auth is accepted but ignored
  'git+ssh://github.com:foo/bar': { ...defaults, default: 'sshurl' },
  'git+ssh://github.com:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://github.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  'git+ssh://github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'git+ssh://user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // ssh urls
  //
  // NOTE auth is accepted but ignored
  'ssh://github.com:foo/bar': { ...defaults, default: 'sshurl' },
  'ssh://github.com:foo/bar#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@github.com:foo/bar#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://github.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  'ssh://github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', committish: 'branch' },
  'ssh://user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@github.com:foo/bar.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  // git+https urls
  //
  // NOTE auth is accepted and respected
  'git+https://github.com/foo/bar': { ...defaults, default: 'https' },
  'git+https://github.com/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@github.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://github.com/foo/bar.git': { ...defaults, default: 'https' },
  'git+https://github.com/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  // https urls
  //
  // NOTE auth is accepted and respected
  'https://github.com/foo/bar': { ...defaults, default: 'https' },
  'https://github.com/foo/bar#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  'https://user@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@github.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@github.com/foo/bar#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://github.com/foo/bar.git': { ...defaults, default: 'https' },
  'https://github.com/foo/bar.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  'https://user@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@github.com/foo/bar.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  // inputs that are not quite proper but we accept anyway
  'https://www.github.com/foo/bar': { ...defaults, default: 'https' },
  'foo/bar#branch with space': { ...defaults, default: 'shortcut', committish: 'branch with space' },
  'https://github.com/foo/bar/tree/branch': { ...defaults, default: 'https', committish: 'branch' },
  'user..blerg--/..foo-js# . . . . . some . tags / / /': { ...defaults, default: 'shortcut', user: 'user..blerg--', project: '..foo-js', committish: ' . . . . . some . tags / / /' }
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
  const sshurl = HostedGit.fromUrl('git+ssh://github.com/foo/bar')
  t.equal(sshurl.default, 'sshurl', 'got the right default')
  t.equal(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://github.com/foo/bar')
  t.equal(https.default, 'https', 'got the right default')
  t.equal(https.toString(), https.https(), 'toString calls https')

  const http = HostedGit.fromUrl('http://github.com/foo/bar')
  t.equal(http.default, 'http', 'got the right default')
  t.equal(http.toString(), http.sshurl(), 'automatically upgrades toString to sshurl')

  const git = HostedGit.fromUrl('git://github.com/foo/bar')
  t.equal(git.default, 'git', 'got the right default')
  t.equal(git.toString(), git.git(), 'toString calls git')

  const shortcut = HostedGit.fromUrl('github:foo/bar')
  t.equal(shortcut.default, 'shortcut', 'got the right default')
  t.equal(shortcut.toString(), shortcut.shortcut(), 'got the right default')

  t.end()
})

t.test('string methods populate correctly', t => {
  const parsed = HostedGit.fromUrl('git+ssh://github.com/foo/bar')
  t.equal(parsed.getDefaultRepresentation(), parsed.default)
  t.equal(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  t.equal(parsed.ssh(), 'git@github.com:foo/bar.git')
  t.equal(parsed.sshurl(), 'git+ssh://git@github.com/foo/bar.git')
  t.equal(parsed.browse(), 'https://github.com/foo/bar')
  t.equal(parsed.browse('/lib/index.js'), 'https://github.com/foo/bar/tree/master/lib/index.js')
  t.equal(parsed.browse('/lib/index.js', 'L100'), 'https://github.com/foo/bar/tree/master/lib/index.js#l100')
  t.equal(parsed.docs(), 'https://github.com/foo/bar#readme')
  t.equal(parsed.https(), 'git+https://github.com/foo/bar.git')
  t.equal(parsed.shortcut(), 'github:foo/bar')
  t.equal(parsed.path(), 'foo/bar')
  t.equal(parsed.tarball(), 'https://codeload.github.com/foo/bar/tar.gz/master')
  t.equal(parsed.file(), 'https://raw.githubusercontent.com/foo/bar/master/')
  t.equal(parsed.file('/lib/index.js'), 'https://raw.githubusercontent.com/foo/bar/master/lib/index.js')
  t.equal(parsed.git(), 'git://github.com/foo/bar.git')
  t.equal(parsed.bugs(), 'https://github.com/foo/bar/issues')

  t.equal(parsed.docs({ committish: 'fix/bug' }), 'https://github.com/foo/bar/tree/fix%2Fbug#readme', 'allows overriding options')

  const extra = HostedGit.fromUrl('https://user@github.com/foo/bar#fix/bug')
  t.equal(extra.hash(), '#fix/bug')
  t.equal(extra.https(), 'git+https://user@github.com/foo/bar.git#fix/bug')
  t.equal(extra.shortcut(), 'github:foo/bar#fix/bug')
  t.equal(extra.ssh(), 'git@github.com:foo/bar.git#fix/bug')
  t.equal(extra.sshurl(), 'git+ssh://git@github.com/foo/bar.git#fix/bug')
  t.equal(extra.browse(), 'https://github.com/foo/bar/tree/fix%2Fbug')
  t.equal(extra.browse('/lib/index.js'), 'https://github.com/foo/bar/tree/fix%2Fbug/lib/index.js')
  t.equal(extra.browse('/lib/index.js', 'L200'), 'https://github.com/foo/bar/tree/fix%2Fbug/lib/index.js#l200')
  t.equal(extra.docs(), 'https://github.com/foo/bar/tree/fix%2Fbug#readme')
  t.equal(extra.file(), 'https://user@raw.githubusercontent.com/foo/bar/fix%2Fbug/')
  t.equal(extra.file('/lib/index.js'), 'https://user@raw.githubusercontent.com/foo/bar/fix%2Fbug/lib/index.js')
  t.equal(extra.tarball(), 'https://codeload.github.com/foo/bar/tar.gz/fix%2Fbug')

  t.equal(extra.sshurl({ noCommittish: true }), 'git+ssh://git@github.com/foo/bar.git', 'noCommittish drops committish from urls')
  t.equal(extra.sshurl({ noGitPlus: true }), 'ssh://git@github.com/foo/bar.git#fix/bug', 'noGitPlus drops git+ prefix from urls')

  t.end()
})
