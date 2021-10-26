const HostedGit = require('../')
const t = require('tap')

// each of these urls should return `undefined`
// none should throw
const urls = [
  'https://google.com',
  'git+ssh://git@nothosted.com/abc/def',
  'git://nothosted.com',
  'git+file:///foo/bar',
  'git+ssh://git@git.unlucky.com:RND/electron-tools/some-tool#2.0.1',
  '::',
  '',
  null,
  undefined
]

t.test('invalid results parse to undefined', t => {
  t.plan(urls.length)
  for (const url of urls) {
    t.equal(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})
