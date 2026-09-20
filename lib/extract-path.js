'use strict'

// GROUP/SUBGROUP/REPO (and deeper) paths used by GitLab and similar hosts.
// The last segment is the project; everything before it is the namespace.
function extractNestedPath (url) {
  const path = url.pathname.replace(/^\/+/, '')
  const segments = path.split('/')
  let project = segments.pop()
  if (!project) {
    return
  }

  if (project.endsWith('.git')) {
    project = project.slice(0, -4)
  }

  const user = segments.join('/')
  if (!user || !project) {
    return
  }

  return { user, project, committish: url.hash.slice(1) }
}

module.exports = extractNestedPath
