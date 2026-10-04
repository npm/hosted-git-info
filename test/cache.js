const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

const cached = Symbol('cached')

test('fromUrl caches results', () => {
  const repo = HostedGit.fromUrl('https://github.com/foo/bar')
  repo[cached] = true

  const cachedRepo = HostedGit.fromUrl('https://github.com/foo/bar')
  assert.strictEqual(cachedRepo[cached], true)

  const uncachedRepo = HostedGit.fromUrl('https://github.com/bar/baz')
  assert.strictEqual(uncachedRepo[cached], undefined)
})

test('fromUrl has a max cache size of 1000', () => {
  for (const i in Array.from({ length: 1000 })) {
    const repo = HostedGit.fromUrl(`https://github.com/foo/bar-${i}`)
    repo[cached] = true
  }

  HostedGit.fromUrl('https://github.com/foo/bar-1001')

  const firstEntry = HostedGit.fromUrl('https://github.com/foo/bar-0')
  assert.strictEqual(firstEntry[cached], undefined)
})
