// An example of a custom setup, useful when testing modules like pacote,
// which do various things with these git shortcuts.
const ghi = require('../git-host-info.js')
ghi.localhost = {
  protocols: [ 'git' ],
  domain: 'localhost:12345',
  gittemplate: 'git://{domain}/{user}{#committish}',
  treepath: 'not-implemented',
  tarballtemplate: 'http://localhost:18000/repo-HEAD.tgz',
  shortcuttemplate: '{type}:{user}/x{#committish}',
  pathtemplate: '/{user}{#committish}',
  pathmatch: /^\/(\w+)\/(\w+)/,
  hashformat: h => h,
  protocols_re: /^(git):$/
}

const HostedGit = require('../')
const t = require('tap')

t.test('supports extensions', t => {
  const hosted = HostedGit.fromUrl('git://localhost:12345/foo/bar')
  t.match(hosted, { type: 'localhost', default: 'git', user: 'foo', project: 'bar' }, 'parsed correctly')

  const shortcut = HostedGit.fromUrl('localhost:foo/bar')
  t.match(shortcut, { type: 'localhost', default: 'shortcut', user: 'foo', project: 'bar' }, 'parsed correctly')

  t.end()
})
