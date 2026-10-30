'use strict'

const { LRUCache } = require('./lru-cache.js')
const hosts = require('./hosts.js')
const fromUrl = require('./from-url.js')
const parseUrl = require('./parse-url.js')

const cache = new LRUCache()

function unknownHostedUrl (url) {
  try {
    const {
      protocol,
      hostname,
      pathname,
    } = new URL(url)

    if (!hostname) {
      return null
    }

    const proto = /(?:git\+)http:$/.test(protocol) ? 'http:' : 'https:'
    const path = pathname.replace(/\.git$/, '')
    return `${proto}//${hostname}${path}`
  } catch {
    return null
  }
}

class GitHost {
  constructor (type, user, auth, project, committish, defaultRepresentation, opts = {}) {
    Object.assign(this, GitHost.#gitHosts[type], {
      type,
      user,
      auth,
      project,
      committish,
      default: defaultRepresentation,
      opts,
    })
  }

  static #gitHosts = { byShortcut: {}, byDomain: {} }
  static #protocols = {
    'git+ssh:': { name: 'sshurl' },
    'ssh:': { name: 'sshurl' },
    'git+https:': { name: 'https', auth: true },
    'git:': { auth: true },
    'http:': { auth: true },
    'https:': { auth: true },
    'git+http:': { auth: true },
  }

  static addHost (name, host) {
    cache.clear()
    GitHost.#gitHosts[name] = host
    GitHost.#gitHosts.byDomain[host.domain] = name
    GitHost.#gitHosts.byShortcut[`${name}:`] = name
    GitHost.#protocols[`${name}:`] = { name }
  }

  static fromUrl (giturl, opts) {
    if (typeof giturl !== 'string') {
      return
    }

    const key = giturl + JSON.stringify(opts || {})

    if (!cache.has(key)) {
      const hostArgs = fromUrl(giturl, opts, {
        gitHosts: GitHost.#gitHosts,
        protocols: GitHost.#protocols,
      })
      cache.set(key, hostArgs ? new GitHost(...hostArgs) : null)
    }

    return cache.get(key) ?? undefined
  }

  static fromManifest (manifest, opts = {}) {
    if (!manifest || typeof manifest !== 'object') {
      return
    }

    const r = manifest.repository
    // TODO: look into also checking the `bugs`/`homepage` URLs

    const rurl = r && (
      typeof r === 'string'
        ? r
        : typeof r === 'object' && typeof r.url === 'string'
          ? r.url
          : null
    )

    if (!rurl) {
      throw new Error('no repository')
    }

    // opt-in, so that existing consumers keep getting repository root urls
    const hostOpts = opts?.useDirectory && typeof r === 'object' && typeof r.directory === 'string'
      ? { ...opts, directory: r.directory }
      : opts

    const info = (rurl && GitHost.fromUrl(rurl.replace(/^git\+/, ''), hostOpts)) || null
    if (info) {
      return info
    }
    const unk = unknownHostedUrl(rurl)
    return GitHost.fromUrl(unk, hostOpts) || unk
  }

  static parseUrl (url) {
    return parseUrl(url)
  }

  #fill (template, opts) {
    if (typeof template !== 'function') {
      return null
    }

    const options = { ...this, ...this.opts, ...opts }

    // the path should always be set so we don't end up with 'undefined' in urls
    if (!options.path) {
      options.path = ''
    }

    // template functions will insert the leading slash themselves
    if (options.path.startsWith('/')) {
      options.path = options.path.slice(1)
    }

    if (options.noCommittish) {
      options.committish = null
    }

    const result = template(options)
    return options.noGitPlus && result.startsWith('git+') ? result.slice(4) : result
  }

  hash () {
    return this.committish ? `#${this.committish}` : ''
  }

  ssh (opts) {
    return this.#fill(this.sshtemplate, opts)
  }

  sshurl (opts) {
    return this.#fill(this.sshurltemplate, opts)
  }

  browse (path, ...args) {
    // not a string, treat path as opts
    if (typeof path !== 'string') {
      return this.#fill(this.browsetemplate, path)
    }

    if (typeof args[0] !== 'string') {
      return this.#fill(this.browsetreetemplate, { ...args[0], path })
    }

    return this.#fill(this.browsetreetemplate, { ...args[1], fragment: args[0], path })
  }

  // If the path is known to be a file, then browseFile should be used. For some hosts
  // the url is the same as browse, but for others like GitHub a file can use both `/tree/`
  // and `/blob/` in the path. When using a default committish of `HEAD` then the `/tree/`
  // path will redirect to a specific commit. Using the `/blob/` path avoids this and
  // does not redirect to a different commit.
  browseFile (path, ...args) {
    if (typeof args[0] !== 'string') {
      return this.#fill(this.browseblobtemplate, { ...args[0], path })
    }

    return this.#fill(this.browseblobtemplate, { ...args[1], fragment: args[0], path })
  }

  docs (opts) {
    return this.#fill(this.docstemplate, opts)
  }

  bugs (opts) {
    return this.#fill(this.bugstemplate, opts)
  }

  https (opts) {
    return this.#fill(this.httpstemplate, opts)
  }

  git (opts) {
    return this.#fill(this.gittemplate, opts)
  }

  shortcut (opts) {
    return this.#fill(this.shortcuttemplate, opts)
  }

  path (opts) {
    return this.#fill(this.pathtemplate, opts)
  }

  tarball (opts) {
    return this.#fill(this.tarballtemplate, { ...opts, noCommittish: false })
  }

  file (path, opts) {
    const { directory } = { ...this.opts, ...opts }
    const isString = typeof directory === 'string'
    const dirSegments = isString
      ? directory.split(/[\\/]/).filter((segment) => segment && segment !== '.')
      : []
    // a directory that tries to escape the repository (eg, from an untrusted
    // manifest's `repository.directory`) is ignored entirely. this includes
    // forms that only become `..` once the url parser strips tabs and newlines,
    // decodes `%2e`, and ends the path at `?` or `#`, or once the host decodes
    // `%2f` or `%5c`
    const escapes = isString && directory
      .replace(/[\t\n\r]/g, '')
      .replace(/%2e/gi, '.')
      .split(/[\\/?#]|%2f|%5c/i)
      .includes('..')
    const dir = escapes ? '' : dirSegments.join('/')
    if (dir) {
      path = `${dir}/${typeof path === 'string' ? path.replace(/^\/+/, '') : ''}`
    }

    return this.#fill(this.filetemplate, { ...opts, path })
  }

  edit (path, opts) {
    return this.#fill(this.edittemplate, { ...opts, path })
  }

  getDefaultRepresentation () {
    return this.default
  }

  toString (opts) {
    if (this.default && typeof this[this.default] === 'function') {
      return this[this.default](opts)
    }

    return this.sshurl(opts)
  }
}

for (const [name, host] of Object.entries(hosts)) {
  GitHost.addHost(name, host)
}

module.exports = GitHost
