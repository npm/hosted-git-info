var hostedGitInfo = require('.')
var info = hostedGitInfo.fromUrl('git@github.com:npm/hosted-git-info.git')
console.log([info.type, info.domain, info.user, info.project].join('\n'))

/*!
If the URL can't be matched with a git host, `null` will be returned.  We
can match git, ssh and https urls.  Additionally, we can match ssh connect
strings (`git@github.com:npm/hosted-git-info`) and shortcuts (eg,
`github:npm/hosted-git-info`).  Github specifically, is detected in the case
of a third, unprefixed, form: `npm/hosted-git-info`.

If it does match, the returned object has properties of:

* info.type -- The short name of the service
* info.domain -- The domain for git protocol use
* info.user -- The name of the user/org on the git host
* info.project -- The name of the project on the git host

And methods of:

* info.file(path)

Given the path of a file relative to the repository, returns a URL for
directly fetching it from the githost.  If no committish was set then
`master` will be used as the default.

For example
*/

var url = hostedGitInfo.fromUrl('git@github.com:npm/hosted-git-info.git#v1.0.0').file('package.json')
console.log(url)

console.log(info.shortcut())

console.log(info.browse())

console.log(info.bugs())

console.log(info.docs())

console.log(info.https())

console.log(info.sshurl())

console.log(info.ssh())

console.log(info.path())

console.log(info.getDefaultRepresentation())

/*!
Returns the default output type. The default output type is based on the
string you passed in to be parsed

* info.toString()

Uses the getDefaultRepresentation to call one of the other methods to get a URL for
this resource. As such `hostedGitInfo.fromUrl(url).toString()` will give
you a normalized version of the URL that still uses the same protocol.

Shortcuts will still be returned as shortcuts, but the special case github
form of `org/project` will be normalized to `github:org/project`.

SSH connect strings will be normalized into `git+ssh` URLs.
*/
