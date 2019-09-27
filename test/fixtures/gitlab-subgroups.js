'use strict'

module.exports = [
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.group + '/' + p.project },
    label: 'shortname'
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.group + '/' + p.project },
    label: 'shortname.git'
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.group + '/' + p.project + '#' + p.branch },
    label: 'shortname#branch',
    hasBranch: true
  },
  {
    host: function (p) { return p.shortname + ':' + p.owner + '/' + p.group + '/' + p.project + '#' + p.branch },
    label: 'shortname.git#branch',
    hasBranch: true
  }
]
