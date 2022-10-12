const HostedGit = require('..')
const t = require('tap')

t.test('supports extensions', t => {
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
  t.match(
    hosted,
    { type: 'localhost', default: 'git', user: 'foo', project: 'bar' },
    'parsed correctly'
  )

  const shortcut = HostedGit.fromUrl('localhost:foo/bar')
  t.match(
    shortcut,
    { type: 'localhost', default: 'shortcut', user: 'foo', project: 'bar' },
    'parsed correctly'
  )

  t.end()
})
