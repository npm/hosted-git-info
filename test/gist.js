'use strict'
var HostedGit = require('../index')
var test = require('tap').test

var showLabel = function (label, fn) { return label + ' -> ' + fn }

var testFixtures = function (t, params, fixtures) {
  for (var i = 0; i < fixtures.length; ++i) {
    var fixture = fixtures[i]
    var host = fixture.host(params)
    var hostinfo = HostedGit.fromUrl(host)

    // INFO: from Url should return `undefined` from fixture input
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
        expected('git+https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
        showLabel(fixture.label, 'https')
      )
      tt.is(
        hostinfo.https({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git+https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git',
        showLabel(fixture.label, 'https({ noCommittish: true })')
      )
      tt.is(
        hostinfo.https({ noGitPlus: true }),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
        showLabel(fixture.label, 'https({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.git', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.git(),
        expected('git://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
        showLabel(fixture.label, 'git')
      )
      tt.is(
        hostinfo.git({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'git://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git',
        showLabel(fixture.label, 'git({ noCommittish: true })')
      )
      tt.is(
        hostinfo.git({ noGitPlus: true }),
        expected('git://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
        showLabel(fixture.label, 'git({ noGitPlus: true })')
      )
      tt.end()
    })
    t.test('hostinfo.browse', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '/' + params.branch
          : url
      }
      tt.is(
        hostinfo.browse(),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch),
        showLabel(fixture.label, 'browse')
      )
      tt.is(
        hostinfo.browse('C'),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch) + '#file-c',
        showLabel(fixture.label, "browse('C')")
      )
      tt.is(
        hostinfo.browse('C/D'),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch) + '#file-cd',
        showLabel(fixture.label, "browse('C/D')")
      )
      tt.is(
        hostinfo.browse('C', 'A'),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch) + '#file-c',
        showLabel(fixture.label, "browse('C', 'A')")
      )
      tt.is(
        hostinfo.browse('C/D', 'A'),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch) + '#file-cd',
        showLabel(fixture.label, "browse('C/D', 'A')")
      )
      tt.end()
    })
    t.test('hostinfo.bugs', function (tt) {
      tt.is(
        hostinfo.bugs(),
        'https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2',
        showLabel(fixture.label, 'bugs')
      )
      tt.end()
    })
    t.test('hostinfo.docs', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '/' + params.branch
          : url
      }
      tt.is(
        hostinfo.docs(),
        expected('https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch),
        showLabel(fixture.label, 'docs')
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
        expected('git@gist.github.com:/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
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
        expected('git+ssh://git@gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
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
        expected('gist:a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut')
      )
      tt.end()
    })
    if (hostinfo.user) {
      t.test('hostinfo.file', function (tt) {
        var expected = function (url, hasBranch) {
          return (hasBranch)
            ? url + params.branch + '/'
            : url
        }
        tt.is(
          hostinfo.file(),
          expected('https://gist.githubusercontent.com/some-owner/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/raw/', fixture.hasBranch),
          showLabel(fixture.label, 'file')
        )
        tt.is(
          hostinfo.file(''),
          expected('https://gist.githubusercontent.com/some-owner/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/raw/', fixture.hasBranch),
          showLabel(fixture.label, "file('')")
        )
        tt.is(
          hostinfo.file('C'),
          expected('https://gist.githubusercontent.com/some-owner/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/raw/', fixture.hasBranch) + 'C',
          showLabel(fixture.label, "file('C')")
        )
        tt.is(
          hostinfo.file('C/D'),
          expected('https://gist.githubusercontent.com/some-owner/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/raw/', fixture.hasBranch) + 'C/D',
          showLabel(fixture.label, "file('C/D')")
        )
        tt.is(
          hostinfo.file('C', 'A'),
          expected('https://gist.githubusercontent.com/some-owner/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/raw/', fixture.hasBranch) + 'C',
          showLabel(fixture.label, "file('C', 'A')")
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
          expected('https://codeload.github.com/gist/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/tar.gz/master', fixture.hasBranch),
          showLabel(fixture.label, 'tarball')
        )
        tt.is(
          hostinfo.tarball({ noCommittish: true }),
          expected('https://codeload.github.com/gist/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/tar.gz/master', fixture.hasBranch),
          showLabel(fixture.label, 'tarball({ noCommittish: true })')
        )
        tt.end()
      })
    }

    t.test('hostinfo.toString', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.toString(),
        expected('git+https://gist.github.com/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2.git', fixture.hasBranch),
        showLabel(fixture.label, 'toString')
      )
      tt.end()
    })
  }
}

test('fromUrl(gist url)', function (t) {
  var fixtures = require('./fixtures')
  var gistFixtures = require('./fixtures/gist')
  var collectedFixtures = [].concat(fixtures, gistFixtures)

  t.test('main fixtures', function (tt) {
    var params = {
      domain: 'gist.github.com',
      shortname: 'github',
      label: 'github',
      owner: 'some-owner',
      project: new Array(17).join('a2'),
      branch: 'feature-branch'
    }

    testFixtures(tt, params, collectedFixtures)
    tt.end()
  })

  t.end()
})
