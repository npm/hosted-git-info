# Changelog

## [5.2.2](https://github.com/npm/hosted-git-info/compare/v5.2.1...v5.2.2) (2023-12-07)

### Chores

* [`ba46326`](https://github.com/npm/hosted-git-info/commit/ba4632616845990bff5a276abce4ecbd0f8eee44) [#243](https://github.com/npm/hosted-git-info/pull/243) postinstall for dependabot template-oss PR (@lukekarrys)
* [`ddcf1de`](https://github.com/npm/hosted-git-info/commit/ddcf1de2514f7b7e75c4b00ab3c86c884a9a6083) [#243](https://github.com/npm/hosted-git-info/pull/243) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`6bc08d6`](https://github.com/npm/hosted-git-info/commit/6bc08d66ac6891b2f3e7604a00205a9e63866bfb) [#238](https://github.com/npm/hosted-git-info/pull/238) chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`3699bd4`](https://github.com/npm/hosted-git-info/commit/3699bd4c63f394fd2e688bc9bcf0d3779fa6a835) [#238](https://github.com/npm/hosted-git-info/pull/238) bump @npmcli/template-oss from 4.21.0 to 4.21.1 (@dependabot[bot])
* [`e7fb828`](https://github.com/npm/hosted-git-info/commit/e7fb8282795090e94a37b76635b6ebec4b1b4e37) [#236](https://github.com/npm/hosted-git-info/pull/236) chore: postinstall for dependabot template-oss PR (@lukekarrys)
* [`77e89a3`](https://github.com/npm/hosted-git-info/commit/77e89a3c377dab8a7ecf64cae152ccd486f148fb) [#236](https://github.com/npm/hosted-git-info/pull/236) bump @npmcli/template-oss from 4.19.0 to 4.21.0 (@dependabot[bot])
* [`c9e70f3`](https://github.com/npm/hosted-git-info/commit/c9e70f384b8703a957788ec490a1255d96f2eb05) [#216](https://github.com/npm/hosted-git-info/pull/216) auto publish (@lukekarrys)
* [`ac64fa2`](https://github.com/npm/hosted-git-info/commit/ac64fa2b64d98eef9913b860f136b1f722e97f7b) [#216](https://github.com/npm/hosted-git-info/pull/216) postinstall for dependabot template-oss PR (@lukekarrys)
* [`872ac71`](https://github.com/npm/hosted-git-info/commit/872ac712ee05afeb5becdd5f72ff87375d1266a6) [#216](https://github.com/npm/hosted-git-info/pull/216) postinstall for dependabot template-oss PR (@lukekarrys)
* [`b474140`](https://github.com/npm/hosted-git-info/commit/b474140d897101b8d2e80cace4485eb2f8e90aa9) [#216](https://github.com/npm/hosted-git-info/pull/216) bump @npmcli/template-oss from 4.7.1 to 4.18.1 (@dependabot[bot])

## [5.2.1](https://github.com/npm/hosted-git-info/compare/v5.2.0...v5.2.1) (2022-10-27)

### Bug Fixes

* [`d2db548`](https://github.com/npm/hosted-git-info/commit/d2db5488ba372a12b642743cf07f7a88585130b0) [#177](https://github.com/npm/hosted-git-info/pull/177) only correct protocols when called from githost (@lukekarrys)

## [5.2.0](https://github.com/npm/hosted-git-info/compare/v5.1.0...v5.2.0) (2022-10-26)

### Features

* [`c512363`](https://github.com/npm/hosted-git-info/commit/c51236372f5070a01f76db0620b3fbcbe3ceb3c9) [#173](https://github.com/npm/hosted-git-info/pull/173) add parseUrl method for only parsing (@lukekarrys)

## [5.1.0](https://github.com/npm/hosted-git-info/compare/v5.0.0...v5.1.0) (2022-08-09)


### Features

* add method to get an edit link to a file ([ad02952](https://github.com/npm/hosted-git-info/commit/ad02952f89fbdc99e67ae0d5308029395bde3331))


### Bug Fixes

* add comments to empty catch blocks for linting ([70a770d](https://github.com/npm/hosted-git-info/commit/70a770d1202128e15887d69dfd5c930e4ff29a00))

## [5.0.0](https://www.github.com/npm/hosted-git-info/compare/v4.1.0...v5.0.0) (2022-03-14)


### ⚠ BREAKING CHANGES

* this drops support for node 10 and non-LTS versions of node 12 and node 14

### Bug Fixes

* move files to lib ([a3f4836](https://www.github.com/npm/hosted-git-info/commit/a3f4836ba0a75b355c004e1991e8dd1e6321a983))


* @npmcli/template-oss@2.9.2 ([c42e1f2](https://www.github.com/npm/hosted-git-info/commit/c42e1f216542ead9d0d328704c5db02204f15ce8))


### Dependencies

* bump lru-cache from 6.0.0 to 7.5.1 ([#128](https://www.github.com/npm/hosted-git-info/issues/128)) ([5b0b3b5](https://www.github.com/npm/hosted-git-info/commit/5b0b3b50bd36f659037e3b82a7ff47b0eff3b9f9))

## [4.0.0](https://github.com/npm/hosted-git-info/compare/v3.0.7...v4.0.0) (2021-03-09)


### Features

* rewrite the entire module: all internals have been rewritten to maintain a similar contract but to remove excessive use of regular expressions, unnecessary loops, the custom string templating engine, and various other bits of complexity ([c218b9](https://github.com/npm/hosted-git-info/commit/c218b9ec90cf6a818341cd0f7b03ea65793b185b))


### BREAKING CHANGES

* extending with custom providers has changed ([c218b9](https://github.com/npm/hosted-git-info/commit/c218b9ec90cf6a818341cd0f7b03ea65793b185b))



<a name="3.0.8"></a>
## [3.0.8](https://github.com/npm/hosted-git-info/compare/v3.0.7...v3.0.8) (2021-01-28)


### Bug Fixes

* simplify the regular expression for shortcut matching ([bede0dc](https://github.com/npm/hosted-git-info/commit/bede0dc)), closes [#76](https://github.com/npm/hosted-git-info/issues/76)



<a name="3.0.7"></a>
## [3.0.7](https://github.com/npm/hosted-git-info/compare/v3.0.6...v3.0.7) (2020-10-15)


### Bug Fixes

* correctly filter out urls for tarballs in gitlab ([eb5bd5a](https://github.com/npm/hosted-git-info/commit/eb5bd5a)), closes [#69](https://github.com/npm/hosted-git-info/issues/69)



<a name="3.0.6"></a>
## [3.0.6](https://github.com/npm/hosted-git-info/compare/v3.0.5...v3.0.6) (2020-10-12)


### Bug Fixes

* support to github gist legacy hash length ([c067102](https://github.com/npm/hosted-git-info/commit/c067102)), closes [#68](https://github.com/npm/hosted-git-info/issues/68)



<a name="3.0.5"></a>
## [3.0.5](https://github.com/npm/hosted-git-info/compare/v3.0.4...v3.0.5) (2020-07-11)



<a name="3.0.4"></a>
## [3.0.4](https://github.com/npm/hosted-git-info/compare/v3.0.3...v3.0.4) (2020-02-26)


### Bug Fixes

* Do not pass scp-style URLs to the WhatWG url.URL ([0835306](https://github.com/npm/hosted-git-info/commit/0835306)), closes [#60](https://github.com/npm/hosted-git-info/issues/60) [#63](https://github.com/npm/hosted-git-info/issues/63)



<a name="3.0.3"></a>
## [3.0.3](https://github.com/npm/hosted-git-info/compare/v3.0.2...v3.0.3) (2020-02-25)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/npm/hosted-git-info/compare/v3.0.1...v3.0.2) (2019-10-08)


### Bug Fixes

* do not encodeURIComponent the domain ([3e5fbec](https://github.com/npm/hosted-git-info/commit/3e5fbec)), closes [#53](https://github.com/npm/hosted-git-info/issues/53)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/npm/hosted-git-info/compare/v3.0.0...v3.0.1) (2019-10-07)


### Bug Fixes

* update pathmatch for gitlab ([e3e3054](https://github.com/npm/hosted-git-info/commit/e3e3054)), closes [#52](https://github.com/npm/hosted-git-info/issues/52)
* updated pathmatch for gitlab ([fa87af7](https://github.com/npm/hosted-git-info/commit/fa87af7))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/npm/hosted-git-info/compare/v2.8.3...v3.0.0) (2019-08-12)


### Bug Fixes

* **cache:** Switch to lru-cache to save ourselves from unlimited memory consumption ([37c2891](https://github.com/npm/hosted-git-info/commit/37c2891)), closes [#38](https://github.com/npm/hosted-git-info/issues/38)


### BREAKING CHANGES

* **cache:** Drop support for node 0.x



<a name="2.8.3"></a>
## [2.8.3](https://github.com/npm/hosted-git-info/compare/v2.8.2...v2.8.3) (2019-08-12)



<a name="2.8.2"></a>
## [2.8.2](https://github.com/npm/hosted-git-info/compare/v2.8.1...v2.8.2) (2019-08-05)


### Bug Fixes

* http protocol use sshurl by default ([3b1d629](https://github.com/npm/hosted-git-info/commit/3b1d629)), closes [#48](https://github.com/npm/hosted-git-info/issues/48)



<a name="2.8.1"></a>
## [2.8.1](https://github.com/npm/hosted-git-info/compare/v2.8.0...v2.8.1) (2019-08-05)


### Bug Fixes

* ignore noCommittish on tarball url generation ([5d4a8d7](https://github.com/npm/hosted-git-info/commit/5d4a8d7))
* use gist tarball url that works for anonymous gists ([1692435](https://github.com/npm/hosted-git-info/commit/1692435))



<a name="2.8.0"></a>
# [2.8.0](https://github.com/npm/hosted-git-info/compare/v2.7.1...v2.8.0) (2019-08-05)


### Bug Fixes

* Allow slashes in gitlab project section ([bbcf7b2](https://github.com/npm/hosted-git-info/commit/bbcf7b2)), closes [#46](https://github.com/npm/hosted-git-info/issues/46) [#43](https://github.com/npm/hosted-git-info/issues/43)
* **git-host:** disallow URI-encoded slash (%2F) in `path` ([3776fa5](https://github.com/npm/hosted-git-info/commit/3776fa5)), closes [#44](https://github.com/npm/hosted-git-info/issues/44)
* **gitlab:** Do not URL encode slashes in project name for GitLab https URL ([cbf04f9](https://github.com/npm/hosted-git-info/commit/cbf04f9)), closes [#47](https://github.com/npm/hosted-git-info/issues/47)
* do not allow invalid gist urls ([d5cf830](https://github.com/npm/hosted-git-info/commit/d5cf830))
* **cache:** Switch to lru-cache to save ourselves from unlimited memory consumption ([e518222](https://github.com/npm/hosted-git-info/commit/e518222)), closes [#38](https://github.com/npm/hosted-git-info/issues/38)


### Features

* give these objects a name ([60abaea](https://github.com/npm/hosted-git-info/commit/60abaea))



<a name="2.7.1"></a>
## [2.7.1](https://github.com/npm/hosted-git-info/compare/v2.7.0...v2.7.1) (2018-07-07)


### Bug Fixes

* **index:** Guard against non-string types ([5bc580d](https://github.com/npm/hosted-git-info/commit/5bc580d))
* **parse:** Crash on strings that parse to having no host ([c931482](https://github.com/npm/hosted-git-info/commit/c931482)), closes [#35](https://github.com/npm/hosted-git-info/issues/35)



<a name="2.7.0"></a>
# [2.7.0](https://github.com/npm/hosted-git-info/compare/v2.6.1...v2.7.0) (2018-07-06)


### Bug Fixes

* **github tarball:** update github tarballtemplate ([6efd582](https://github.com/npm/hosted-git-info/commit/6efd582)), closes [#34](https://github.com/npm/hosted-git-info/issues/34)
* **gitlab docs:** switched to lowercase anchors for readmes ([701bcd1](https://github.com/npm/hosted-git-info/commit/701bcd1))


### Features

* **all:** Support www. prefixes on hostnames ([3349575](https://github.com/npm/hosted-git-info/commit/3349575)), closes [#32](https://github.com/npm/hosted-git-info/issues/32)



<a name="2.6.1"></a>
## [2.6.1](https://github.com/npm/hosted-git-info/compare/v2.6.0...v2.6.1) (2018-06-25)

### Bug Fixes

* **Revert:** "compat: remove Object.assign fallback ([#25](https://github.com/npm/hosted-git-info/issues/25))" ([cce5a62](https://github.com/npm/hosted-git-info/commit/cce5a62))
* **Revert:** "git-host: fix forgotten extend()" ([a815ec9](https://github.com/npm/hosted-git-info/commit/a815ec9))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/npm/hosted-git-info/compare/v2.5.0...v2.6.0) (2018-03-07)


### Bug Fixes

* **compat:** remove Object.assign fallback ([#25](https://github.com/npm/hosted-git-info/issues/25)) ([627ab55](https://github.com/npm/hosted-git-info/commit/627ab55))
* **git-host:** fix forgotten extend() ([eba1f7b](https://github.com/npm/hosted-git-info/commit/eba1f7b))


### Features

* **browse:** fragment support for browse() ([#28](https://github.com/npm/hosted-git-info/issues/28)) ([cd5e5bb](https://github.com/npm/hosted-git-info/commit/cd5e5bb))
