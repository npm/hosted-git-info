const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

test('file:// URLs', () => {
  const fileRepo = {
    name: 'foo',
    repository: {
      url: 'file:///path/dot.git',
    },
  }
  assert.strictEqual(HostedGit.fromManifest(fileRepo), null)
})

test('file() url-encodes each path segment', () => {
  const parsed = HostedGit.fromUrl('github:foo/bar')
  assert.strictEqual(
    parsed.file('dir with space/file #1?.md'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/dir%20with%20space/file%20%231%3F.md'
  )
  assert.strictEqual(
    parsed.file('/100%/a&b.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/100%25/a&b.js',
    'leading slash is still stripped'
  )
  assert.strictEqual(
    parsed.file('lib/index.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/lib/index.js',
    'plain paths are unchanged'
  )
  assert.strictEqual(
    parsed.file('a%20b'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/a%2520b',
    'already-encoded paths are encoded again'
  )

  const sourcehut = HostedGit.fromUrl('https://git.sr.ht/~foo/bar')
  assert.strictEqual(
    sourcehut.file('a b/c#d'),
    'https://git.sr.ht/~foo/bar/blob/HEAD/a%20b/c%23d'
  )
})

test('file() does not encode characters that are valid in a url path', () => {
  const parsed = HostedGit.fromUrl('github:foo/bar')
  assert.strictEqual(
    parsed.file('node_modules/@types/x/index.d.ts'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/node_modules/@types/x/index.d.ts',
    'scoped package paths are unchanged'
  )
  assert.strictEqual(
    parsed.file("@scope/pkg/a+b:c,d=e;f&g$h!i'j(k)l*m~n.js"),
    "https://raw.githubusercontent.com/foo/bar/HEAD/@scope/pkg/a+b:c,d=e;f&g$h!i'j(k)l*m~n.js"
  )
})

test('file() does not throw on lone surrogates', () => {
  const parsed = HostedGit.fromUrl('github:foo/bar')
  assert.strictEqual(
    parsed.file('\uD800.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/%EF%BF%BD.js'
  )
  assert.strictEqual(
    parsed.file('x\uDC00/a.js'),
    'https://raw.githubusercontent.com/foo/bar/HEAD/x%EF%BF%BD/a.js'
  )
})
