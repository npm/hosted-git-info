// An example of a custom setup, useful when testing modules like pacote,
// which do various things with these git shortcuts.
const ghi = require('../git-host-info.js')
ghi.localhost = {
  protocols: ['git:'],
  domain: 'localhost',
  extract: (url) => {
    const [, user, project] = url.pathname.split('/')
    return { user, project, committish: url.hash.slice(1) }
  }
}

ghi.byShortcut['localhost:'] = 'localhost'
ghi.byDomain.localhost = 'localhost'

const HostedGit = require('../')
const t = require('tap')

t.test('supports extensions', t => {
  const hosted = HostedGit.fromUrl('git://localhost:12345/foo/bar')
  t.match(hosted, { type: 'localhost', default: 'git', user: 'foo', project: 'bar' }, 'parsed correctly')

  const shortcut = HostedGit.fromUrl('localhost:foo/bar')
  t.match(shortcut, { type: 'localhost', default: 'shortcut', user: 'foo', project: 'bar' }, 'parsed correctly')

  t.end()
})
