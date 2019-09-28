'use strict'
var HostedGit = require('../index')
var test = require('tap').test

var showLabel = function (label, fn) { return label + ' -> ' + fn }

var testFixtures = function (t, params, fixtures) {
  for (var i = 0; i < fixtures.length; ++i) {
    var fixture = fixtures[i]

    var host = fixture.host(params)
    var hostinfo = HostedGit.fromUrl(host)

    // INFO: fromUrl should return `undefined` from fixture input
    if (fixture.isUndefined) {
      t.test('input results in undefined', function (tt) {
        tt.is(hostinfo, undefined)
        tt.end()
      })
      break
    }

    t.test('hostinfo.https', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.https(),
        expected('git+https://bitbucket.org/some-owner/some-repo.git', fixture.hasBranch, fixture.hasGroup),
        showLabel(fixture.label, 'https')
      )
      // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
      tt.is(
        hostinfo.https({ noCommittish: true }),
        'git+https://bitbucket.org/some-owner/some-repo.git',
        showLabel(fixture.label, 'https({ noCommittish: true })')
      )
      tt.is(
        hostinfo.https({ noGitPlus: true }),
        expected('https://bitbucket.org/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'https({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.browse', function (tt) {
      var expected = function (url, hasBranch) {
        if (hasBranch) {
          if (url.indexOf('master') === -1) {
            return url + '/src/' + params.branch
          } else {
            return url.replace(/master/gi, params.branch)
          }
        }
        return url
      }
      tt.is(
        hostinfo.browse(),
        expected('https://bitbucket.org/some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'browse')
      )
      tt.is(
        hostinfo.browse(''),
        expected('https://bitbucket.org/some-owner/some-repo/src/master/', fixture.hasBranch),
        showLabel(fixture.label, "browse('')")
      )
      tt.is(
        hostinfo.browse('C'),
        expected('https://bitbucket.org/some-owner/some-repo/src/master/C', fixture.hasBranch),
        showLabel(fixture.label, "browse('C')")
      )
      tt.is(
        hostinfo.browse('C/D'),
        expected('https://bitbucket.org/some-owner/some-repo/src/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D')")
      )
      tt.is(
        hostinfo.browse('C', 'A'),
        expected('https://bitbucket.org/some-owner/some-repo/src/master/C#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C', 'A')")
      )
      tt.is(
        hostinfo.browse('C/D', 'A'),
        expected('https://bitbucket.org/some-owner/some-repo/src/master/C/D#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D', 'A')")
      )
      tt.end()
    })
    t.test('hostinfo.docs', function (tt) {
      var expected = function (url, hasBranch) {
        if (hasBranch) {
          var splitUrl = url.split('#')
          return splitUrl[0] + '/src/' + params.branch + '#' + splitUrl[1]
        }
        return url
      }
      tt.is(
        hostinfo.docs(),
        expected('https://bitbucket.org/some-owner/some-repo#readme', fixture.hasBranch),
        showLabel(fixture.label, 'docs')
      )
      tt.is(
        hostinfo.docs({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'https://bitbucket.org/some-owner/some-repo#readme',
        showLabel(fixture.label, 'docs({ noCommittish: true })')
      )
      tt.is(
        hostinfo.docs({ noGitPlus: true }),
        expected('https://bitbucket.org/some-owner/some-repo#readme', fixture.hasBranch),
        showLabel(fixture.label, 'docs({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.ssh', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.ssh(),
        expected('git@bitbucket.org:some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'ssh')
      )
      tt.is(
        hostinfo.ssh({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git@bitbucket.org:some-owner/some-repo.git',
        showLabel(fixture.label, 'ssh({ noCommittish: true })')
      )
      tt.is(
        hostinfo.ssh({ noGitPlus: true }),
        expected('git@bitbucket.org:some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'ssh({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.sshurl', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.sshurl(),
        expected('git+ssh://git@bitbucket.org/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl')
      )
      tt.is(
        hostinfo.sshurl({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git+ssh://git@bitbucket.org/some-owner/some-repo.git',
        showLabel(fixture.label, 'sshurl({ noCommittish: true })')
      )
      tt.is(
        hostinfo.sshurl({ noGitPlus: true }),
        expected('ssh://git@bitbucket.org/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.shortcut', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.shortcut(),
        expected('bitbucket:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut')
      )
      tt.is(
        hostinfo.shortcut({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'bitbucket:some-owner/some-repo',
        showLabel(fixture.label, 'shortcut({ noCommittish: true })')
      )
      tt.is(
        hostinfo.shortcut({ noGitPlus: true }),
        expected('bitbucket:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.file', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url.replace(/master/gi, params.branch)
          : url
      }
      tt.is(
        hostinfo.file(),
        expected('https://bitbucket.org/some-owner/some-repo/raw/master/', fixture.hasBranch),
        showLabel(fixture.label, 'file')
      )
      tt.is(
        hostinfo.file('C'),
        expected('https://bitbucket.org/some-owner/some-repo/raw/master/C', fixture.hasBranch),
        showLabel(fixture.label, "file('C')")
      )
      tt.is(
        hostinfo.file('C/D'),
        expected('https://bitbucket.org/some-owner/some-repo/raw/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "file('C/D')")
      )
      tt.end()
    })
    t.test('hostinfo.tarball', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url.replace(/master/gi, params.branch)
          : url
      }
      tt.is(
        hostinfo.tarball(),
        expected('https://bitbucket.org/some-owner/some-repo/get/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball')
      )
      tt.is(
        hostinfo.tarball({ noCommittish: true }),
        expected('https://bitbucket.org/some-owner/some-repo/get/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noCommittish: true })')
      )
      tt.is(
        hostinfo.tarball({ noGitPlus: true }),
        expected('https://bitbucket.org/some-owner/some-repo/get/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noGitPlus: true })')
      )
      tt.end()
    })
  }
}

test('fromUrl(bitbucket url)', function (t) {
  var fixtures = require('./fixtures/bitbucket')
  // var gitlabFixtures = require('./fixtures/bitbucket')
  // var collectedFixtures = [].concat(fixtures, gitlabFixtures)

  t.test('domain: bitbucket.org', function (tt) {
    var params = {
      domain: 'bitbucket.org',
      shortname: 'bitbucket',
      label: 'bitbucket',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, fixtures)
    tt.end()
  })

  t.test('domain: www.bitbucket.org', function (tt) {
    var params = {
      domain: 'www.bitbucket.org',
      shortname: 'bitbucket',
      label: 'bitbucket',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, fixtures)
    tt.end()
  })

  t.test('Bitbucket HTTPS URLs with embedded auth', function (tt) {
    tt.is(
      HostedGit.fromUrl('https://user:pass@bitbucket.org/user/repo.git').toString(),
      'git+https://user:pass@bitbucket.org/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('https://user:pass@bitbucket.org/user/repo').toString(),
      'git+https://user:pass@bitbucket.org/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('git+https://user:pass@bitbucket.org/user/repo.git').toString(),
      'git+https://user:pass@bitbucket.org/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('git+https://user:pass@bitbucket.org/user/repo').toString(),
      'git+https://user:pass@bitbucket.org/user/repo.git',
      'credentials were included in URL'
    )
    tt.end()
  })

  t.end()
})
