/* eslint-disable max-len */
const HostedGit = require('..')
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
  'https://github.com/foo/bar/issues',
]

const defaults = { type: 'github', user: 'foo', project: 'bar' }
// This is a valid git branch name that contains other occurences of the characters we check
// for to determine the committish in order to test that we parse those correctly
const committishDefaults = { committish: 'lk/br@nch.t#st:^1.0.0-pre.4' }
const valid = {
  // extreme shorthand
  //
  // NOTE these do not accept auth at all
  'foo/bar': { ...defaults, default: 'shortcut' },
  [`foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', ...committishDefaults },

  'foo/bar.git': { ...defaults, default: 'shortcut' },
  [`foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', ...committishDefaults },

  // shortcuts
  //
  // NOTE auth is accepted but ignored
  'github:foo/bar': { ...defaults, default: 'shortcut' },
  [`github:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', ...committishDefaults },
  'github:user@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  [`github:user@foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },
  'github:user:password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  [`github:user:password@foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },
  'github::password@foo/bar': { ...defaults, default: 'shortcut', auth: null },
  [`github::password@foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },

  'github:foo/bar.git': { ...defaults, default: 'shortcut' },
  [`github:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', ...committishDefaults },
  'github:user@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  [`github:user@foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },
  'github:user:password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  [`github:user:password@foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },
  'github::password@foo/bar.git': { ...defaults, default: 'shortcut', auth: null },
  [`github::password@foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'shortcut', auth: null, ...committishDefaults },

  // git urls
  //
  // NOTE auth is accepted and respected
  'git://github.com/foo/bar': { ...defaults, default: 'git' },
  [`git://github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'git', ...committishDefaults },
  'git://user@github.com/foo/bar': { ...defaults, default: 'git', auth: 'user' },
  [`git://user@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: 'user', ...committishDefaults },
  'git://user:password@github.com/foo/bar': { ...defaults, default: 'git', auth: 'user:password' },
  [`git://user:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: 'user:password', ...committishDefaults },
  'git://:password@github.com/foo/bar': { ...defaults, default: 'git', auth: ':password' },
  [`git://:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: ':password', ...committishDefaults },

  'git://github.com/foo/bar.git': { ...defaults, default: 'git' },
  [`git://github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'git', ...committishDefaults },
  'git://git@github.com/foo/bar.git': { ...defaults, default: 'git', auth: 'git' },
  [`git://git@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: 'git', ...committishDefaults },
  'git://user:password@github.com/foo/bar.git': { ...defaults, default: 'git', auth: 'user:password' },
  [`git://user:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: 'user:password', ...committishDefaults },
  'git://:password@github.com/foo/bar.git': { ...defaults, default: 'git', auth: ':password' },
  [`git://:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'git', auth: ':password', ...committishDefaults },

  // no-protocol git+ssh
  //
  // NOTE auth is _required_ (see invalid list) but ignored
  'user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`user@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`user:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  ':password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  'user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`user@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`user:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  ':password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  // git+ssh urls
  //
  // NOTE auth is accepted but ignored
  'git+ssh://github.com:foo/bar': { ...defaults, default: 'sshurl' },
  [`git+ssh://github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', ...committishDefaults },
  'git+ssh://user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://user@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'git+ssh://user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://user:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'git+ssh://:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  'git+ssh://github.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  [`git+ssh://github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', ...committishDefaults },
  'git+ssh://user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://user@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'git+ssh://user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://user:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'git+ssh://:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`git+ssh://:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  // ssh urls
  //
  // NOTE auth is accepted but ignored
  'ssh://github.com:foo/bar': { ...defaults, default: 'sshurl' },
  [`ssh://github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', ...committishDefaults },
  'ssh://user@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://user@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'ssh://user:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://user:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'ssh://:password@github.com:foo/bar': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://:password@github.com:foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  'ssh://github.com:foo/bar.git': { ...defaults, default: 'sshurl' },
  [`ssh://github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', ...committishDefaults },
  'ssh://user@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://user@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'ssh://user:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://user:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },
  'ssh://:password@github.com:foo/bar.git': { ...defaults, default: 'sshurl', auth: null },
  [`ssh://:password@github.com:foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'sshurl', auth: null, ...committishDefaults },

  // git+https urls
  //
  // NOTE auth is accepted and respected
  'git+https://github.com/foo/bar': { ...defaults, default: 'https' },
  [`git+https://github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', ...committishDefaults },
  'git+https://user@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  [`git+https://user@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user', ...committishDefaults },
  'git+https://user:password@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  [`git+https://user:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user:password', ...committishDefaults },
  'git+https://:password@github.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  [`git+https://:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: ':password', ...committishDefaults },

  'git+https://github.com/foo/bar.git': { ...defaults, default: 'https' },
  [`git+https://github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', ...committishDefaults },
  'git+https://user@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  [`git+https://user@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user', ...committishDefaults },
  'git+https://user:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  [`git+https://user:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user:password', ...committishDefaults },
  'git+https://:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  [`git+https://:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: ':password', ...committishDefaults },

  // https urls
  //
  // NOTE auth is accepted and respected
  'https://github.com/foo/bar': { ...defaults, default: 'https' },
  [`https://github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', ...committishDefaults },
  'https://user@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user' },
  [`https://user@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user', ...committishDefaults },
  'https://user:password@github.com/foo/bar': { ...defaults, default: 'https', auth: 'user:password' },
  [`https://user:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user:password', ...committishDefaults },
  'https://:password@github.com/foo/bar': { ...defaults, default: 'https', auth: ':password' },
  [`https://:password@github.com/foo/bar#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: ':password', ...committishDefaults },

  'https://github.com/foo/bar.git': { ...defaults, default: 'https' },
  [`https://github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', ...committishDefaults },
  'https://user@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user' },
  [`https://user@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user', ...committishDefaults },
  'https://user:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: 'user:password' },
  [`https://user:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: 'user:password', ...committishDefaults },
  'https://:password@github.com/foo/bar.git': { ...defaults, default: 'https', auth: ':password' },
  [`https://:password@github.com/foo/bar.git#${committishDefaults.committish}`]: { ...defaults, default: 'https', auth: ':password', ...committishDefaults },

  // inputs that are not quite proper but we accept anyway
  'https://www.github.com/foo/bar': { ...defaults, default: 'https' },
  'foo/bar#branch with space': { ...defaults, default: 'shortcut', committish: 'branch with space' },
  'foo/bar#branch:with:colons': { ...defaults, default: 'shortcut', committish: 'branch:with:colons' },
  'https://github.com/foo/bar/tree/branch': { ...defaults, default: 'https', committish: 'branch' },
  'user..blerg--/..foo-js# . . . . . some . tags / / /': { ...defaults, default: 'shortcut', user: 'user..blerg--', project: '..foo-js', committish: ' . . . . . some . tags / / /' },
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
  t.equal(parsed.edit(), 'https://github.com/foo/bar')
  t.equal(parsed.edit('/lib/index.js'), 'https://github.com/foo/bar/edit/HEAD/lib/index.js')
  t.equal(parsed.edit('/lib/index.js', { committish: 'docs' }), 'https://github.com/foo/bar/edit/docs/lib/index.js')
  t.equal(parsed.browse(), 'https://github.com/foo/bar')
  t.equal(parsed.browse('/lib/index.js'), 'https://github.com/foo/bar/tree/HEAD/lib/index.js')
  t.equal(parsed.browse('/lib/index.js', 'L100'), 'https://github.com/foo/bar/tree/HEAD/lib/index.js#l100')
  t.equal(parsed.browseFile('/lib/index.js'), 'https://github.com/foo/bar/blob/HEAD/lib/index.js')
  t.equal(parsed.browseFile('/lib/index.js', 'L100'), 'https://github.com/foo/bar/blob/HEAD/lib/index.js#l100')
  t.equal(parsed.docs(), 'https://github.com/foo/bar#readme')
  t.equal(parsed.https(), 'git+https://github.com/foo/bar.git')
  t.equal(parsed.shortcut(), 'github:foo/bar')
  t.equal(parsed.path(), 'foo/bar')
  t.equal(parsed.tarball(), 'https://codeload.github.com/foo/bar/tar.gz/HEAD')
  t.equal(parsed.file(), 'https://raw.githubusercontent.com/foo/bar/HEAD/')
  t.equal(parsed.file('/lib/index.js'), 'https://raw.githubusercontent.com/foo/bar/HEAD/lib/index.js')
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
