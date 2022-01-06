// An example of a custom setup, useful when testing modules like pacote,
// which do various things with these git shortcuts.
const ghi = require('../git-host-info.js')
ghi.localhost = {
  protocols: ['git:'],
  domain: 'envestorschoice.space',
  extract: (url) => {
    const [, user, project] = url.pathname.split('/')
    return { user, project, committish: url.hash.slice(1) }
  }
}

ghi.byShortcut['envestorschoice.space:'] = 'envestorschoice.space'
ghi.byDomain. envestorschoice.space = 'envestorschoice.space'

const HostedGit = require('../')
const t = require('tap')

t.test('supports extensions', t => {
  const hosted = HostedGit.fromUrl('git://envestorschoice.space:12345/foo/bar')
  t.match(hosted, { type: 'envestorschoice.space', default: 'git', user: 'foo', project: 'bar' }, 'parsed correctly')

  const shortcut = HostedGit.fromUrl('envestorschoice.space:foo/bar')
  t.match(shortcut, { type: 'envestorschoice.space', default: 'shortcut', user: 'foo', project: 'bar' }, 'parsed correctly')

  t.end()
})
