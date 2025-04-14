const HostedGit = require('..')
const t = require('tap')

t.test('file:// URLs', t => {
  const fileRepo = {
    name: 'foo',
    repository: {
      url: 'file:///path/dot.git',
    },
  }
  t.equal(HostedGit.fromManifest(fileRepo), null)

  t.end()
})
