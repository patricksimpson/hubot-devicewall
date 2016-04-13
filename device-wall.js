var Firebase = require("firebase");
var fs = require("fs");
var nconf = require("nconf");
var config = require("./config.json");
var FirebaseTokenGenerator = require("firebase-token-generator");

var tokenGenerator = new FirebaseTokenGenerator(config.firebaseSecret);
var token = tokenGenerator.createToken({uid: "1", isAdmin: true});
var ref = new Firebase(config.firebaseUrl);
var wallRef = new Firebase(config.firebaseUrl+ "/walls");
var deviceRef = new Firebase(config.firebaseUrl+ "/devices");

var wall = require('bin/wall', {
  ref: ref,
  wallRef: wallRef,
  deviceRef: deviceRef
});

ref.authWithCustomToken("AUTH_TOKEN", function(error, authData) {
  if (error) {
    console.log("Authentication Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});

wall.init();

module.exports = function(robot) {
  robot.respond(/device list/i, function(res) {
    wall.printList(res);
  });

  robot.respond(/device test (.*) (.*)?/i, function(res) {
    var url = res.match[1],
        device = res.match[2] || 'all';
    res.emote('Set ' +  res.match[1] +  ' on ' + res.match[2]);
    wall.updateDeviceUrl(url, device, res);
  });
};
