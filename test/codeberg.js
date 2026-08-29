'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

test('Codeberg URLs parse and generate Forgejo links', () => {
  const info = HostedGit.fromUrl('https://codeberg.org/forgejo/forgejo#v9.0.0')

  assert.strictEqual(info.type, 'codeberg')
  assert.strictEqual(info.user, 'forgejo')
  assert.strictEqual(info.project, 'forgejo')
  assert.strictEqual(info.committish, 'v9.0.0')
  assert.strictEqual(info.default, 'https')
  assert.strictEqual(info.https(), 'git+https://codeberg.org/forgejo/forgejo.git#v9.0.0')
  assert.strictEqual(info.ssh(), 'git@codeberg.org:forgejo/forgejo.git#v9.0.0')
  assert.strictEqual(info.sshurl(), 'git+ssh://git@codeberg.org/forgejo/forgejo.git#v9.0.0')
  assert.strictEqual(info.browse('/README.md'), 'https://codeberg.org/forgejo/forgejo/src/v9.0.0/README.md')
  assert.strictEqual(info.file('/README.md'), 'https://codeberg.org/forgejo/forgejo/raw/v9.0.0/README.md')
  assert.strictEqual(info.tarball(), 'https://codeberg.org/forgejo/forgejo/archive/v9.0.0.tar.gz')
  assert.strictEqual(info.bugs(), 'https://codeberg.org/forgejo/forgejo/issues')
})

test('Codeberg repository pages are not treated as repository URLs', () => {
  for (const url of [
    'https://codeberg.org/forgejo/forgejo/src/branch/main',
    'https://codeberg.org/forgejo/forgejo/issues',
    'https://codeberg.org/forgejo/forgejo/archive/main.tar.gz',
  ]) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }

  for (const url of ['https://codeberg.org/forgejo', 'https://codeberg.org/']) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined)
  }
})

test('Codeberg clone URLs without a committish accept a .git suffix', () => {
  const info = HostedGit.fromUrl('git@codeberg.org:forgejo/forgejo.git')

  assert.strictEqual(info.type, 'codeberg')
  assert.strictEqual(info.user, 'forgejo')
  assert.strictEqual(info.project, 'forgejo')
  assert.strictEqual(info.default, 'sshurl')
  assert.strictEqual(info.tarball(), 'https://codeberg.org/forgejo/forgejo/archive/HEAD.tar.gz')
})
