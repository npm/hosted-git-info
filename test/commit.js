const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

test('commit links for GitHub and GitLab repositories', () => {
  const github = HostedGit.fromUrl('github:microsoft/vscode-extension-samples')
  assert.strictEqual(
    github.commit('5196195'),
    'https://github.com/microsoft/vscode-extension-samples/commit/5196195'
  )

  const gitlab = HostedGit.fromUrl('gitlab:dmfay/massive-js')
  assert.strictEqual(
    gitlab.commit('d3d36d4b980d99af2eaffe3da898b7961bd65a92'),
    'https://gitlab.com/dmfay/massive-js/-/commit/d3d36d4b980d99af2eaffe3da898b7961bd65a92'
  )

  const subgroup = HostedGit.fromUrl('https://gitlab.com/group/subgroup/repo.git')
  assert.strictEqual(subgroup.commit('abc123'), 'https://gitlab.com/group/subgroup/repo/-/commit/abc123')
})

test('commit uses its explicit ref and preserves the instance options for other methods', () => {
  const info = HostedGit.fromUrl('github:org/repo#original', { noCommittish: true })
  assert.strictEqual(info.commit('explicit'), 'https://github.com/org/repo/commit/explicit')
  assert.strictEqual(
    info.commit('explicit', { committish: 'option', noCommittish: true }),
    'https://github.com/org/repo/commit/explicit'
  )
  assert.strictEqual(info.browse(), 'https://github.com/org/repo')
  assert.strictEqual(info.browse({ noCommittish: false }), 'https://github.com/org/repo/tree/original')
  assert.strictEqual(info.shortcut(), 'github:org/repo')
})

test('commit encodes the ref as one URL path segment', () => {
  const github = HostedGit.fromUrl('github:org/repo')
  const gitlab = HostedGit.fromUrl('gitlab:org/repo')
  const ref = 'feature/café #?%'
  const encoded = 'feature%2Fcaf%C3%A9%20%23%3F%25'

  assert.strictEqual(github.commit(ref), 'https://github.com/org/repo/commit/' + encoded)
  assert.strictEqual(gitlab.commit(ref), 'https://gitlab.com/org/repo/-/commit/' + encoded)
  assert.strictEqual(new URL(github.commit('../other')).pathname, '/org/repo/commit/..%2Fother')
  assert.strictEqual(new URL(github.commit('%2e%2e')).pathname, '/org/repo/commit/%252e%252e')
})

test('commit returns null for invalid refs without falling back to another ref', () => {
  const info = HostedGit.fromUrl('github:org/repo#original')
  assert.strictEqual(info.commit(), null)
  for (const ref of [null, 123, { committish: 'option' }, '', '.', '..', '\ud800']) {
    assert.strictEqual(info.commit(ref, { committish: 'fallback' }), null)
  }
})

test('commit returns null for hosts without a commit template', () => {
  for (const url of ['bitbucket:org/repo', 'gist:abcdef', 'sourcehut:~user/repo']) {
    assert.strictEqual(HostedGit.fromUrl(url).commit('abc123'), null)
  }
})
