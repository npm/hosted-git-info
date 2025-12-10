/* eslint-disable max-len */
'use strict'
const { test } = require('node:test')
const assert = require('node:assert')
const HostedGit = require('..')

// Helper function to assert actual object contains all expected properties
const assertHasStrict = (actual, expected, message) => {
  for (const [key, value] of Object.entries(expected)) {
    assert.strictEqual(actual[key], value, `${message} (${key})`)
  }
}

const invalid = [
  // raw urls that are wrong anyway but for some reason are in the wild
  'https://gist.github.com/foo/feedbeef/raw/fix%2Fbug/',
  // missing both user and project
  'https://gist.github.com/',
]

const defaults = { type: 'gist', user: null, project: 'feedbeef' }
const valid = {
  // shortcuts
  //
  // NOTE auth is accepted but ignored
  'gist:feedbeef': { ...defaults, default: 'shortcut' },
  'gist:feedbeef#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gist:user@feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist:user@feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist:user:password@feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist:user:password@feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist::password@feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist::password@feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gist:feedbeef.git': { ...defaults, default: 'shortcut' },
  'gist:feedbeef.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gist:user@feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist:user@feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist:user:password@feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist:user:password@feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist::password@feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist::password@feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gist:/feedbeef': { ...defaults, default: 'shortcut' },
  'gist:/feedbeef#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gist:user@/feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist:user@/feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist:user:password@/feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist:user:password@/feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist::password@/feedbeef': { ...defaults, default: 'shortcut', auth: null },
  'gist::password@/feedbeef#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gist:/feedbeef.git': { ...defaults, default: 'shortcut' },
  'gist:/feedbeef.git#branch': { ...defaults, default: 'shortcut', committish: 'branch' },
  'gist:user@/feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist:user@/feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist:user:password@/feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist:user:password@/feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },
  'gist::password@/feedbeef.git': { ...defaults, default: 'shortcut', auth: null },
  'gist::password@/feedbeef.git#branch': { ...defaults, default: 'shortcut', auth: null, committish: 'branch' },

  'gist:foo/feedbeef': { ...defaults, default: 'shortcut', user: 'foo' },
  'gist:foo/feedbeef#branch': { ...defaults, default: 'shortcut', user: 'foo', committish: 'branch' },
  'gist:user@foo/feedbeef': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist:user@foo/feedbeef#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },
  'gist:user:password@foo/feedbeef': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist:user:password@foo/feedbeef#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },
  'gist::password@foo/feedbeef': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist::password@foo/feedbeef#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },

  'gist:foo/feedbeef.git': { ...defaults, default: 'shortcut', user: 'foo' },
  'gist:foo/feedbeef.git#branch': { ...defaults, default: 'shortcut', user: 'foo', committish: 'branch' },
  'gist:user@foo/feedbeef.git': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist:user@foo/feedbeef.git#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },
  'gist:user:password@foo/feedbeef.git': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist:user:password@foo/feedbeef.git#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },
  'gist::password@foo/feedbeef.git': { ...defaults, default: 'shortcut', user: 'foo', auth: null },
  'gist::password@foo/feedbeef.git#branch': { ...defaults, default: 'shortcut', user: 'foo', auth: null, committish: 'branch' },

  // git urls
  //
  // NOTE auth is accepted and respected
  'git://gist.github.com/feedbeef': { ...defaults, default: 'git' },
  'git://gist.github.com/feedbeef#branch': { ...defaults, default: 'git', committish: 'branch' },
  'git://user@gist.github.com/feedbeef': { ...defaults, default: 'git', auth: 'user' },
  'git://user@gist.github.com/feedbeef#branch': { ...defaults, default: 'git', auth: 'user', committish: 'branch' },
  'git://user:password@gist.github.com/feedbeef': { ...defaults, default: 'git', auth: 'user:password' },
  'git://user:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'git', auth: 'user:password', committish: 'branch' },
  'git://:password@gist.github.com/feedbeef': { ...defaults, default: 'git', auth: ':password' },
  'git://:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'git', auth: ':password', committish: 'branch' },

  'git://gist.github.com/feedbeef.git': { ...defaults, default: 'git' },
  'git://gist.github.com/feedbeef.git#branch': { ...defaults, default: 'git', committish: 'branch' },
  'git://user@gist.github.com/feedbeef.git': { ...defaults, default: 'git', auth: 'user' },
  'git://user@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'git', auth: 'user', committish: 'branch' },
  'git://user:password@gist.github.com/feedbeef.git': { ...defaults, default: 'git', auth: 'user:password' },
  'git://user:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'git', auth: 'user:password', committish: 'branch' },
  'git://:password@gist.github.com/feedbeef.git': { ...defaults, default: 'git', auth: ':password' },
  'git://:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'git', auth: ':password', committish: 'branch' },

  'git://gist.github.com/foo/feedbeef': { ...defaults, default: 'git', user: 'foo' },
  'git://gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'git', user: 'foo', committish: 'branch' },
  'git://user@gist.github.com/foo/feedbeef': { ...defaults, default: 'git', user: 'foo', auth: 'user' },
  'git://user@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'git', user: 'foo', auth: 'user', committish: 'branch' },
  'git://user:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'git', user: 'foo', auth: 'user:password' },
  'git://user:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'git', user: 'foo', auth: 'user:password', committish: 'branch' },
  'git://:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'git', user: 'foo', auth: ':password' },
  'git://:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'git', user: 'foo', auth: ':password', committish: 'branch' },

  'git://gist.github.com/foo/feedbeef.git': { ...defaults, default: 'git', user: 'foo' },
  'git://gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'git', user: 'foo', committish: 'branch' },
  'git://user@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'git', user: 'foo', auth: 'user' },
  'git://user@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'git', user: 'foo', auth: 'user', committish: 'branch' },
  'git://user:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'git', user: 'foo', auth: 'user:password' },
  'git://user:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'git', user: 'foo', auth: 'user:password', committish: 'branch' },
  'git://:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'git', user: 'foo', auth: ':password' },
  'git://:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'git', user: 'foo', auth: ':password', committish: 'branch' },

  // no-protocol git+ssh
  //
  // NOTE auth is accepted and ignored
  'git@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'git@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'user@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'user:password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  ':password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'git@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', committish: 'branch', auth: null },
  'user@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'user@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'user:password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'user:password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  ':password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  ':password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'user@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'user@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'user:password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'user:password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  ':password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  ':password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  'git@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'user@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'user@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'user:password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'user:password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  ':password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  ':password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  // git+ssh urls
  //
  // NOTE auth is accepted but ignored
  // NOTE see TODO at list of invalids, some inputs fail and shouldn't
  'git+ssh://gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://user:password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://user:password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'git+ssh://:password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'git+ssh://:password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'git+ssh://gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', user: 'foo' },
  'git+ssh://gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', user: 'foo', committish: 'branch' },
  'git+ssh://user@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://user@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'git+ssh://user:password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://user:password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'git+ssh://:password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://:password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  'git+ssh://gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', user: 'foo' },
  'git+ssh://gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', user: 'foo', committish: 'branch' },
  'git+ssh://user@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://user@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'git+ssh://user:password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://user:password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'git+ssh://:password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'git+ssh://:password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  // ssh urls
  //
  // NOTE auth is accepted but ignored
  'ssh://gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'ssh://gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gist.github.com:feedbeef': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@gist.github.com:feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://user:password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://user:password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },
  'ssh://:password@gist.github.com:feedbeef.git': { ...defaults, default: 'sshurl', auth: null },
  'ssh://:password@gist.github.com:feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, committish: 'branch' },

  'ssh://gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', user: 'foo' },
  'ssh://gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', user: 'foo', committish: 'branch' },
  'ssh://user@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://user@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'ssh://user:password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://user:password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'ssh://:password@gist.github.com:foo/feedbeef': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://:password@gist.github.com:foo/feedbeef#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  'ssh://gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', user: 'foo' },
  'ssh://gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', user: 'foo', committish: 'branch' },
  'ssh://user@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://user@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'ssh://user:password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://user:password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },
  'ssh://:password@gist.github.com:foo/feedbeef.git': { ...defaults, default: 'sshurl', auth: null, user: 'foo' },
  'ssh://:password@gist.github.com:foo/feedbeef.git#branch': { ...defaults, default: 'sshurl', auth: null, user: 'foo', committish: 'branch' },

  // git+https urls
  //
  // NOTE auth is accepted and respected
  'git+https://gist.github.com/feedbeef': { ...defaults, default: 'https' },
  'git+https://gist.github.com/feedbeef#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://gist.github.com/feedbeef.git': { ...defaults, default: 'https' },
  'git+https://gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'git+https://user@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: 'user' },
  'git+https://user@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'git+https://user:password@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: 'user:password' },
  'git+https://user:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'git+https://:password@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: ':password' },
  'git+https://:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'git+https://gist.github.com/foo/feedbeef': { ...defaults, default: 'https', user: 'foo' },
  'git+https://gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', user: 'foo', committish: 'branch' },
  'git+https://user@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: 'user', user: 'foo' },
  'git+https://user@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: 'user', user: 'foo', committish: 'branch' },
  'git+https://user:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: 'user:password', user: 'foo' },
  'git+https://user:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: 'user:password', user: 'foo', committish: 'branch' },
  'git+https://:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: ':password', user: 'foo' },
  'git+https://:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: ':password', user: 'foo', committish: 'branch' },

  'git+https://gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', user: 'foo' },
  'git+https://gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', user: 'foo', committish: 'branch' },
  'git+https://user@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: 'user', user: 'foo' },
  'git+https://user@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user', user: 'foo', committish: 'branch' },
  'git+https://user:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: 'user:password', user: 'foo' },
  'git+https://user:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user:password', user: 'foo', committish: 'branch' },
  'git+https://:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: ':password', user: 'foo' },
  'git+https://:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: ':password', user: 'foo', committish: 'branch' },

  // https urls
  //
  // NOTE auth is accepted and respected
  'https://gist.github.com/feedbeef': { ...defaults, default: 'https' },
  'https://gist.github.com/feedbeef#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: 'user' },
  'https://user@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gist.github.com/feedbeef': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@gist.github.com/feedbeef#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://gist.github.com/feedbeef.git': { ...defaults, default: 'https' },
  'https://gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', committish: 'branch' },
  'https://user@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: 'user' },
  'https://user@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user', committish: 'branch' },
  'https://user:password@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: 'user:password' },
  'https://user:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user:password', committish: 'branch' },
  'https://:password@gist.github.com/feedbeef.git': { ...defaults, default: 'https', auth: ':password' },
  'https://:password@gist.github.com/feedbeef.git#branch': { ...defaults, default: 'https', auth: ':password', committish: 'branch' },

  'https://gist.github.com/foo/feedbeef': { ...defaults, default: 'https', user: 'foo' },
  'https://gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', user: 'foo', committish: 'branch' },
  'https://user@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: 'user', user: 'foo' },
  'https://user@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: 'user', user: 'foo', committish: 'branch' },
  'https://user:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: 'user:password', user: 'foo' },
  'https://user:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: 'user:password', user: 'foo', committish: 'branch' },
  'https://:password@gist.github.com/foo/feedbeef': { ...defaults, default: 'https', auth: ':password', user: 'foo' },
  'https://:password@gist.github.com/foo/feedbeef#branch': { ...defaults, default: 'https', auth: ':password', user: 'foo', committish: 'branch' },

  'https://gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', user: 'foo' },
  'https://gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', user: 'foo', committish: 'branch' },
  'https://user@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: 'user', user: 'foo' },
  'https://user@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user', user: 'foo', committish: 'branch' },
  'https://user:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: 'user:password', user: 'foo' },
  'https://user:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: 'user:password', user: 'foo', committish: 'branch' },
  'https://:password@gist.github.com/foo/feedbeef.git': { ...defaults, default: 'https', auth: ':password', user: 'foo' },
  'https://:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: ':password', user: 'foo', committish: 'branch' },
}

test('valid urls parse properly', () => {
  for (const [url, result] of Object.entries(valid)) {
    const parsed = HostedGit.fromUrl(url)
    assertHasStrict(parsed, result, `${url} parses`)
  }
})

test('invalid urls return undefined', () => {
  for (const url of invalid) {
    assert.strictEqual(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})

test('toString respects defaults', () => {
  const sshurl = HostedGit.fromUrl('git+ssh://gist.github.com/foo/feedbeef')
  assert.strictEqual(sshurl.default, 'sshurl', 'got the right default')
  assert.strictEqual(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://gist.github.com/foo/feedbeef')
  assert.strictEqual(https.default, 'https', 'got the right default')
  assert.strictEqual(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('gist:feedbeef')
  assert.strictEqual(shortcut.default, 'shortcut', 'got the right default')
  assert.strictEqual(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')
})

test('string methods populate correctly', () => {
  const parsed = HostedGit.fromUrl('git+ssh://gist.github.com/foo/feedbeef')
  assert.strictEqual(parsed.getDefaultRepresentation(), parsed.default)
  assert.strictEqual(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  assert.strictEqual(parsed.ssh(), 'git@gist.github.com:feedbeef.git')
  assert.strictEqual(parsed.sshurl(), 'git+ssh://git@gist.github.com/feedbeef.git')
  assert.strictEqual(parsed.edit(), 'https://gist.github.com/foo/feedbeef/edit', 'gist link only redirects with a user')
  assert.strictEqual(parsed.edit('/lib/index.js'), 'https://gist.github.com/foo/feedbeef/edit', 'gist link only redirects with a user')
  assert.strictEqual(parsed.browse(), 'https://gist.github.com/feedbeef')
  assert.strictEqual(parsed.browse('/lib/index.js'), 'https://gist.github.com/feedbeef#file-libindex-js')
  assert.strictEqual(parsed.browse('/lib/index.js', 'L100'), 'https://gist.github.com/feedbeef#file-libindex-js')
  assert.strictEqual(parsed.browseFile('/lib/index.js'), 'https://gist.github.com/feedbeef#file-libindex-js')
  assert.strictEqual(parsed.browseFile('/lib/index.js', 'L100'), 'https://gist.github.com/feedbeef#file-libindex-js')
  assert.strictEqual(parsed.docs(), 'https://gist.github.com/feedbeef')
  assert.strictEqual(parsed.https(), 'git+https://gist.github.com/feedbeef.git')
  assert.strictEqual(parsed.shortcut(), 'gist:feedbeef')
  assert.strictEqual(parsed.path(), 'feedbeef')
  assert.strictEqual(parsed.tarball(), 'https://codeload.github.com/gist/feedbeef/tar.gz/HEAD')
  assert.strictEqual(parsed.file(), 'https://gist.githubusercontent.com/foo/feedbeef/raw/')
  assert.strictEqual(parsed.file('/lib/index.js'), 'https://gist.githubusercontent.com/foo/feedbeef/raw/lib/index.js')
  assert.strictEqual(parsed.git(), 'git://gist.github.com/feedbeef.git')
  assert.strictEqual(parsed.bugs(), 'https://gist.github.com/feedbeef')

  assert.strictEqual(parsed.ssh({ committish: 'fix/bug' }), 'git@gist.github.com:feedbeef.git#fix/bug', 'allows overriding options')

  const extra = HostedGit.fromUrl('https://user@gist.github.com/foo/feedbeef#fix/bug')
  assert.strictEqual(extra.hash(), '#fix/bug')
  assert.strictEqual(extra.https(), 'git+https://gist.github.com/feedbeef.git#fix/bug')
  assert.strictEqual(extra.shortcut(), 'gist:feedbeef#fix/bug')
  assert.strictEqual(extra.ssh(), 'git@gist.github.com:feedbeef.git#fix/bug')
  assert.strictEqual(extra.sshurl(), 'git+ssh://git@gist.github.com/feedbeef.git#fix/bug')
  assert.strictEqual(extra.browse(), 'https://gist.github.com/feedbeef/fix%2Fbug')
  assert.strictEqual(extra.browse('/lib/index.js'), 'https://gist.github.com/feedbeef/fix%2Fbug#file-libindex-js')
  assert.strictEqual(extra.browse('/lib/index.js', 'L200'), 'https://gist.github.com/feedbeef/fix%2Fbug#file-libindex-js')
  assert.strictEqual(extra.docs(), 'https://gist.github.com/feedbeef/fix%2Fbug')
  assert.strictEqual(extra.file(), 'https://gist.githubusercontent.com/foo/feedbeef/raw/fix%2Fbug/')
  assert.strictEqual(extra.file('/lib/index.js'), 'https://gist.githubusercontent.com/foo/feedbeef/raw/fix%2Fbug/lib/index.js')
  assert.strictEqual(extra.tarball(), 'https://codeload.github.com/gist/feedbeef/tar.gz/fix%2Fbug')

  assert.strictEqual(extra.sshurl({ noCommittish: true }), 'git+ssh://git@gist.github.com/feedbeef.git', 'noCommittish drops committish from urls')
  assert.strictEqual(extra.sshurl({ noGitPlus: true }), 'ssh://git@gist.github.com/feedbeef.git#fix/bug', 'noGitPlus drops git+ prefix from urls')
})
