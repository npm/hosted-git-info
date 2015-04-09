'use strict'
var url = require('url')
var gitHosts = require('./git-host-info.js')
var GitHost = module.exports = require('./git-host.js')

var protocolMap = {
  'git+ssh': 'sshurl',
  'git+https': 'https',
  'ssh': 'sshurl',
  'git': 'git'
}

function protocolToType (protocol) {
  if (protocol.substr(-1) === ':') protocol = protocol.slice(0, -1)
  return protocolMap[protocol] || protocol
}

var authProtocols = {
  'git:': true,
  'https:': true,
  'http:': true
}

module.exports.fromUrl = function (giturl) {
  if (giturl == null || giturl === '') return
  var parsed = parseGitUrl(maybeGitHubShorthand(giturl) ? 'github:' + giturl : giturl)
  var matches = Object.keys(gitHosts).map(function (gitHostName) {
    var gitHostInfo = gitHosts[gitHostName]
    var auth = null
    if (parsed.auth && authProtocols[parsed.protocol]) {
      auth = decodeURIComponent(parsed.auth)
    }
    var comittish = parsed.hash ? decodeURIComponent(parsed.hash.substr(1)) : null
    if (parsed.protocol === gitHostName + ':') {
      return new GitHost(gitHostName,
        decodeURIComponent(parsed.host), auth, decodeURIComponent(parsed.path.replace(/^[/](.*?)(?:[.]git)?$/, '$1')), comittish, 'shortcut')
    }
    if (parsed.host !== gitHostInfo.domain) return
    if (!gitHostInfo.protocols_re.test(parsed.protocol)) return
    var pathmatch = gitHostInfo.pathmatch
    var matched = parsed.path.match(pathmatch)
    if (!matched) return
    return new GitHost(
      gitHostName,
      matched[1] != null && decodeURIComponent(matched[1]),
      auth,
      matched[2] != null && decodeURIComponent(matched[2]),
      comittish,
      protocolToType(parsed.protocol))
  }).filter(function (gitHostInfo) { return gitHostInfo })
  if (matches.length !== 1) return
  return matches[0]
}

function maybeGitHubShorthand (arg) {
  // Note: This does not fully test the git ref format.
  // See https://www.kernel.org/pub/software/scm/git/docs/git-check-ref-format.html
  //
  // The only way to do this properly would be to shell out to
  // git-check-ref-format, and as this is a fast sync function,
  // we don't want to do that.  Just let git fail if it turns
  // out that the commit-ish is invalid.
  // GH usernames cannot start with . or -
  return /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(arg)
}

function parseGitUrl (giturl) {
  if (typeof giturl !== 'string') giturl = '' + giturl
  var matched = giturl.match(/^([^@]+)@([^:]+):[/]?((?:[^/]+[/])?[^/]+?)(?:[.]git)?(#.*)?$/)
  if (!matched) return url.parse(giturl)
  return {
    protocol: 'git+ssh:',
    slashes: true,
    auth: matched[1],
    host: matched[2],
    port: null,
    hostname: matched[2],
    hash: matched[4],
    search: null,
    query: null,
    pathname: '/' + matched[3],
    path: '/' + matched[3],
    href: 'git+ssh://' + matched[1] + '@' + matched[2] + '/' + matched[3] + (matched[4] || '')
  }
}
