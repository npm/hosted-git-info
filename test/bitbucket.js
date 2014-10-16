"use strict"
var HostedGit = require("../index")
var test = require("tap").test

test("fromUrl(bitbucket url)", function (t) {
  function verify(host, label, branch) {
    var hostinfo = HostedGit.fromUrl(host)
    var hash = branch ? "#" + branch : ""
    t.ok(hostinfo, label)
    if (! hostinfo) return
    t.is( hostinfo.https().toLowerCase(), "https://bitbucket.org/a/b.git" + hash, label + " -> https" )
    t.is( hostinfo.ssh().toLowerCase(), "git@bitbucket.org:a/b.git" + hash, label + " -> ssh" )
    t.is( hostinfo.sshurl().toLowerCase(), "git+ssh://git@bitbucket.org/a/b.git" + hash, label + " -> sshurl" )
    t.is( (""+hostinfo).toLowerCase(), "git+ssh://git@bitbucket.org/a/b.git" + hash, label + " -> stringify" )
    t.is( hostinfo.file("C").toLowerCase(), "https://bitbucket.org/a/b/raw/"+(branch||"master")+"/c", label + " -> file" )
  }

  require('./lib/standard-tests')(verify, "bitbucket.org", "bitbucket")

  t.end()
})

