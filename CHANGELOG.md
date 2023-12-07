# Changelog

## [7.0.2](https://github.com/npm/hosted-git-info/compare/v7.0.1...v7.0.2) (2023-12-07)

### Chores

* [`7a888b0`](https://github.com/npm/hosted-git-info/commit/7a888b014982957049d194bec6f54444a8a7a0fa) [#242](https://github.com/npm/hosted-git-info/pull/242) postinstall for dependabot template-oss PR (@lukekarrys)
* [`4b5cf45`](https://github.com/npm/hosted-git-info/commit/4b5cf45c513f4c4fd7f826013e73f86aa879afe7) [#242](https://github.com/npm/hosted-git-info/pull/242) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`c68f178`](https://github.com/npm/hosted-git-info/commit/c68f178272e906f9cd7e1da036e0a0f6d29bbeb7) [#240](https://github.com/npm/hosted-git-info/pull/240) postinstall for dependabot template-oss PR (@lukekarrys)
* [`c385414`](https://github.com/npm/hosted-git-info/commit/c38541477d18b387009eda2e44df973a4a5aaa80) [#240](https://github.com/npm/hosted-git-info/pull/240) bump @npmcli/template-oss from 4.21.0 to 4.21.1 (@dependabot[bot])
* [`aa4de55`](https://github.com/npm/hosted-git-info/commit/aa4de5521363838a16965445a6b732209fd689e5) [#235](https://github.com/npm/hosted-git-info/pull/235) postinstall for dependabot template-oss PR (@lukekarrys)
* [`d5f54af`](https://github.com/npm/hosted-git-info/commit/d5f54aff2bffbed2d4f17d5e1205c9681d8a845c) [#235](https://github.com/npm/hosted-git-info/pull/235) bump @npmcli/template-oss from 4.19.0 to 4.21.0 (@dependabot[bot])
* [`6b85ba2`](https://github.com/npm/hosted-git-info/commit/6b85ba202806a33244db01be0cb64007a3d57f1a) [#217](https://github.com/npm/hosted-git-info/pull/217) postinstall for dependabot template-oss PR (@lukekarrys)
* [`9857ef1`](https://github.com/npm/hosted-git-info/commit/9857ef16015005fc83af0a7708285284528b0821) [#217](https://github.com/npm/hosted-git-info/pull/217) bump @npmcli/template-oss from 4.18.1 to 4.19.0 (@dependabot[bot])
* [`7a29320`](https://github.com/npm/hosted-git-info/commit/7a293205c5c3304f7d1889111e6264207a015476) [#214](https://github.com/npm/hosted-git-info/pull/214) postinstall for dependabot template-oss PR (@lukekarrys)
* [`674b568`](https://github.com/npm/hosted-git-info/commit/674b568a678e1ec1afe150c18bf1c02a5f755fe5) [#214](https://github.com/npm/hosted-git-info/pull/214) bump @npmcli/template-oss from 4.18.0 to 4.18.1 (@dependabot[bot])

## [7.0.1](https://github.com/npm/hosted-git-info/compare/v7.0.0...v7.0.1) (2023-09-13)

### Bug Fixes

* [`d7bac33`](https://github.com/npm/hosted-git-info/commit/d7bac33726d6a65788d16e3314f52449f0da58c4) [#213](https://github.com/npm/hosted-git-info/pull/213) remove sourcehut bugstemplate (#213) (@vladh)

## [7.0.0](https://github.com/npm/hosted-git-info/compare/v6.1.1...v7.0.0) (2023-08-14)

### ⚠️ BREAKING CHANGES

* support for node 14 has been removed

### Bug Fixes

* [`f9f7fde`](https://github.com/npm/hosted-git-info/commit/f9f7fde1385d3f99ed7a52b9d4b079d8074fc99f) [#209](https://github.com/npm/hosted-git-info/pull/209) use lru-cache named export (@lukekarrys)
* [`c98e908`](https://github.com/npm/hosted-git-info/commit/c98e90807775bf5c306a30426d7f6c6ebe9842d5) [#209](https://github.com/npm/hosted-git-info/pull/209) drop node14 support (@lukekarrys)

### Dependencies

* [`ecdd7de`](https://github.com/npm/hosted-git-info/commit/ecdd7decf24f66297ca5f459b4f1f36d41352e23) [#209](https://github.com/npm/hosted-git-info/pull/209) bump lru-cache from 7.18.3 to 10.0.1

## [6.1.1](https://github.com/npm/hosted-git-info/compare/v6.1.0...v6.1.1) (2022-10-27)

### Bug Fixes

* [`f03bfbd`](https://github.com/npm/hosted-git-info/commit/f03bfbd3022c8f6283a991ff879ed97704ac35fa) [#176](https://github.com/npm/hosted-git-info/pull/176) only correct protocols when called from githost (@lukekarrys)

## [6.1.0](https://github.com/npm/hosted-git-info/compare/v6.0.0...v6.1.0) (2022-10-26)

### Features

* [`a44bd35`](https://github.com/npm/hosted-git-info/commit/a44bd35820eaa6878f13ee12eba5dca6425ea2bd) [#172](https://github.com/npm/hosted-git-info/pull/172) add separate static method for just parsing urls (@lukekarrys)

## [6.0.0](https://github.com/npm/hosted-git-info/compare/v5.1.0...v6.0.0) (2022-10-12)

### ⚠️ BREAKING CHANGES

* `GitHost` now has a static `addHost` method to use instead of manually editing the object from `lib/git-host-info.js`.
* set default git ref to HEAD
* `hosted-git-info` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`9e0ce62`](https://github.com/npm/hosted-git-info/commit/9e0ce62b9aadb2a9cfe8999e96b004a5de4edfdf) [#142](https://github.com/npm/hosted-git-info/pull/142) refactor (@lukekarrys)
* [`89155e8`](https://github.com/npm/hosted-git-info/commit/89155e8799369f20ae71713f64e3d0f664192a58) set default git ref to HEAD (@darcyclarke)
* [`9ed9c38`](https://github.com/npm/hosted-git-info/commit/9ed9c38002f899ad2628f96b27b2ec9fecb4662f) [#162](https://github.com/npm/hosted-git-info/pull/162) postinstall for dependabot template-oss PR (@lukekarrys)

### Bug Fixes

* [`61ca7fb`](https://github.com/npm/hosted-git-info/commit/61ca7fb8f003299693e23f351eea589c38a3602c) [#152](https://github.com/npm/hosted-git-info/pull/152) parse branch names containing @ (@lukekarrys)
* [`3cd4a98`](https://github.com/npm/hosted-git-info/commit/3cd4a9881e20d3a59bf3bb470661a29208824dd6) ignore colons after hash when correcting scp urls (@lukekarrys)

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
