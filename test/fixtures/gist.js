'use strict'

module.exports = [
  {
    host: function (p) { return 'gist:' + p.owner + '/' + p.project },
    label: 'gist'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':/' + p.project },
    label: 'git@:/'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':/' + p.project + '.git' },
    label: 'git@:/.git'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':' + p.project + '.git' },
    label: 'git@'
  },
  {
    host: function (p) { return 'git@' + p.domain + ':/' + p.project + '.git' },
    label: 'git@/'
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.project },
    label: 'git'
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.project + '.git' },
    label: 'git.git'
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.project + '#' + p.branch },
    label: 'git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git://' + p.domain + '/' + p.project + '.git#' + p.branch },
    label: 'git.git#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git://' + p.domain + ':/' + p.project },
    label: 'git:/'
  },
  {
    host: function (p) { return 'git://' + p.domain + ':/' + p.project + '.git' },
    label: 'git:/.git'
  },
  {
    host: function (p) { return 'git://' + p.domain + ':/' + p.project + '#' + p.branch },
    label: 'git:/#branch',
    hasBranch: true
  },
  {
    host: function (p) { return 'git://' + p.domain + ':/' + p.project + '.git#' + p.branch },
    label: 'git:/.git#branch',
    hasBranch: true
  }
]
