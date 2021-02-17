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
        expected('git+https://git.sr.ht/~some-owner/some-repo.git', fixture.hasBranch, fixture.hasGroup),
        showLabel(fixture.label, 'https')
      )
      // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
      tt.is(
        hostinfo.https({ noCommittish: true }),
        'git+https://git.sr.ht/~some-owner/some-repo.git',
        showLabel(fixture.label, 'https({ noCommittish: true })')
      )
      tt.is(
        hostinfo.https({ noGitPlus: true }),
        expected('https://git.sr.ht/~some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'https({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.browse', function (tt) {
      var expected = function (url, hasBranch) {
        if (hasBranch) {
          if (url.indexOf('master') === -1) {
            return url + '/tree/' + params.branch
          } else {
            return url.replace(/master/gi, params.branch)
          }
        }
        return url
      }
      tt.is(
        hostinfo.browse(),
        expected('https://git.sr.ht/~some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'browse')
      )
      tt.is(
        hostinfo.browse(''),
        expected('https://git.sr.ht/~some-owner/some-repo/tree/master/', fixture.hasBranch),
        showLabel(fixture.label, "browse('')")
      )
      tt.is(
        hostinfo.browse('C'),
        expected('https://git.sr.ht/~some-owner/some-repo/tree/master/C', fixture.hasBranch),
        showLabel(fixture.label, "browse('C')")
      )
      tt.is(
        hostinfo.browse('C/D'),
        expected('https://git.sr.ht/~some-owner/some-repo/tree/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D')")
      )
      tt.is(
        hostinfo.browse('C', 'A'),
        expected('https://git.sr.ht/~some-owner/some-repo/tree/master/C#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C', 'A')")
      )
      tt.is(
        hostinfo.browse('C/D', 'A'),
        expected('https://git.sr.ht/~some-owner/some-repo/tree/master/C/D#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D', 'A')")
      )
      tt.end()
    })
    t.test('hostinfo.docs', function (tt) {
      var expected = function (url, hasBranch) {
        if (hasBranch) {
          var splitUrl = url.split('#')
          return splitUrl[0] + '/tree/' + params.branch + '#' + splitUrl[1]
        }
        return url
      }
      tt.is(
        hostinfo.docs(),
        expected('https://git.sr.ht/~some-owner/some-repo#readme', fixture.hasBranch),
        showLabel(fixture.label, 'docs')
      )
      tt.is(
        hostinfo.docs({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'https://git.sr.ht/~some-owner/some-repo#readme',
        showLabel(fixture.label, 'docs({ noCommittish: true })')
      )
      tt.is(
        hostinfo.docs({ noGitPlus: true }),
        expected('https://git.sr.ht/~some-owner/some-repo#readme', fixture.hasBranch),
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
        expected('git@git.sr.ht:~some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'ssh')
      )
      tt.is(
        hostinfo.ssh({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git@git.sr.ht:~some-owner/some-repo.git',
        showLabel(fixture.label, 'ssh({ noCommittish: true })')
      )
      tt.is(
        hostinfo.ssh({ noGitPlus: true }),
        expected('git@git.sr.ht:~some-owner/some-repo.git', fixture.hasBranch),
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
        expected('git+ssh://git@git.sr.ht/~some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl')
      )
      tt.is(
        hostinfo.sshurl({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git+ssh://git@git.sr.ht/~some-owner/some-repo.git',
        showLabel(fixture.label, 'sshurl({ noCommittish: true })')
      )
      tt.is(
        hostinfo.sshurl({ noGitPlus: true }),
        expected('ssh://git@git.sr.ht/~some-owner/some-repo.git', fixture.hasBranch),
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
        expected('sourcehut:~some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut')
      )
      tt.is(
        hostinfo.shortcut({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'sourcehut:~some-owner/some-repo',
        showLabel(fixture.label, 'shortcut({ noCommittish: true })')
      )
      tt.is(
        hostinfo.shortcut({ noGitPlus: true }),
        expected('sourcehut:~some-owner/some-repo', fixture.hasBranch),
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
        expected('https://git.sr.ht/~some-owner/some-repo/blob/master/', fixture.hasBranch),
        showLabel(fixture.label, 'file')
      )
      tt.is(
        hostinfo.file('C'),
        expected('https://git.sr.ht/~some-owner/some-repo/blob/master/C', fixture.hasBranch),
        showLabel(fixture.label, "file('C')")
      )
      tt.is(
        hostinfo.file('C/D'),
        expected('https://git.sr.ht/~some-owner/some-repo/blob/master/C/D', fixture.hasBranch),
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
        expected('https://git.sr.ht/~some-owner/some-repo/archive/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball')
      )
      tt.is(
        hostinfo.tarball({ noCommittish: true }),
        expected('https://git.sr.ht/~some-owner/some-repo/archive/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noCommittish: true })')
      )
      tt.is(
        hostinfo.tarball({ noGitPlus: true }),
        expected('https://git.sr.ht/~some-owner/some-repo/archive/master.tar.gz', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noGitPlus: true })')
      )
      tt.end()
    })
  }
}

test('fromUrl(sourcehut url)', function (t) {
  var fixtures = require('./fixtures/sourcehut')

  t.test('domain: git.sr.ht', function (tt) {
    var params = {
      domain: 'git.sr.ht',
      shortname: 'sourcehut',
      label: 'sourcehut',
      owner: '~some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, fixtures)
    tt.end()
  })

  t.test('Soucehub HTTPS URLs with embedded auth', function (tt) {
    tt.is(
      HostedGit.fromUrl('https://user:pass@git.sr.ht/user/repo.git').toString(),
      'git+https://user:pass@git.sr.ht/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('https://user:pass@git.sr.ht/user/repo').toString(),
      'git+https://user:pass@git.sr.ht/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('git+https://user:pass@git.sr.ht/user/repo.git').toString(),
      'git+https://user:pass@git.sr.ht/user/repo.git',
      'credentials were included in URL'
    )
    tt.is(
      HostedGit.fromUrl('git+https://user:pass@git.sr.ht/user/repo').toString(),
      'git+https://user:pass@git.sr.ht/user/repo.git',
      'credentials were included in URL'
    )
    tt.end()
  })

  t.end()
})
