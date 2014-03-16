var events = require('events');
var util = require('util');

var debug = require('debug')('chipolo');

var noble = require('noble');

var SERVICE_UUID                            = '451085d6f8334f7783d44f9438894ed5';

var SYSTEM_ID_UUID                          = '2a23';
var MODEL_NUMBER_UUID                       = '2a24';
var SERIAL_NUMBER_UUID                      = '2a25';
var FIRMWARE_REVISION_UUID                  = '2a26';
var HARDWARE_REVISION_UUID                  = '2a27';
var SOFTWARE_REVISION_UUID                  = '2a28';
var MANUFACTURER_NAME_UUID                  = '2a29';

var STATE_UUID                              = 'fff0';
var MY_ID_UUID                              = 'fff1';
var DEV_ID_UUID                             = 'fff2';
var CODE_UUID                               = 'fff3';
var BEEP_UUID                               = 'fff4';
var NOTIFICATION_UUID                       = 'fff7';
var TEMPERATURE_UUID                        = 'fff8';
var BATTERY_UUID                            = 'fffa';

var CONTROL_UUID                            = 'ffe0';

var COLOUR_MAPPER = [
  'gray',
  'white',
  'black',
  'violet',
  'blue',
  'green',
  'yellow',
  'orange',
  'red',
  'pink'
];

function Chipolo(peripheral) {
  this._peripheral = peripheral;
  this._services = {};
  this._characteristics = {};

  this.uuid = peripheral.uuid;

  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    var colorCode = serviceData[0].data[0];

    this.color = COLOUR_MAPPER[colorCode] || 'unknown';
  }

  this._peripheral.on('disconnect', this.onDisconnect.bind(this));
}

util.inherits(Chipolo, events.EventEmitter);

Chipolo.discover = function(callback) {
  var startScanningOnPowerOn = function() {
    if (noble.state === 'poweredOn') {
      var onDiscover = function(peripheral) {
        noble.removeListener('discover', onDiscover);

        noble.stopScanning();

        var chiplo = new Chipolo(peripheral);

        callback(chiplo);
      };

      noble.on('discover', onDiscover);

      noble.startScanning([SERVICE_UUID]);
    } else {
      noble.once('stateChange', startScanningOnPowerOn);
    }
  };

  startScanningOnPowerOn();
};

Chipolo.prototype.onDisconnect = function() {
  this.emit('disconnect');
};

Chipolo.prototype.toString = function() {
  return JSON.stringify({
    uuid: this.uuid,
    color: this.color
  });
};

Chipolo.prototype.connect = function(callback) {
  this._peripheral.connect(function() {
    callback();
  });
};

Chipolo.prototype.disconnect = function(callback) {
  this._peripheral.disconnect(callback);
};

Chipolo.prototype.discoverServicesAndCharacteristics = function(callback) {
  this._peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
    if (error === null) {
      for (var i in services) {
        var service = services[i];
        this._services[service.uuid] = service;
      }

      for (var j in characteristics) {
        var characteristic = characteristics[j];

        this._characteristics[characteristic.uuid] = characteristic;
      }
    }

    callback();
  }.bind(this));
};

Chipolo.prototype.readDataCharacteristic = function(uuid, callback) {
  this._characteristics[uuid].read(function(error, data) {
    callback(data);
  });
};

Chipolo.prototype.writeDataCharacteristic = function(uuid, data, callback) {
  this._characteristics[uuid].write(data, false, function(error) {
    if (callback) {
      callback();
    }
  });
};

Chipolo.prototype.readStringCharacteristic = function(uuid, callback) {
  this.readDataCharacteristic(uuid, function(data) {
    callback(data.toString());
  });
};

Chipolo.prototype.readUInt8Characteristic = function(uuid, callback) {
  this.readDataCharacteristic(uuid, function(data) {
    callback(data.readUInt8(0));
  });
};

Chipolo.prototype.pair = function(callback) {
  var stateCharacteristic = this._characteristics[STATE_UUID];

  stateCharacteristic.once('read', function(stateData, isNotification) {
    debug('State = ' + stateData.toString('hex'));

    this.readDataCharacteristic(MY_ID_UUID, function(myIdData) {
      debug('My ID = ' + myIdData.toString('hex'));
      
      this.id = myIdData.toString('hex');

      var devIdData = new Buffer(this.uuid, 'hex');

      if (devIdData.length === 6) {
        devIdData = Buffer.concat([devIdData, new Buffer('00000000000000000000', 'hex')]);
      }

      debug('Dev ID = ' + devIdData.toString('hex'));

      this.writeDataCharacteristic(DEV_ID_UUID, devIdData, function() {
        var codeData = new Buffer(7);

        codeData[0] = myIdData[0] ^ devIdData[3];
        codeData[1] = myIdData[1];
        codeData[2] = myIdData[2] ^ devIdData[11];
        codeData[3] = myIdData[3];
        codeData[4] = myIdData[4] ^ devIdData[13];
        codeData[5] = myIdData[5];

        codeData[2] = codeData[2] ^ devIdData[4];
        codeData[3] = codeData[3] ^ devIdData[5];
        codeData[4] = codeData[4] ^ devIdData[6];
        codeData[5] = codeData[5] ^ devIdData[7];

        codeData[6] = 0;

        stateCharacteristic.once('read', function(stateData, isNotification) {
          debug('State = ' + stateData.toString('hex'));

          var success = (stateData[0] & 0xe0) === 0;

          stateCharacteristic.notify(false, function() {
            callback(success);
          }.bind(this));
        }.bind(this));

        debug('Code = ' + codeData.toString('hex'));
        this.writeDataCharacteristic(CODE_UUID, codeData);
      }.bind(this));
    }.bind(this));
  }.bind(this));

  stateCharacteristic.notify(true);
};

Chipolo.prototype.readSystemId = function(callback) {
  this.readDataCharacteristic(SYSTEM_ID_UUID, function(data) {
    callback(data.toString('hex'));
  }.bind(this));
};

Chipolo.prototype.readModelNumber = function(callback) {
  this.readStringCharacteristic(MODEL_NUMBER_UUID, callback);
};

Chipolo.prototype.readSerialNumber = function(callback) {
  this.readStringCharacteristic(SERIAL_NUMBER_UUID, callback);
};

Chipolo.prototype.readFirmwareRevision = function(callback) {
  this.readStringCharacteristic(FIRMWARE_REVISION_UUID, callback);
};

Chipolo.prototype.readHardwareRevision = function(callback) {
  this.readStringCharacteristic(HARDWARE_REVISION_UUID, callback);
};

Chipolo.prototype.readSoftwareRevision = function(callback) {
  this.readStringCharacteristic(SOFTWARE_REVISION_UUID, callback);
};

Chipolo.prototype.readManufacturerName = function(callback) {
  this.readStringCharacteristic(MANUFACTURER_NAME_UUID, callback);
};

Chipolo.prototype.readTemperature = function(callback) {
  this.readUInt8Characteristic(TEMPERATURE_UUID, callback);
};

Chipolo.prototype.readTemperature = function(callback) {
  this.readUInt8Characteristic(TEMPERATURE_UUID, callback);
};

Chipolo.prototype.readIsBatteryLow = function(callback) {
  this.readUInt8Characteristic(BATTERY_UUID, function(level) {
    debug('battery level = ' + level);

    callback(level < 175.0);
  }.bind(this));
};

Chipolo.prototype.setAudioNotifications = function(inRange, outOfRange, shakeAndFind, callback) {
  var value = 0;

  if (inRange) {
    value |= 2;
  }

  if (outOfRange) {
    value |= 1;
  }

  if (shakeAndFind) {
    value |= 4;
  }

  this.writeDataCharacteristic(NOTIFICATION_UUID, new Buffer([value]), callback);
};

Chipolo.prototype.beep = function(callback) {
  this.writeDataCharacteristic(BEEP_UUID, new Buffer('01', 'hex'), callback);
};

Chipolo.prototype.estimateDistance = function(callback) {
  this._peripheral.updateRssi(function(error, rssi) {
    debug('rssi = ' + rssi);

    var estimatedDistance = Math.max(0, Math.min(100.0 * (-55.0 - rssi) / (-55.0 + 100.0), 100.0));

    callback(estimatedDistance);
  }.bind(this));
};

module.exports = Chipolo;
