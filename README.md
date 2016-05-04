<!--@'# ' + package.name + ' ' + shields.flatSquare('npm', 'travis')-->
# hosted-git-info [![NPM version](https://img.shields.io/npm/v/hosted-git-info.svg?style=flat-square)](https://www.npmjs.com/package/hosted-git-info) [![Build status for master](https://img.shields.io/travis/npm/hosted-git-info/master.svg?style=flat-square)](https://travis-ci.org/npm/hosted-git-info)
<!--/@-->

<!--@package.description-->
Provides metadata and conversions from repository urls for Github, Bitbucket and Gitlab
<!--/@-->

This will let you identify and transform various git hosts URLs between
protocols. It also can tell you what the URL is for the raw path for
particular file for direct access without git.

<!--@installation()-->
## Installation

This module is installed via npm:

```sh
npm install hosted-git-info --save
```
<!--/@-->

## Usage

<!--@example('example.js')-->
```js
var hostedGitInfo = require('hosted-git-info')
var info = hostedGitInfo.fromUrl('git@github.com:npm/hosted-git-info.git')
console.log([info.type, info.domain, info.user, info.project].join('\n'))
//> github
//  github.com
//  npm
//  hosted-git-info
```

If the URL can't be matched with a git host, `null` will be returned.  We
can match git, ssh and https urls.  Additionally, we can match ssh connect
strings (`git@github.com:npm/hosted-git-info`) and shortcuts (eg,
`github:npm/hosted-git-info`).  Github specifically, is detected in the case
of a third, unprefixed, form: `npm/hosted-git-info`.
If it does match, the returned object has properties of:

- info.type -- The short name of the service
- info.domain -- The domain for git protocol use
- info.user -- The name of the user/org on the git host
- info.project -- The name of the project on the git host
  And methods of:
- info.file(path)
  Given the path of a file relative to the repository, returns a URL for
  directly fetching it from the githost.  If no committish was set then
  `master` will be used as the default.
  For example

```js
var url = hostedGitInfo.fromUrl('git@github.com:npm/hosted-git-info.git#v1.0.0').file('package.json')
console.log(url)
//> https://raw.githubusercontent.com/npm/hosted-git-info/v1.0.0/package.json

console.log(info.shortcut())
//> github:npm/hosted-git-info

console.log(info.browse())
//> https://github.com/npm/hosted-git-info

console.log(info.bugs())
//> https://github.com/npm/hosted-git-info/issues

console.log(info.docs())
//> https://github.com/npm/hosted-git-info#readme

console.log(info.https())
//> git+https://github.com/npm/hosted-git-info.git

console.log(info.sshurl())
//> git+ssh://git@github.com/npm/hosted-git-info.git

console.log(info.ssh())
//> git@github.com:npm/hosted-git-info.git

console.log(info.path())
//> npm/hosted-git-info

console.log(info.getDefaultRepresentation())
//> sshurl
```

Returns the default output type. The default output type is based on the
string you passed in to be parsed

- info.toString()
  Uses the getDefaultRepresentation to call one of the other methods to get a URL for
  this resource. As such `hostedGitInfo.fromUrl(url).toString()` will give
  you a normalized version of the URL that still uses the same protocol.
  Shortcuts will still be returned as shortcuts, but the special case github
  form of `org/project` will be normalized to `github:org/project`.
  SSH connect strings will be normalized into `git+ssh` URLs.

<!--/@-->

## Supported hosts

Currently this supports Github, Bitbucket and Gitlab. Pull requests for
additional hosts welcome.

<!--@license()-->
## License

[ISC](./LICENSE) © [Rebecca Turner](http://re-becca.org)
<!--/@-->

* * *

<!--@devDependencies({ shield: 'flat-square' })-->
## <a name="dev-dependencies">Dev Dependencies</a> [![devDependency status for master](https://img.shields.io/david/dev/npm/hosted-git-info/master.svg?style=flat-square)](https://david-dm.org/npm/hosted-git-info/master#info=devDependencies)

- [mos](https://github.com/zkochan/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [standard](https://github.com/feross/standard): JavaScript Standard Style
- [tap](https://github.com/isaacs/node-tap): A Test-Anything-Protocol library

<!--/@-->
