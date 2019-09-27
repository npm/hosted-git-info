'use strict'

module.exports = [
  // Github Shorturls
  {
    host: function (p) { return p.owner + '/' + p.project },
    label: 'github-short'
  },
  {
    host: function (p) { return p.owner + '/' + p.project + '#' + p.branch },
    label: 'github-short#branch',
    hasBranch: true
  },
  {
    host: function (p) { return p.owner + '/' + p.project + '#' + p.branch },
    label: 'github-short#branch',
    hasBranch: true
  },
  // Insecure Protocols
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.owner + '/' + p.project },
    label: 'git'
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.owner + '/' + p.project + '.git' },
    label: 'git.git'
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.owner + '/' + p.project + '#' + p.branch },
    label: 'git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.owner + '/' + p.project + '.git#' + p.branch },
    label: 'git.git#branch',
    hasBranch: true
  }
]
