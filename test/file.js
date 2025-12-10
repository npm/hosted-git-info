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
