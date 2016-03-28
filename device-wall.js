var Firebase = require("firebase"),
    config = require("config.json"),
    wallRef = new Firebase(config.firebaseURL + "/walls"),
    deviceRef = new Firebase(config.firebaseURL + "/devices"),
    wall = (function() {

      function printList(r) {
        deviceRef.once('value', function(devices) {
          devices.forEach(function(device) {
            r.emote(device.child('name').val());
          });
        });
      }

      function getDeviceList() {
        // Refresh the data; Return new list;
        _fetchDevices();
        return this.devices;
      }

      function getWall() {
        // Refresh the data; Return wall data;
        _fetchWalls();
        return this.wall;
      }

      function updateDeviceUrl(url, deviceName, r) {
        deviceRef.once('value', function(data) {
          data.forEach(function(device) {
            var name = device.child('name').val(),
                foundDevice = null;

            if (deviceName.toLowerCase().trim() === name.toLowerCase().trim() || deviceName === 'all') {
              foundDevice = deviceRef.child(device.key());
              foundDevice.update({
                'url': url
              }, function(error) {
                if (error) {
                  r.emote('Error: ' + error.toString());
                } else {
                  r.emote(name + ' now pointing to ' + url);
                }
              });
            }
          });
        });
      }

      function _fetchDevices() {
        deviceRef.once('value', function(data) {
          this.devices = data;
        });
      }

      function _fetchWalls() {
        wallRef.once('value', function(data) {
          this.walls = data;
        });
      }

      function init() {
        _fetchDevices();
        _fetchWalls();
      }

      return {
        list: getDeviceList,
        info: getWall,
        printList: printList,
        updateDeviceUrl: updateDeviceUrl,
        init: init
      };
    })();

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
