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
        expected('git+https://gitlab.com/some-owner/some-repo.git', fixture.hasBranch, fixture.hasGroup),
        showLabel(fixture.label, 'https')
      )
      tt.is(
        hostinfo.https({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git+https://gitlab.com/some-owner/some-repo.git',
        showLabel(fixture.label, 'https({ noCommittish: true })')
      )
      tt.is(
        hostinfo.https({ noGitPlus: true }),
        expected('https://gitlab.com/some-owner/some-repo.git', fixture.hasBranch),
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
        expected('https://gitlab.com/some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'browse')
      )
      tt.is(
        hostinfo.browse(''),
        expected('https://gitlab.com/some-owner/some-repo/tree/master/', fixture.hasBranch),
        showLabel(fixture.label, "browse('')")
      )
      tt.is(
        hostinfo.browse('C'),
        expected('https://gitlab.com/some-owner/some-repo/tree/master/C', fixture.hasBranch),
        showLabel(fixture.label, "browse('C')")
      )
      tt.is(
        hostinfo.browse('C/D'),
        expected('https://gitlab.com/some-owner/some-repo/tree/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D')")
      )
      tt.is(
        hostinfo.browse('C', 'A'),
        expected('https://gitlab.com/some-owner/some-repo/tree/master/C#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C', 'A')")
      )
      tt.is(
        hostinfo.browse('C/D', 'A'),
        expected('https://gitlab.com/some-owner/some-repo/tree/master/C/D#a', fixture.hasBranch),
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
        expected('https://gitlab.com/some-owner/some-repo#readme', fixture.hasBranch),
        showLabel(fixture.label, 'docs')
      )
      tt.is(
        hostinfo.docs({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'https://gitlab.com/some-owner/some-repo#readme',
        showLabel(fixture.label, 'docs({ noCommittish: true })')
      )
      tt.is(
        hostinfo.docs({ noGitPlus: true }),
        expected('https://gitlab.com/some-owner/some-repo#readme', fixture.hasBranch),
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
        expected('git@gitlab.com:some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'ssh')
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
        expected('git+ssh://git@gitlab.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl')
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
        expected('gitlab:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut')
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
        expected('https://gitlab.com/some-owner/some-repo/raw/master/', fixture.hasBranch),
        showLabel(fixture.label, 'file')
      )
      tt.is(
        hostinfo.file('C'),
        expected('https://gitlab.com/some-owner/some-repo/raw/master/C', fixture.hasBranch),
        showLabel(fixture.label, "file('C')")
      )
      tt.is(
        hostinfo.file('C/D'),
        expected('https://gitlab.com/some-owner/some-repo/raw/master/C/D', fixture.hasBranch),
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
        expected('https://gitlab.com/some-owner/some-repo/repository/archive.tar.gz?ref=master', fixture.hasBranch),
        showLabel(fixture.label, 'tarball')
      )
      tt.is(
        hostinfo.tarball({ noCommittish: true }),
        expected('https://gitlab.com/some-owner/some-repo/repository/archive.tar.gz?ref=master', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noCommittish: true })')
      )
      tt.end()
    })
  }
}
test('fromUrl(gitlab url)', function (t) {
  var fixtures = require('./fixtures')
  var gitlabFixtures = require('./fixtures/gitlab')
  var collectedFixtures = [].concat(fixtures, gitlabFixtures)

  t.test('domain: gitlab.com', function (tt) {
    var params = {
      domain: 'gitlab.com',
      shortname: 'gitlab',
      label: 'gitlab',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, collectedFixtures)
    tt.end()
  })

  t.test('domain: www.gitlab.com', function (tt) {
    var params = {
      domain: 'www.gitlab.com',
      shortname: 'gitlab',
      label: 'gitlab',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, collectedFixtures)
    tt.end()
  })

  t.test('subgroups', function (tt) {
    var groupFixtures = require('./fixtures/gitlab-subgroups')

    var params = {
      domain: 'gitlab.com',
      shortname: 'gitlab',
      label: 'gitlab',
      owner: 'some-owner',
      project: 'some-repo',
      group: 'group/sub-group1',
      branch: 'feature-branch'
    }
    for (var g = 0; g < groupFixtures.length; ++g) {
      var fixture = groupFixtures[g]
      var host = fixture.host(params)
      var hostinfo = HostedGit.fromUrl(host)

      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.https(),
        expected('git+https://gitlab.com/some-owner/group/sub-group1/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'https')
      )
      tt.is(
        hostinfo.https({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git+https://gitlab.com/some-owner/group/sub-group1/some-repo.git',
        showLabel(fixture.label, 'https({ noCommittish: true })')
      )
      tt.is(
        hostinfo.https({ noGitPlus: true }),
        expected('https://gitlab.com/some-owner/group/sub-group1/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'https({ noGitPlus: true })')
      )
    }

    tt.is(
      HostedGit.fromUrl('gitlab:group/sub group1/subgroup2/repo').https(),
      'git+https://gitlab.com/group/sub%20group1/subgroup2/repo.git',
      'subgroups are delimited with slashes and url encoded (shortcut -> https)'
    )
    tt.end()
  })

  t.end()
})
