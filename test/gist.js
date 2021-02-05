'use strict'
const HostedGit = require('../index')
const t = require('tap')

const invalid = [
  // raw urls that are wrong anyway but for some reason are in the wild
  'https://gist.github.com/foo/feedbeef/raw/fix%2Fbug/',
  // missing both user and project
  'https://gist.github.com/'
]

// user defaults to null for all inputs that do not specify one
// assigning the constructor here is hacky, but the only way to make assertions that compare
// a subset of properties to a found object pass as you would expect
const GitHost = require('../git-host')
const defaults = { constructor: GitHost, type: 'gist', user: null, project: 'feedbeef' }
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
  'https://:password@gist.github.com/foo/feedbeef.git#branch': { ...defaults, default: 'https', auth: ':password', user: 'foo', committish: 'branch' }
}

t.test('valid urls parse properly', t => {
  t.plan(Object.keys(valid).length)
  for (const [url, result] of Object.entries(valid)) {
    t.hasStrict(HostedGit.fromUrl(url), result, `${url} parses`)
  }
})

t.test('invalid urls return undefined', t => {
  t.plan(invalid.length)
  for (const url of invalid) {
    t.equal(HostedGit.fromUrl(url), undefined, `${url} returns undefined`)
  }
})

t.test('toString respects defaults', t => {
  const sshurl = HostedGit.fromUrl('git+ssh://gist.github.com/foo/feedbeef')
  t.equal(sshurl.default, 'sshurl', 'got the right default')
  t.equal(sshurl.toString(), sshurl.sshurl(), 'toString calls sshurl')

  const https = HostedGit.fromUrl('https://gist.github.com/foo/feedbeef')
  t.equal(https.default, 'https', 'got the right default')
  t.equal(https.toString(), https.https(), 'toString calls https')

  const shortcut = HostedGit.fromUrl('gist:feedbeef')
  t.equal(shortcut.default, 'shortcut', 'got the right default')
  t.equal(shortcut.toString(), shortcut.shortcut(), 'toString calls shortcut')

  t.end()
})

t.test('string methods populate correctly', t => {
  const parsed = HostedGit.fromUrl('git+ssh://gist.github.com/foo/feedbeef')
  t.equal(parsed.getDefaultRepresentation(), parsed.default)
  t.equal(parsed.hash(), '', 'hash() returns empty string when committish is unset')
  t.equal(parsed.ssh(), 'git@gist.github.com:feedbeef.git')
  t.equal(parsed.sshurl(), 'git+ssh://git@gist.github.com/feedbeef.git')
  t.equal(parsed.browse(), 'https://gist.github.com/feedbeef')
  t.equal(parsed.browse('/lib/index.js'), 'https://gist.github.com/feedbeef#file-libindex-js')
  t.equal(parsed.browse('/lib/index.js', 'L100'), 'https://gist.github.com/feedbeef#file-libindex-js')
  t.equal(parsed.docs(), 'https://gist.github.com/feedbeef')
  t.equal(parsed.https(), 'git+https://gist.github.com/feedbeef.git')
  t.equal(parsed.shortcut(), 'gist:feedbeef')
  t.equal(parsed.path(), 'feedbeef')
  t.equal(parsed.tarball(), 'https://codeload.github.com/gist/feedbeef/tar.gz/master')
  t.equal(parsed.file(), 'https://gist.githubusercontent.com/foo/feedbeef/raw/')
  t.equal(parsed.file('/lib/index.js'), 'https://gist.githubusercontent.com/foo/feedbeef/raw/lib/index.js')
  t.equal(parsed.git(), 'git://gist.github.com/feedbeef.git')
  t.equal(parsed.bugs(), 'https://gist.github.com/feedbeef')

  t.equal(parsed.ssh({ committish: 'fix/bug' }), 'git@gist.github.com:feedbeef.git#fix/bug', 'allows overriding options')

  const extra = HostedGit.fromUrl('https://user@gist.github.com/foo/feedbeef#fix/bug')
  t.equal(extra.hash(), '#fix/bug')
  t.equal(extra.https(), 'git+https://gist.github.com/feedbeef.git#fix/bug')
  t.equal(extra.shortcut(), 'gist:feedbeef#fix/bug')
  t.equal(extra.ssh(), 'git@gist.github.com:feedbeef.git#fix/bug')
  t.equal(extra.sshurl(), 'git+ssh://git@gist.github.com/feedbeef.git#fix/bug')
  t.equal(extra.browse(), 'https://gist.github.com/feedbeef/fix%2Fbug')
  t.equal(extra.browse('/lib/index.js'), 'https://gist.github.com/feedbeef/fix%2Fbug#file-libindex-js')
  t.equal(extra.browse('/lib/index.js', 'L200'), 'https://gist.github.com/feedbeef/fix%2Fbug#file-libindex-js')
  t.equal(extra.docs(), 'https://gist.github.com/feedbeef/fix%2Fbug')
  t.equal(extra.file(), 'https://gist.githubusercontent.com/foo/feedbeef/raw/fix%2Fbug/')
  t.equal(extra.file('/lib/index.js'), 'https://gist.githubusercontent.com/foo/feedbeef/raw/fix%2Fbug/lib/index.js')
  t.equal(extra.tarball(), 'https://codeload.github.com/gist/feedbeef/tar.gz/fix%2Fbug')

  t.equal(extra.sshurl({ noCommittish: true }), 'git+ssh://git@gist.github.com/feedbeef.git', 'noCommittish drops committish from urls')
  t.equal(extra.sshurl({ noGitPlus: true }), 'ssh://git@gist.github.com/feedbeef.git#fix/bug', 'noGitPlus drops git+ prefix from urls')

  t.end()
})
