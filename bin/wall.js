module.exports = function(options) {
  function printList(r) {
    options.deviceRef.once('value', function(devices) {
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
    options.deviceRef.once('value', function(data) {
      data.forEach(function(device) {
        var name = device.child('name').val(),
            foundDevice = null;

        if (deviceName.toLowerCase().trim() === name.toLowerCase().trim() || deviceName === 'all') {
          foundDevice = options.deviceRef.child(device.key());
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
    options.deviceRef.once('value', function(data) {
      this.devices = data;
    });
  }

  function _fetchWalls() {
    options.wallRef.once('value', function(data) {
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
};
