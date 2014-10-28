"use strict"
var HostedGit = require("../index")
var test = require("tap").test


test("fromUrl(gitlab url)", function (t) {
  function verify(host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? "#" + branch : ""
    t.ok(hostinfo, label)
    if (! hostinfo) return
    t.is( hostinfo.https().toLowerCase(), "https://gitlab.com/a/b.git" + hash, label + " -> https" )
    t.is( hostinfo.browse().toLowerCase(), "https://gitlab.com/a/b", label + " -> browse" )
    t.is( hostinfo.ssh().toLowerCase(), "git@gitlab.com:a/b.git" + hash, label + " -> ssh" )
    t.is( hostinfo.sshurl().toLowerCase(), "git+ssh://git@gitlab.com/a/b.git" + hash, label + " -> sshurl" )
    t.is( (""+hostinfo).toLowerCase(), "git+ssh://git@gitlab.com/a/b.git" + hash, label + " -> stringify" )
    t.is( hostinfo.file("C").toLowerCase(), "https://gitlab.com/a/b/raw/"+(branch||"master")+"/c", label + " -> file" )
  }

  require('./lib/standard-tests')(verify, "gitlab.com", "gitlab")

  t.end()
})

