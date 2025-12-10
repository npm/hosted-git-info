const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

test('supports extensions', () => {
  // An example of a custom setup, useful when testing modules like pacote,
  // which do various things with these git shortcuts.
  HostedGit.addHost('localhost', {
    protocols: ['git:'],
    domain: 'localhost',
    extract: (url) => {
      const [, user, project] = url.pathname.split('/')
      return { user, project, committish: url.hash.slice(1) }
    },
  })

  const hosted = HostedGit.fromUrl('git://localhost:12345/foo/bar')
  assert.strictEqual(hosted.type, 'localhost')
  assert.strictEqual(hosted.default, 'git')
  assert.strictEqual(hosted.user, 'foo')
  assert.strictEqual(hosted.project, 'bar')

  const shortcut = HostedGit.fromUrl('localhost:foo/bar')
  assert.strictEqual(shortcut.type, 'localhost')
  assert.strictEqual(shortcut.default, 'shortcut')
  assert.strictEqual(shortcut.user, 'foo')
  assert.strictEqual(shortcut.project, 'bar')
})
