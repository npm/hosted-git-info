"use strict"
module.exports = function (verify, domain, shortname) {
  verify("https://" + domain + "/A/B", "https")
  verify("https://" + domain + "/A/B.git", "https.git")
  verify("https://" + domain + "/A/B#branch", "https#branch", "branch")
  verify("https://" + domain + "/A/B.git#branch", "https.git#branch", "branch")

  verify("git+https://" + domain + "/A/B", "git+https")
  verify("git+https://" + domain + "/A/B.git", "git+https.git")
  verify("git+https://" + domain + "/A/B#branch", "git+https#branch", "branch")
  verify("git+https://" + domain + "/A/B.git#branch", "git+https.git#branch", "branch")

  verify("git@" + domain + ":A/B", "ssh")
  verify("git@" + domain + ":A/B.git", "ssh.git")
  verify("git@" + domain + ":A/B#branch", "ssh", "branch")
  verify("git@" + domain + ":A/B.git#branch", "ssh.git", "branch")


  verify("git+ssh://git@" + domain + "/A/B", "ssh url")
  verify("git+ssh://git@" + domain + "/A/B.git", "ssh url.git")
  verify("git+ssh://git@" + domain + "/A/B#branch", "ssh url#branch", "branch")
  verify("git+ssh://git@" + domain + "/A/B.git#branch", "ssh url.git#branch", "branch")

  verify(shortname + ":A/B", "shortcut")
  verify(shortname + ":A/B.git", "shortcut.git")
  verify(shortname + ":A/B#branch", "shortcut#branch", "branch")
  verify(shortname + ":A/B.git#branch", "shortcut.git#branch", "branch")
}
