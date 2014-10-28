"use strict"
var HostedGit = require("../index")
var test = require("tap").test


test("fromUrl(github url)", function (t) {
  function verify(host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? "#" + branch : ""
    t.ok(hostinfo, label)
    if (! hostinfo) return
    t.is( hostinfo.https(), "https://github.com/111/222.git" + hash, label + " -> https" )
    t.is( hostinfo.git(), "git://github.com/111/222.git" + hash, label + " -> git" )
    t.is( hostinfo.browse(), "https://github.com/111/222" + (branch ? "/tree/" + branch : ""), label + " -> browse" )
    t.is( hostinfo.bugs(), "https://github.com/111/222/issues", label + " -> bugs" )
    t.is( hostinfo.docs(), "https://github.com/111/222" + (branch ? "/tree/" + branch : "") + "#readme", label + " -> docs" )
    t.is( hostinfo.ssh(), "git@github.com:111/222.git" + hash, label + " -> ssh" )
    t.is( hostinfo.sshurl(), "git+ssh://git@github.com/111/222.git" + hash, label + " -> sshurl" )
    t.is( (""+hostinfo), "git+ssh://git@github.com/111/222.git" + hash, label + " -> stringify" )
    t.is( hostinfo.file("C"), "https://raw.githubusercontent.com/111/222/"+(branch||"master")+"/C", label + " -> file" )
  }

  verify("git://github.com/111/222", "git")
  verify("git://github.com/111/222.git", "git.git")
  verify("git://github.com/111/222#branch", "git#branch", "branch")
  verify("git://github.com/111/222.git#branch", "git.git#branch", "branch")

  require('./lib/standard-tests')(verify, "github.com", "github")

  t.end()
})

