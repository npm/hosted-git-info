var HostedGitInfo = require('../')

var tap = require('tap')
var url = require('url')

// Auth credentials with special characters (colon and/or at-sign) should remain correctly escaped
var parsedInfo = HostedGitInfo.fromUrl('https://user%3An%40me:p%40ss%3Aword@github.com/npm/hosted-git-info.git')
tap.equal(parsedInfo.auth, 'user%3An%40me:p%40ss%3Aword')

// Node.js' built-in `url` module should be able to parse the resulting url
var parsedUrl = new url.URL(parsedInfo.toString())
tap.equal(parsedUrl.username, 'user%3An%40me')
tap.equal(parsedUrl.password, 'p%40ss%3Aword')
tap.equal(parsedUrl.hostname, 'github.com')
