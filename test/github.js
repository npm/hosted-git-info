"use strict"
var HostedGit = require("../index")
var test = require("tap").test


test("fromUrl(github url)", function (t) {
  function verify(host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? "#" + branch : ""
    t.ok(hostinfo, label)
    if (! hostinfo) return
    t.is( hostinfo.https().toLowerCase(), "https://github.com/a/b.git" + hash, label + " -> https" )
    t.is( hostinfo.browse().toLowerCase(), "https://github.com/a/b" + (branch ? "/tree/" + branch : ""), label + " -> browse" )
    t.is( hostinfo.ssh().toLowerCase(), "git@github.com:a/b.git" + hash, label + " -> ssh" )
    t.is( hostinfo.sshurl().toLowerCase(), "git+ssh://git@github.com/a/b.git" + hash, label + " -> sshurl" )
    t.is( (""+hostinfo).toLowerCase(), "git+ssh://git@github.com/a/b.git" + hash, label + " -> stringify" )
    t.is( hostinfo.file("C").toLowerCase(), "https://raw.githubusercontent.com/a/b/"+(branch||"master")+"/c", label + " -> file" )
  }

  verify("git://github.com/A/B", "git")
  verify("git://github.com/A/B.git", "git.git")
  verify("git://github.com/A/B#branch", "git#branch", "branch")
  verify("git://github.com/A/B.git#branch", "git.git#branch", "branch")

  require('./lib/standard-tests')(verify, "github.com", "github")

  t.end()
})

