'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

const manifest = {
  name: 'foo',
  repository: {
    type: 'git',
    url: 'git+https://github.com/foo/bar.git',
    directory: 'packages/foo',
  },
}

test('fromManifest ignores repository.directory by default', () => {
  const parsed = HostedGit.fromManifest(manifest)
  assert.strictEqual(
    parsed.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json'
  )
  assert.strictEqual(parsed.browse(), 'https://github.com/foo/bar')
  assert.strictEqual(parsed.docs(), 'https://github.com/foo/bar#readme')

  const explicitFalse = HostedGit.fromManifest(manifest, { useDirectory: false })
  assert.strictEqual(
    explicitFalse.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json'
  )
})

test('fromManifest with useDirectory resolves file() paths in repository.directory', () => {
  const parsed = HostedGit.fromManifest(manifest, { useDirectory: true })
  assert.strictEqual(parsed.directory, undefined, 'directory is not set as an instance property')
  assert.strictEqual(parsed.opts.directory, 'packages/foo')
  assert.strictEqual(
    parsed.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/packages/foo/package.json'
  )
  assert.strictEqual(
    parsed.file('/lib/index.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/packages/foo/lib/index.js',
    'leading slash is relative to the directory'
  )
  assert.strictEqual(
    parsed.file(),
    'https://raw.githubusercontent.com/foo/bar/HEAD/packages/foo/',
    'no path points to the directory'
  )
  assert.strictEqual(
    parsed.file('package.json', { directory: '' }),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json',
    'a method option overrides the directory'
  )
  assert.strictEqual(parsed.browse(), 'https://github.com/foo/bar', 'other methods are unaffected')
  assert.strictEqual(parsed.https(), 'git+https://github.com/foo/bar.git', 'other methods are unaffected')

  const plain = HostedGit.fromManifest(manifest)
  assert.notStrictEqual(parsed, plain, 'does not share a cached instance with the default')
  assert.strictEqual(
    plain.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json'
  )
})

test('useDirectory with no usable repository.directory', () => {
  assert.strictEqual(
    HostedGit.fromManifest({ repository: 'github:foo/bar' }, { useDirectory: true }).file('a.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a.js',
    'string repository'
  )
  assert.strictEqual(
    HostedGit.fromManifest({ repository: { url: 'github:foo/bar' } }, { useDirectory: true }).file('a.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a.js',
    'missing directory'
  )
  assert.strictEqual(
    HostedGit.fromManifest(
      { repository: { url: 'github:foo/bar', directory: 42 } },
      { useDirectory: true }
    ).file('a.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a.js',
    'non-string directory'
  )
})

test('useDirectory with an unknown host still returns a url string', () => {
  const unknown = {
    repository: { url: 'https://example.com/foo/bar.git', directory: 'packages/foo' },
  }
  assert.strictEqual(
    HostedGit.fromManifest(unknown, { useDirectory: true }),
    HostedGit.fromManifest(unknown)
  )
})

test('directory option', () => {
  const parsed = HostedGit.fromUrl('https://gitlab.com/foo/bar#v1.0.0', { directory: './packages//foo/' })
  assert.strictEqual(
    parsed.file('package.json'),
    'https://gitlab.com/foo/bar/raw/v1.0.0/packages/foo/package.json',
    'empty and `.` segments are removed'
  )

  const github = HostedGit.fromUrl('github:foo/bar')
  assert.strictEqual(
    github.file('a.js', { directory: '/' }),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a.js',
    'repository root'
  )
  assert.strictEqual(
    github.file('a.js', { directory: 42 }),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a.js',
    'non-string directory is ignored'
  )
})

test('directory with `..` segments is ignored', () => {
  const github = HostedGit.fromUrl('github:foo/bar')
  for (const directory of ['../../other/repo', 'packages/../../..', '..', './..', 'a/..']) {
    assert.strictEqual(
      github.file('package.json', { directory }),
      'https://raw.githubusercontent.com/foo/bar/HEAD/package.json',
      `\`${directory}\` resolves to the repository root`
    )
  }
  for (const directory of [
    '%2e%2e/%2e%2e/%2e%2e/other/repo/HEAD',
    '.%2E/%2e./other/repo/HEAD',
    '..\\..\\..\\other\\repo\\HEAD',
    'packages\\..\\..\\..',
    '..%2f..%2f..%2fother%2frepo%2fHEAD',
    '..%5C..%5c..%5cother',
    '.\t./.\n./.\r./other/repo/HEAD',
    '..?',
    '..#',
    '%2e%2E?x',
  ]) {
    assert.strictEqual(
      github.file('package.json', { directory }),
      'https://raw.githubusercontent.com/foo/bar/HEAD/package.json',
      `url-equivalent traversal \`${JSON.stringify(directory)}\` resolves to the repository root`
    )
  }
  assert.strictEqual(
    github.file('a.js', { directory: 'packages\\foo' }),
    'https://raw.githubusercontent.com/foo/bar/HEAD/packages/foo/a.js',
    'backslashes are segment separators'
  )
  assert.strictEqual(
    github.file('a.js', { directory: '..foo/bar..' }),
    'https://raw.githubusercontent.com/foo/bar/HEAD/..foo/bar../a.js',
    'segments that merely contain `..` are kept'
  )

  const parsed = HostedGit.fromManifest(
    { repository: { url: 'github:foo/bar', directory: '../../other/repo' } },
    { useDirectory: true }
  )
  assert.strictEqual(
    parsed.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json'
  )

  const encoded = HostedGit.fromManifest(
    { repository: { url: 'github:foo/bar', directory: '%2e%2e/%2e%2e/%2e%2e/other/repo/HEAD' } },
    { useDirectory: true }
  )
  assert.strictEqual(
    encoded.file('package.json'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/package.json'
  )
})
