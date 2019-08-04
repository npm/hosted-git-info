'use strict'
module.exports = function (verify, domain, shortname, proj) {
  proj = proj || '222'
  verify('https://' + domain + '/111/' + proj, 'https')
  verify('https://' + domain + '/111/' + proj + '.git', 'https.git')
  verify('https://' + domain + '/111/' + proj + '#branch', 'https#branch', 'branch')
  verify('https://' + domain + '/111/' + proj + '.git#branch', 'https.git#branch', 'branch')

  verify('git+https://' + domain + '/111/' + proj, 'git+https')
  verify('git+https://' + domain + '/111/' + proj + '.git', 'git+https.git')
  verify('git+https://' + domain + '/111/' + proj + '#branch', 'git+https#branch', 'branch')
  verify('git+https://' + domain + '/111/' + proj + '.git#branch', 'git+https.git#branch', 'branch')

  verify('git@' + domain + ':111/' + proj, 'ssh')
  verify('git@' + domain + ':111/' + proj + '.git', 'ssh.git')
  verify('git@' + domain + ':111/' + proj + '#branch', 'ssh', 'branch')
  verify('git@' + domain + ':111/' + proj + '.git#branch', 'ssh.git', 'branch')

  verify('git+ssh://git@' + domain + '/111/' + proj, 'ssh url')
  verify('git+ssh://git@' + domain + '/111/' + proj + '.git', 'ssh url.git')
  verify('git+ssh://git@' + domain + '/111/' + proj + '#branch', 'ssh url#branch', 'branch')
  verify('git+ssh://git@' + domain + '/111/' + proj + '.git#branch', 'ssh url.git#branch', 'branch')

  verify(shortname + ':111/' + proj, 'shortcut')
  verify(shortname + ':111/' + proj + '.git', 'shortcut.git')
  verify(shortname + ':111/' + proj + '#branch', 'shortcut#branch', 'branch')
  verify(shortname + ':111/' + proj + '.git#branch', 'shortcut.git#branch', 'branch')
}
