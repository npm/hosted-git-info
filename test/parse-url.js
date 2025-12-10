const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')
const parseUrl = require('../lib/parse-url.js')

test('can parse git+ssh urls', async () => {
  // https://github.com/npm/cli/issues/5278
  const u = 'git+ssh://git@abc:frontend/utils.git#6d45447e0c5eb6cd2e3edf05a8c5a9bb81950c79'
  assert.ok(parseUrl(u))
  assert.ok(HostedGit.parseUrl(u))
})

test('can parse file urls', async () => {
  // https://github.com/npm/cli/pull/5758#issuecomment-1292753331
  const u = 'file:../../../global-prefix/lib/node_modules/@myscope/bar'
  assert.ok(parseUrl(u))
  assert.ok(HostedGit.parseUrl(u))
})

test('can parse custom urls', async () => {
  const u = 'foobar://user:host@path'
  assert.ok(parseUrl(u, {}))
  assert.strictEqual(parseUrl(u, {}).protocol, 'foobar:')
  assert.ok(HostedGit.parseUrl(u))
})
