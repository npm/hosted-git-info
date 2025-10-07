const t = require('tap')
const HostedGit = require('..')
const parseUrl = require('../lib/parse-url.js')

t.test('can parse git+ssh urls', async t => {
  // https://github.com/npm/cli/issues/5278
  const u = 'git+ssh://git@abc:frontend/utils.git#6d45447e0c5eb6cd2e3edf05a8c5a9bb81950c79'
  t.ok(parseUrl(u))
  t.ok(HostedGit.parseUrl(u))
})

t.test('can parse file urls', async t => {
  // https://github.com/npm/cli/pull/5758#issuecomment-1292753331
  const u = 'file:../../../global-prefix/lib/node_modules/@myscope/bar'
  t.ok(parseUrl(u))
  t.ok(HostedGit.parseUrl(u))
})

t.test('can parse custom urls', async t => {
  const u = 'foobar://user:host@path'
  t.ok(parseUrl(u, {}))
  t.equal(parseUrl(u, {}).protocol, 'foobar:')
  t.ok(HostedGit.parseUrl(u))
})
