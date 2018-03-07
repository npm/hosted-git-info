var protocol = '(?:([^:]+:)?(?://)?)?'
var auth = '(?:(\\S+(?::\\S*)?)@)?'
var host = '([^/:]*)'
var path = '([/]?[^#]*)'
var hash = '(#.+)?'
var urlLaxRegex = new RegExp(protocol + auth + host + path + hash)

module.exports.parse = function (url) {
  var match = url.match(urlLaxRegex)
  if (match) {
    var path = match[4]
    if (path && path[0] !== '/') {
      path = '/' + path
    }
    return {
      protocol: match[1],
      auth: match[2],
      host: match[3],
      path: path,
      hash: match[5]
    }
  }
}
