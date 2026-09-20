const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

// each of these urls should return `undefined`
// none should throw
const urls = [
  'https://google.com',
  'git+ssh://git@nothosted.com/abc/def',
  'git://nothosted.com',
  'git+file:///foo/bar',
  '::',
  '',
  null,
  undefined,
]

test('invalid results parse to undefined', () => {
  for (const url of urls) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})
