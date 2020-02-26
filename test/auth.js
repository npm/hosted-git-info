var HostedGitInfo = require('../')

var tap = require('tap')

// Auth credentials with special characters (colon and/or at-sign) should remain correctly escaped
var parsedInfo = HostedGitInfo.fromUrl('https://user%3An%40me:p%40ss%3Aword@github.com/npm/hosted-git-info.git')
tap.equal(parsedInfo.auth, 'user%3An%40me:p%40ss%3Aword')

// For full backwards-compatibility; support auth where only username or only password is provided
tap.equal(HostedGitInfo.fromUrl('https://user%3An%40me@github.com/npm/hosted-git-info.git').auth, 'user%3An%40me')
tap.equal(HostedGitInfo.fromUrl('https://:p%40ss%3Aword@github.com/npm/hosted-git-info.git').auth, ':p%40ss%3Aword')
