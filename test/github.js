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
        expected('git+https://github.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'https')
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
        expected('git://github.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'git')
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
        expected('https://github.com/some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'browse')
      )
      tt.is(
        hostinfo.browse(''),
        expected('https://github.com/some-owner/some-repo/tree/master/', fixture.hasBranch),
        showLabel(fixture.label, "browse('')")
      )
      tt.is(
        hostinfo.browse('C'),
        expected('https://github.com/some-owner/some-repo/tree/master/C', fixture.hasBranch),
        showLabel(fixture.label, "browse('C')")
      )
      tt.is(
        hostinfo.browse('C/D'),
        expected('https://github.com/some-owner/some-repo/tree/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D')")
      )
      tt.is(
        hostinfo.browse('C', 'A'),
        expected('https://github.com/some-owner/some-repo/tree/master/C#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C', 'A')")
      )
      tt.is(
        hostinfo.browse('C/D', 'A'),
        expected('https://github.com/some-owner/some-repo/tree/master/C/D#a', fixture.hasBranch),
        showLabel(fixture.label, "browse('C/D', 'A')")
      )
      tt.end()
    })
    t.test('hostinfo.bugs', function (tt) {
      tt.is(
        hostinfo.bugs(),
        'https://github.com/some-owner/some-repo/issues',
        showLabel(fixture.label, 'bugs')
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
        expected('https://github.com/some-owner/some-repo#readme', fixture.hasBranch),
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
      tt.is(hostinfo.ssh(), expected('git@github.com:some-owner/some-repo.git', fixture.hasBranch), showLabel(fixture.label, 'ssh'))
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
        expected('git+ssh://git@github.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl')
      )
      tt.is(
        hostinfo.sshurl({ noGitPlus: true }),
        expected('ssh://git@github.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl({ noGitPlus: true })')
      )
      tt.is(
        hostinfo.sshurl({ noGitPlus: false }),
        expected('git+ssh://git@github.com/some-owner/some-repo.git', fixture.hasBranch),
        showLabel(fixture.label, 'sshurl({ noGitPlus: false })')
      )
      tt.end()
    })
    t.test('hostinfo.path', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.path(),
        expected('some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'path')
      )
      tt.is(
        hostinfo.path({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'some-owner/some-repo',
        showLabel(fixture.label, 'path({ noCommittish: true })')
      )
      tt.end()
    })
    t.test('hostinfo.hash', function (tt) {
      var expected = function (url, hasBranch) {
        return (hasBranch)
          ? url + '#' + params.branch
          : url
      }
      tt.is(
        hostinfo.hash(),
        expected('', fixture.hasBranch),
        showLabel(fixture.label, 'hash')
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
        expected('github:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut')
      )
      tt.is(
        hostinfo.shortcut({ noCommittish: true }),
        // INFO: not using `expected` because with `{noCommittish: true}` the output is always the same
        'github:some-owner/some-repo',
        showLabel(fixture.label, 'shortcut({ noCommittish: true })')
      )
      tt.is(
        hostinfo.shortcut({ noCommittish: false }),
        expected('github:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut({ noCommittish: false })')
      )
      tt.is(
        hostinfo.shortcut({ noGitPlus: true }),
        expected('github:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut({ noGitPlus: true })')
      )
      tt.is(
        hostinfo.shortcut({ noGitPlus: false }),
        expected('github:some-owner/some-repo', fixture.hasBranch),
        showLabel(fixture.label, 'shortcut({ noGitPlus: false })')
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
        hostinfo.file(''),
        expected('https://raw.githubusercontent.com/some-owner/some-repo/master/', fixture.hasBranch),
        showLabel(fixture.label, 'file')
      )
      tt.is(
        hostinfo.file('C'),
        expected('https://raw.githubusercontent.com/some-owner/some-repo/master/C', fixture.hasBranch),
        showLabel(fixture.label, "file('C')")
      )
      // NOTE: This seems weird, don't think you'd ever pass the `opts` param with `.file()`
      tt.is(
        hostinfo.file('C', { noCommittish: true }),
        'https://raw.githubusercontent.com/some-owner/some-repo//C',
        showLabel(fixture.label, "file('C', { noCommittish: true })")
      )
      tt.is(
        hostinfo.file('C/D'),
        expected('https://raw.githubusercontent.com/some-owner/some-repo/master/C/D', fixture.hasBranch),
        showLabel(fixture.label, "file('C/D'")
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
        expected('https://codeload.github.com/some-owner/some-repo/tar.gz/master', fixture.hasBranch),
        showLabel(fixture.label, 'tarball')
      )
      tt.is(
        hostinfo.tarball({ noCommittish: true }),
        expected('https://codeload.github.com/some-owner/some-repo/tar.gz/master', fixture.hasBranch),
        showLabel(fixture.label, 'tarball({ noCommittish: true })')
      )
      tt.end()
    })
  }
}

test('fromUrl(github url)', function (t) {
  var fixtures = require('./fixtures')
  var githubFixtures = require('./fixtures/github')
  var collectedFixtures = [].concat(fixtures, githubFixtures)

  t.test('domain: github.com', function (tt) {
    var params = {
      domain: 'github.com',
      shortname: 'github',
      label: 'github',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, collectedFixtures)
    tt.end()
  })

  t.test('domain: www.github.com', function (tt) {
    var params = {
      domain: 'www.github.com',
      shortname: 'github',
      label: 'github',
      owner: 'some-owner',
      project: 'some-repo',
      branch: 'feature-branch'
    }
    testFixtures(tt, params, collectedFixtures)
    tt.end()
  })

  t.equal(HostedGit.fromUrl('git+ssh://github.com/foo.git'), undefined)

  t.test('HTTPS GitHub URL with embedded auth -- generally not a good idea', function (tt) {
    function verify (host, label, branch) {
      var hostinfo = HostedGit.fromUrl(host)
      var hash = branch ? '#' + branch : ''
      tt.ok(hostinfo, label)
      if (!hostinfo) return
      tt.is(hostinfo.https(), 'git+https://user:pass@github.com/111/222.git' + hash, label + ' -> https')
      tt.is(hostinfo.git(), 'git://user:pass@github.com/111/222.git' + hash, label + ' -> git')
      tt.is(hostinfo.browse(), 'https://github.com/111/222' + (branch ? '/tree/' + branch : ''), label + ' -> browse')
      tt.is(hostinfo.browse('C'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C', label + ' -> browse(path)')
      tt.is(hostinfo.browse('C/D'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C/D', label + ' -> browse(path)')
      tt.is(hostinfo.browse('C', 'A'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C#a', label + ' -> browse(path, fragment)')
      tt.is(hostinfo.browse('C/D', 'A'), 'https://github.com/111/222/tree/' + (branch || 'master') + '/C/D#a', label + ' -> browse(path, fragment)')
      tt.is(hostinfo.bugs(), 'https://github.com/111/222/issues', label + ' -> bugs')
      tt.is(hostinfo.docs(), 'https://github.com/111/222' + (branch ? '/tree/' + branch : '') + '#readme', label + ' -> docs')
      tt.is(hostinfo.ssh(), 'git@github.com:111/222.git' + hash, label + ' -> ssh')
      tt.is(hostinfo.sshurl(), 'git+ssh://git@github.com/111/222.git' + hash, label + ' -> sshurl')
      tt.is(hostinfo.shortcut(), 'github:111/222' + hash, label + ' -> shortcut')
      tt.is(hostinfo.file('C'), 'https://user:pass@raw.githubusercontent.com/111/222/' + (branch || 'master') + '/C', label + ' -> file')
      tt.is(hostinfo.file('C/D'), 'https://user:pass@raw.githubusercontent.com/111/222/' + (branch || 'master') + '/C/D', label + ' -> file')
    }

    // insecure protocols
    verify('git://user:pass@github.com/111/222', 'git')
    verify('git://user:pass@github.com/111/222.git', 'git.git')
    verify('git://user:pass@github.com/111/222#branch', 'git#branch', 'branch')
    verify('git://user:pass@github.com/111/222.git#branch', 'git.git#branch', 'branch')

    verify('https://user:pass@github.com/111/222', 'https')
    verify('https://user:pass@github.com/111/222.git', 'https.git')
    verify('https://user:pass@github.com/111/222#branch', 'https#branch', 'branch')
    verify('https://user:pass@github.com/111/222.git#branch', 'https.git#branch', 'branch')

    verify('http://user:pass@github.com/111/222', 'http')
    verify('http://user:pass@github.com/111/222.git', 'http.git')
    verify('http://user:pass@github.com/111/222#branch', 'http#branch', 'branch')
    verify('http://user:pass@github.com/111/222.git#branch', 'http.git#branch', 'branch')

    tt.end()
  })

  t.end()
})
