'use strcit'

module.exports = [
  {
    host: function (p) { return 'https://' + p.domain + '/' + p.owner + '/' + p.project },
    label: 'https'
  },
  {
    host: function (p) { return 'https://' + p.domain + '/' + p.owner + '/' + p.project + '.git' },
    label: 'https.git'
  },
  {
    host: function (p) { return 'https://' + p.domain + '/' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'https#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'https://' + p.domain + '/' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'https.git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'https://' + p.domain + '/' + p.owner + '/' + p.project + '/-/' + 'archive' + '/3.3.2' + '/ws-3.3.2.tar.gz' },
    label: 'https.tar',
    isUndefined: true
  },
  {
    host: function (p) { return 'git+https://' + p.domain + '/' + p.owner + '/' + p.project },
    label: 'git+https'
  },
  {
    host: function (p) { return 'git+https://' + p.domain + '/' + p.owner + '/' + p.project + '.git' },
    label: 'git+https.git'
  },
  {
    host: function (p) { return 'git+https://' + p.domain + '/' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'git+https#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git+https://' + p.domain + '/' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'git+https.git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git@' + p.domain + ':' + p.owner + '/' + p.project },
    label: 'ssh'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':' + p.owner + '/' + p.project + '.git' },
    label: 'ssh.git'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'ssh#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git@' + p.domain + ':' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'ssh.git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git+ssh://git@' + p.domain + '/' + p.owner + '/' + p.project },
    label: 'ssh-url'
  },
  {
    host: function (p) { return 'git+ssh://git@' + p.domain + '/' + p.owner + '/' + p.project + '.git' },
    label: 'ssh-url.git'
  },
  {
    host: function (p) { return 'git+ssh://git@' + p.domain + '/' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'ssh-url#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git+ssh://git@' + p.domain + '/' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'ssh-url.git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.project },
    label: 'shortcut'
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.project + '.git' },
    label: 'shortcut.git'
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'shortcut#branch',
    hasBranch: true
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'shortcut.git#branch',
    hasBranch: true
  }
]
