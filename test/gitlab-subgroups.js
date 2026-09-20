'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

// https://github.com/npm/hosted-git-info/issues/54
const subgroup = { type: 'gitlab', user: 'GROUP/SUBGROUP', project: 'REPO' }
const nested = { type: 'gitlab', user: 'a/b/c', project: 'd' }

test('gitlab.com subgroup SSH and HTTPS urls parse', () => {
  const cases = {
    'git@gitlab.com:GROUP/SUBGROUP/REPO.git': { ...subgroup, default: 'sshurl', auth: null },
    'git@gitlab.com:GROUP/SUBGROUP/REPO.git#branch': {
      ...subgroup,
      default: 'sshurl',
      auth: null,
      committish: 'branch',
    },
    'git+ssh://git@gitlab.com/GROUP/SUBGROUP/REPO.git': { ...subgroup, default: 'sshurl', auth: null },
    'ssh://git@gitlab.com/GROUP/SUBGROUP/REPO.git': { ...subgroup, default: 'sshurl', auth: null },
    'https://gitlab.com/GROUP/SUBGROUP/REPO.git': { ...subgroup, default: 'https' },
    'git+https://gitlab.com/GROUP/SUBGROUP/REPO.git': { ...subgroup, default: 'https' },
    'https://gitlab.com/GROUP/SUBGROUP/REPO.git#v1.2.3': {
      ...subgroup,
      default: 'https',
      committish: 'v1.2.3',
    },
    'git@gitlab.com:a/b/c/d.git': { ...nested, default: 'sshurl', auth: null },
    'https://gitlab.com/a/b/c/d.git': { ...nested, default: 'https' },
  }

  for (const [url, expected] of Object.entries(cases)) {
    const parsed = HostedGit.fromUrl(url)
    assert.ok(parsed, `${url} parses`)
    for (const [key, value] of Object.entries(expected)) {
      assert.strictEqual(parsed[key], value, `${url} (${key})`)
    }
  }
})

test('gitlab.com subgroup urls generate SSH and HTTPS remotes', () => {
  const ssh = HostedGit.fromUrl('git@gitlab.com:GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(ssh.ssh(), 'git@gitlab.com:GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(ssh.sshurl(), 'git+ssh://git@gitlab.com/GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(ssh.https(), 'git+https://gitlab.com/GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(ssh.path(), 'GROUP/SUBGROUP/REPO')
  assert.strictEqual(ssh.shortcut(), 'gitlab:GROUP/SUBGROUP/REPO')
  assert.strictEqual(ssh.browse(), 'https://gitlab.com/GROUP/SUBGROUP/REPO')
  assert.strictEqual(
    ssh.tarball(),
    'https://gitlab.com/api/v4/projects/GROUP%2FSUBGROUP%2FREPO/repository/archive.tar.gz?sha=HEAD'
  )

  const https = HostedGit.fromUrl('https://gitlab.com/GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(https.ssh(), 'git@gitlab.com:GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(https.https(), 'git+https://gitlab.com/GROUP/SUBGROUP/REPO.git')
})

test('self-hosted gitlab-like subgroup remotes parse instead of unknownHostInfo', () => {
  const issueUrl = 'git@git.DOMAIN.com:GROUP/SUBGROUP/REPO.git'
  const parsed = HostedGit.fromUrl(issueUrl)
  assert.ok(parsed, 'issue #54 SCP url parses')
  assert.strictEqual(parsed.type, 'gitlab')
  assert.strictEqual(parsed.domain, 'git.domain.com')
  assert.strictEqual(parsed.user, 'GROUP/SUBGROUP')
  assert.strictEqual(parsed.project, 'REPO')
  assert.strictEqual(parsed.ssh(), 'git@git.domain.com:GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(parsed.https(), 'git+https://git.domain.com/GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(parsed.browse(), 'https://git.domain.com/GROUP/SUBGROUP/REPO')
  assert.strictEqual(
    parsed.tarball(),
    'https://git.domain.com/api/v4/projects/GROUP%2FSUBGROUP%2FREPO/repository/archive.tar.gz?sha=HEAD'
  )

  const https = HostedGit.fromUrl('https://git.DOMAIN.com/GROUP/SUBGROUP/REPO.git')
  assert.ok(https, 'self-hosted HTTPS subgroup url parses')
  assert.strictEqual(https.domain, 'git.domain.com')
  assert.strictEqual(https.user, 'GROUP/SUBGROUP')
  assert.strictEqual(https.project, 'REPO')
  assert.strictEqual(https.ssh(), 'git@git.domain.com:GROUP/SUBGROUP/REPO.git')

  const gitHttps = HostedGit.fromUrl('git+https://git.example.com/GROUP/SUBGROUP/REPO.git#main')
  assert.strictEqual(gitHttps.domain, 'git.example.com')
  assert.strictEqual(gitHttps.committish, 'main')
  assert.strictEqual(gitHttps.https(), 'git+https://git.example.com/GROUP/SUBGROUP/REPO.git#main')

  const sshurl = HostedGit.fromUrl('git+ssh://git@git.unlucky.com:RND/electron-tools/some-tool#2.0.1')
  assert.ok(sshurl, 'nested scp-style git+ssh url parses')
  assert.strictEqual(sshurl.domain, 'git.unlucky.com')
  assert.strictEqual(sshurl.user, 'RND/electron-tools')
  assert.strictEqual(sshurl.project, 'some-tool')
  assert.strictEqual(sshurl.committish, '2.0.1')

  const www = HostedGit.fromUrl('git@www.git.nested-test.com:GROUP/SUBGROUP/REPO.git')
  assert.strictEqual(www.domain, 'git.nested-test.com')
  assert.strictEqual(www.user, 'GROUP/SUBGROUP')
  assert.strictEqual(www.project, 'REPO')
})

test('fromManifest keeps subgroup remotes on gitlab and similar hosts', () => {
  const gitlabManifest = HostedGit.fromManifest({
    repository: {
      type: 'git',
      url: 'git@gitlab.com:GROUP/SUBGROUP/REPO.git',
    },
  })
  assert.strictEqual(gitlabManifest.type, 'gitlab')
  assert.strictEqual(gitlabManifest.path(), 'GROUP/SUBGROUP/REPO')

  const issueManifest = HostedGit.fromManifest({
    repository: {
      type: 'git',
      url: 'git@git.DOMAIN.com:GROUP/SUBGROUP/REPO.git',
    },
  })
  assert.ok(issueManifest, 'issue #54 repository url does not fall back to unknownHostInfo')
  assert.strictEqual(issueManifest.type, 'gitlab')
  assert.strictEqual(issueManifest.domain, 'git.domain.com')
  assert.strictEqual(issueManifest.user, 'GROUP/SUBGROUP')
  assert.strictEqual(issueManifest.project, 'REPO')
  assert.strictEqual(issueManifest.https(), 'git+https://git.domain.com/GROUP/SUBGROUP/REPO.git')

  const httpsManifest = HostedGit.fromManifest({
    repository: 'https://git.DOMAIN.com/GROUP/SUBGROUP/REPO.git',
  })
  assert.strictEqual(httpsManifest.domain, 'git.domain.com')
  assert.strictEqual(httpsManifest.path(), 'GROUP/SUBGROUP/REPO')
})

test('unknown two-segment remotes still do not look like gitlab subgroups', () => {
  assert.strictEqual(HostedGit.fromUrl('git@git.DOMAIN.com:GROUP/REPO.git'), undefined)
  assert.strictEqual(HostedGit.fromUrl('https://git.DOMAIN.com/GROUP/REPO.git'), undefined)
  assert.strictEqual(HostedGit.fromUrl('git+ssh://git@nothosted.com/abc/def'), undefined)
  assert.strictEqual(HostedGit.fromUrl('git://git.DOMAIN.com/GROUP/SUBGROUP/REPO.git'), undefined)
  assert.strictEqual(HostedGit.fromUrl('https://git.DOMAIN.com/GROUP/SUBGROUP/REPO'), undefined)
  assert.strictEqual(HostedGit.fromUrl('https://git.DOMAIN.com/foo/-/bar/baz.git'), undefined)
})

test('fromManifest unknownHostedUrl handles SCP urls without subgroups', () => {
  const fallback = HostedGit.fromManifest({
    repository: {
      type: 'git',
      url: 'git@git.other.com:GROUP/REPO.git',
    },
  })
  assert.strictEqual(fallback, 'https://git.other.com/GROUP/REPO')

  const noHost = HostedGit.fromManifest({
    repository: {
      type: 'git',
      url: 'file:///tmp/GROUP/REPO.git',
    },
  })
  assert.strictEqual(noHost, null)

  const unparsed = HostedGit.fromManifest({
    repository: {
      type: 'git',
      url: '::',
    },
  })
  assert.strictEqual(unparsed, null)
})

test('addHost similar hosts parse subgroup path segments', () => {
  HostedGit.addHost('enterprise-git', {
    protocols: ['git+ssh:', 'git+https:', 'ssh:', 'https:'],
    domain: 'git.enterprise-test.example',
  })

  const parsed = HostedGit.fromUrl('git@git.enterprise-test.example:GROUP/SUBGROUP/REPO.git')
  assert.ok(parsed, 'custom host without extract parses subgroups')
  assert.strictEqual(parsed.type, 'enterprise-git')
  assert.strictEqual(parsed.user, 'GROUP/SUBGROUP')
  assert.strictEqual(parsed.project, 'REPO')

  const two = HostedGit.fromUrl('https://git.enterprise-test.example/GROUP/REPO.git')
  assert.strictEqual(two.type, 'enterprise-git')
  assert.strictEqual(two.user, 'GROUP')
  assert.strictEqual(two.project, 'REPO')
})
