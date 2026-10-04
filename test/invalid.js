const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')
const { LRUCache } = require('../lib/lru-cache')

// each of these urls should return `undefined`
// none should throw
const urls = [
  'https://google.com',
  'git+ssh://git@nothosted.com/abc/def',
  'git://nothosted.com',
  'git+file:///foo/bar',
  'git+ssh://git@git.unlucky.com:RND/electron-tools/some-tool#2.0.1',
  '::',
  '',
  null,
  undefined,
]

test('invalid results parse to undefined', () => {
  for (const url of urls) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})

test('repeated failed parses are cached without changing the return value', t => {
  const set = t.mock.method(LRUCache.prototype, 'set')
  const spec = '^9876.5.4'
  assert.strictEqual(HostedGit.fromUrl(spec), undefined)
  assert.strictEqual(HostedGit.fromUrl(spec), undefined)
  assert.strictEqual(set.mock.callCount(), 1)
})

test('failed results share bounded LRU capacity with successful results', t => {
  const misses = Array.from({ length: 999 }, (_, i) => `^9876.6.${i}`)
  for (const spec of misses) {
    assert.strictEqual(HostedGit.fromUrl(spec), undefined)
  }
  const url = 'https://github.com/cache-test/success'
  const success = HostedGit.fromUrl(url)
  assert.strictEqual(success.project, 'success')

  const set = t.mock.method(LRUCache.prototype, 'set')
  assert.strictEqual(HostedGit.fromUrl(misses[0]), undefined)
  assert.strictEqual(set.mock.callCount(), 0, 'negative cache hit refreshes recency')
  assert.strictEqual(HostedGit.fromUrl('^9876.7.0'), undefined)
  assert.strictEqual(set.mock.callCount(), 1, 'new entry exceeds the 1000-entry capacity')
  assert.strictEqual(HostedGit.fromUrl(misses[0]), undefined)
  assert.strictEqual(HostedGit.fromUrl(url), success)
  assert.strictEqual(set.mock.callCount(), 1, 'recent failure and success remain cached')
  assert.strictEqual(HostedGit.fromUrl(misses[1]), undefined)
  assert.strictEqual(set.mock.callCount(), 2, 'least recently used failure is reparsed')
})

test('a cached failure is invalidated when a host is registered', () => {
  const url = 'git://new-host.example/user/repo'
  const shortcut = 'new-host:user/repo'
  assert.strictEqual(HostedGit.fromUrl(url), undefined)
  assert.strictEqual(HostedGit.fromUrl(shortcut), undefined)
  HostedGit.addHost('new-host', {
    protocols: ['git:'],
    domain: 'new-host.example',
    extract: parsed => {
      const [, user, project] = parsed.pathname.split('/')
      return { user, project, committish: parsed.hash.slice(1) }
    },
  })
  assert.strictEqual(HostedGit.fromUrl(url).type, 'new-host')
  assert.strictEqual(HostedGit.fromUrl(shortcut).type, 'new-host')
})
